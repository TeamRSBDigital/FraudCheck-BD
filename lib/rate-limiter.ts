/**
 * Server-side daily rate limiting.
 *
 * Production:
 * - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are configured,
 *   counters persist across Vercel/serverless instances.
 * - Otherwise a memory store is used for local development only.
 * - Client IPs are HMAC-hashed before being used as storage keys.
 */

import { createHmac } from 'crypto';
import { RateLimitStatus } from '../src/types/index';

interface RateLimitStore {
  getCount(key: string): Promise<number>;
  increment(key: string, ttlSeconds: number): Promise<number>;
}

class MemoryRateLimitStore implements RateLimitStore {
  private records = new Map<string, { count: number; expiresAt: number }>();

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.records.entries()) {
      if (value.expiresAt <= now) this.records.delete(key);
    }
  }

  async getCount(key: string): Promise<number> {
    this.cleanup();
    return this.records.get(key)?.count ?? 0;
  }

  async increment(key: string, ttlSeconds: number): Promise<number> {
    this.cleanup();
    const now = Date.now();
    const existing = this.records.get(key);

    if (existing && existing.expiresAt > now) {
      existing.count += 1;
      return existing.count;
    }

    const value = {
      count: 1,
      expiresAt: now + ttlSeconds * 1000,
    };
    this.records.set(key, value);
    return value.count;
  }
}

class UpstashRestRateLimitStore implements RateLimitStore {
  constructor(
    private readonly url: string,
    private readonly token: string
  ) {}

  private async command<T>(payload: unknown[]): Promise<T> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Rate-limit store returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as { result?: T; error?: string };
    if (data.error) {
      throw new Error(`Rate-limit store error: ${data.error}`);
    }

    return data.result as T;
  }

  async getCount(key: string): Promise<number> {
    const value = await this.command<string | number | null>(['GET', key]);
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  async increment(key: string, ttlSeconds: number): Promise<number> {
    const script =
      "local current = redis.call('INCR', KEYS[1]); " +
      "if current == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; " +
      "return current";

    const value = await this.command<string | number>([
      'EVAL',
      script,
      '1',
      key,
      String(ttlSeconds),
    ]);

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new Error('Rate-limit store returned an invalid counter');
    }
    return parsed;
  }
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export class RateLimiter {
  private readonly store: RateLimitStore;
  private readonly maxLimit: number;
  private readonly timezoneOffsetMinutes: number;
  private readonly hmacSecret: string;

  constructor() {
    this.maxLimit = parsePositiveInt(process.env.DAILY_FREE_LIMIT, 50);
    this.timezoneOffsetMinutes = Number.isFinite(
      Number.parseInt(process.env.RATE_LIMIT_TIMEZONE_OFFSET_MINUTES || '', 10)
    )
      ? Number.parseInt(process.env.RATE_LIMIT_TIMEZONE_OFFSET_MINUTES || '360', 10)
      : 360;

    this.hmacSecret =
      process.env.RATE_LIMIT_SALT?.trim() ||
      process.env.BDCOURIER_API_KEY?.trim() ||
      'fraudcheck-bd-local-rate-limit-salt';

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

    if (redisUrl && redisToken) {
      this.store = new UpstashRestRateLimitStore(redisUrl.replace(/\/+$/, ''), redisToken);
    } else {
      this.store = new MemoryRateLimitStore();
      if (process.env.NODE_ENV === 'production') {
        console.warn(
          '[RateLimiter] Persistent Redis is not configured. Serverless instances may not share the same daily counter.'
        );
      }
    }
  }

  private getWindow(nowMs = Date.now()): {
    keyDate: string;
    resetTime: number;
    ttlSeconds: number;
  } {
    const offsetMs = this.timezoneOffsetMinutes * 60_000;
    const shifted = new Date(nowMs + offsetMs);
    const year = shifted.getUTCFullYear();
    const month = shifted.getUTCMonth();
    const day = shifted.getUTCDate();

    const nextLocalMidnightAsUtc = Date.UTC(year, month, day + 1, 0, 0, 0);
    const resetTime = nextLocalMidnightAsUtc - offsetMs;
    const ttlSeconds = Math.max(60, Math.ceil((resetTime - nowMs) / 1000));

    return {
      keyDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      resetTime,
      ttlSeconds,
    };
  }

  private buildKey(identifier: string, keyDate: string): string {
    const digest = createHmac('sha256', this.hmacSecret)
      .update(identifier)
      .digest('hex')
      .slice(0, 32);

    return `fraudcheck:daily:${keyDate}:${digest}`;
  }

  async check(identifier: string): Promise<RateLimitStatus> {
    const window = this.getWindow();
    const key = this.buildKey(identifier, window.keyDate);
    const count = await this.store.getCount(key);

    return {
      allowed: count < this.maxLimit,
      limit: this.maxLimit,
      remaining: Math.max(0, this.maxLimit - count),
      resetTime: window.resetTime,
    };
  }

  async consume(identifier: string): Promise<RateLimitStatus> {
    const window = this.getWindow();
    const key = this.buildKey(identifier, window.keyDate);
    const count = await this.store.increment(key, window.ttlSeconds);

    return {
      allowed: count <= this.maxLimit,
      limit: this.maxLimit,
      remaining: Math.max(0, this.maxLimit - count),
      resetTime: window.resetTime,
    };
  }

  async getStatus(identifier: string): Promise<RateLimitStatus> {
    return this.check(identifier);
  }
}

export const defaultRateLimiter = new RateLimiter();
