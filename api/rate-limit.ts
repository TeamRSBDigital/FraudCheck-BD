import type { Request, Response } from 'express';
import { defaultRateLimiter } from '../lib/rate-limiter.js';

function getClientIp(req: Request): string {
  const vercelForwarded = req.headers['x-vercel-forwarded-for'];
  if (typeof vercelForwarded === 'string' && vercelForwarded.trim()) {
    return vercelForwarded.split(',')[0].trim();
  }

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const status = await defaultRateLimiter.getStatus(getClientIp(req));

    res.setHeader('X-RateLimit-Limit', String(status.limit));
    res.setHeader('X-RateLimit-Remaining', String(status.remaining));
    res.setHeader(
      'X-RateLimit-Reset',
      String(Math.floor(status.resetTime / 1000))
    );

    return res.status(200).json({
      limit: status.limit,
      remaining: status.remaining,
      resetTimestamp: status.resetTime,
    });
  } catch (error) {
    console.error(
      '[FraudCheck /api/rate-limit]',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return res.status(503).json({
      error: 'Unable to read rate-limit status.',
    });
  }
}
