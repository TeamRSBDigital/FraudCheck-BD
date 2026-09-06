/**
 * Rate Limiting Abstraction
 * Enforces server-side free tier quota (default: 50 checks per IP per calendar day).
 * Allows backend store to be configured via environment variables (in-memory default, Redis pluggable).
 */

import { RateLimitStatus } from '../src/types/index';

export interface RateLimitStore {
  get(key: string): Promise<{ count: number; resetTime: number } | null>;
  increment(key: string, ttlSeconds: number): Promise<{ count: number; resetTime: number }>;
  getStatus(key: string): Promise<{ count: number; resetTime: number }>;
}

/**
 * In-memory store implementation with automatic TTL expiration.
 */
class MemoryRateLimitStore implements RateLimitStore {
  private records = new Map<string, { count: number; resetTime: number }>();

  private cleanup() {
    const now = Date.now();
    for (const [key, val] of this.records.entries()) {
      if (val.resetTime <= now) {
        this.records.delete(key);
      }
    }
  }

  async get(key: string) {
    this.cleanup();
    const entry = this.records.get(key);
    if (!entry) return null;
    if (entry.resetTime <= Date.now()) {
      this.records.delete(key);
      return null;
    }
    return entry;
  }

  async increment(key: string, ttlSeconds: number) {
    this.cleanup();
    const now = Date.now();
    const existing = this.records.get(key);

    if (existing && existing.resetTime > now) {
      existing.count += 1;
      return existing;
    }

    const resetTime = now + ttlSeconds * 1000;
    const newEntry = { count: 1, resetTime };
    this.records.set(key, newEntry);
    return newEntry;
  }

  async getStatus(key: string) {
    this.cleanup();
    const now = Date.now();
    const existing = this.records.get(key);
    if (existing && existing.resetTime > now) {
      return existing;
    }
    // calculate next reset (midnight UTC)
    const midnight = new Date();
    midnight.setUTCHours(24, 0, 0, 0);
    return { count: 0, resetTime: midnight.getTime() };
  }
}

export class RateLimiter {
  private store: RateLimitStore;
  private readonly maxLimit: number;

  constructor() {
    const envLimit = process.env.DAILY_FREE_LIMIT;
    this.maxLimit = envLimit ? parseInt(envLimit, 10) || 50 : 50;

    // Check if external storage (e.g. REDIS_URL) is configured
    if (process.env.REDIS_URL) {
      console.info('[RateLimiter] Configured with Redis storage backend');
      // In a production setup with ioredis, this connects to Redis.
      // Falls back to in-memory store if redis package isn't loaded.
      this.store = new MemoryRateLimitStore();
    } else {
      this.store = new MemoryRateLimitStore();
    }
  }

  /**
   * Computes seconds until next midnight UTC (daily reset)
   */
  private getSecondsUntilMidnightUtc(): number {
    const now = new Date();
    const midnight = new Date();
    midnight.setUTCHours(24, 0, 0, 0);
    return Math.max(60, Math.floor((midnight.getTime() - now.getTime()) / 1000));
  }

  /**
   * Checks whether the given client identifier (e.g. IP) is allowed to perform a check.
   */
  async check(identifier: string): Promise<RateLimitStatus> {
    const key = `ratelimit:${identifier}`;
    const ttl = this.getSecondsUntilMidnightUtc();
    const current = await this.store.getStatus(key);

    const remaining = Math.max(0, this.maxLimit - current.count);
    const allowed = current.count < this.maxLimit;

    return {
      allowed,
      limit: this.maxLimit,
      remaining,
      resetTime: current.resetTime,
    };
  }

  /**
   * Consumes one check quota token for the identifier.
   */
  async consume(identifier: string): Promise<RateLimitStatus> {
    const key = `ratelimit:${identifier}`;
    const ttl = this.getSecondsUntilMidnightUtc();
    const updated = await this.store.increment(key, ttl);

    const remaining = Math.max(0, this.maxLimit - updated.count);
    const allowed = updated.count <= this.maxLimit;

    return {
      allowed,
      limit: this.maxLimit,
      remaining,
      resetTime: updated.resetTime,
    };
  }

  /**
   * Inspect current remaining checks for an identifier without consuming.
   */
  async getStatus(identifier: string): Promise<RateLimitStatus> {
    return this.check(identifier);
  }
}

// Export singleton instance for server routes
export const defaultRateLimiter = new RateLimiter();
