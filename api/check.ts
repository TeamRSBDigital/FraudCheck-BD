import type { Request, Response } from 'express';
import { BdCourierClient } from '../lib/courier/bd-courier.ts';
import { normalizeCourierData } from '../lib/courier/normalizer.ts';
import { calculateDeliveryRisk } from '../lib/risk-engine.ts';
import { defaultRateLimiter } from '../lib/rate-limiter.ts';
import { isValidBdPhone, maskBdPhone, normalizeBdPhone } from '../lib/phone.ts';

const courierClient = new BdCourierClient();

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone } = req.body as { phone?: unknown };
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : (req.socket?.remoteAddress || '127.0.0.1');

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Enter a valid Bangladeshi mobile number.',
      });
    }

    const normalizedPhone = normalizeBdPhone(phone);
    if (!isValidBdPhone(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX).',
      });
    }

    const rateLimitCheck = await defaultRateLimiter.check(clientIp);
    res.setHeader('X-RateLimit-Limit', rateLimitCheck.limit.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimitCheck.remaining.toString());
    res.setHeader('X-RateLimit-Reset', Math.floor(rateLimitCheck.resetTime / 1000).toString());

    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Daily limit reached. Free checks reset daily. Please try again tomorrow.',
        rateLimit: {
          limit: rateLimitCheck.limit,
          remaining: 0,
          resetTimestamp: rateLimitCheck.resetTime,
        },
      });
    }

    const consumed = await defaultRateLimiter.consume(clientIp);
    res.setHeader('X-RateLimit-Remaining', consumed.remaining.toString());

    const courierResult = await courierClient.getCourierHistory(normalizedPhone);
    const normalizedData = normalizeCourierData(courierResult.raw);
    const riskAssessment = calculateDeliveryRisk(normalizedData);

    return res.status(200).json({
      success: true,
      maskedPhone: maskBdPhone(normalizedPhone),
      queryTimestamp: new Date().toISOString(),
      hasData: normalizedData.totalOrders > 0,
      data: normalizedData,
      risk: riskAssessment,
      rateLimit: {
        limit: consumed.limit,
        remaining: consumed.remaining,
        resetTimestamp: consumed.resetTime,
      },
      isMockData: courierResult.isMock,
    });
  } catch (err: unknown) {
    console.error('[Vercel API /check] Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to complete the check right now. Please try again in a moment.',
    });
  }
}
