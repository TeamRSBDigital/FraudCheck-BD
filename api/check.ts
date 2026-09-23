import type { Request, Response } from 'express';
import {
  BdCourierClient,
  CourierApiError,
} from '../lib/courier/bd-courier';
import { normalizeCourierData } from '../lib/courier/normalizer';
import { calculateDeliveryRisk } from '../lib/risk-engine';
import { defaultRateLimiter } from '../lib/rate-limiter';
import { isValidBdPhone, maskBdPhone, normalizeBdPhone } from '../lib/phone';

const courierClient = new BdCourierClient();

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

function setPrivateApiHeaders(res: Response) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

export default async function handler(req: Request, res: Response) {
  setPrivateApiHeaders(res);

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error: 'Method not allowed.',
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = null;
      }
    }

    const phone = body?.phone;
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
        error: 'Enter a valid 11-digit Bangladeshi mobile number (013-019).',
      });
    }

    const clientIp = getClientIp(req);
    const rateLimitCheck = await defaultRateLimiter.check(clientIp);

    res.setHeader('X-RateLimit-Limit', String(rateLimitCheck.limit));
    res.setHeader('X-RateLimit-Remaining', String(rateLimitCheck.remaining));
    res.setHeader(
      'X-RateLimit-Reset',
      String(Math.floor(rateLimitCheck.resetTime / 1000))
    );

    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: 'আজকের ফ্রি চেকের লিমিট শেষ হয়েছে। বাংলাদেশ সময় রাত ১২টার পর আবার চেষ্টা করুন।',
        rateLimit: {
          limit: rateLimitCheck.limit,
          remaining: 0,
          resetTimestamp: rateLimitCheck.resetTime,
        },
      });
    }

    const courierResult = await courierClient.getCourierHistory(normalizedPhone);
    const normalizedData = normalizeCourierData(courierResult.raw);
    const riskAssessment = calculateDeliveryRisk(normalizedData);

    const consumed = await defaultRateLimiter.consume(clientIp);
    res.setHeader('X-RateLimit-Remaining', String(consumed.remaining));

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
      source: courierResult.isMock ? 'demo' : 'live',
      apiNotice: courierResult.notice,
    });
  } catch (error: unknown) {
    console.error(
      '[FraudCheck /api/check]',
      error instanceof Error ? error.message : 'Unknown error'
    );

    if (error instanceof CourierApiError) {
      switch (error.code) {
        case 'CONFIGURATION':
          return res.status(503).json({
            success: false,
            error: 'লাইভ কুরিয়ার API এখনো কনফিগার করা হয়নি। অ্যাডমিনকে API সেটিংস সম্পন্ন করতে হবে।',
          });
        case 'AUTH':
          return res.status(502).json({
            success: false,
            error: 'কুরিয়ার API অনুমোদন ব্যর্থ হয়েছে। API key/subscription যাচাই করুন।',
          });
        case 'RATE_LIMIT':
          return res.status(429).json({
            success: false,
            error: 'কুরিয়ার ডাটা প্রোভাইডারের রেট লিমিট হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
          });
        case 'TIMEOUT':
          return res.status(504).json({
            success: false,
            error: 'কুরিয়ার সার্ভার সময়মতো সাড়া দেয়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।',
          });
        case 'INVALID_RESPONSE':
        case 'UPSTREAM':
        default:
          return res.status(502).json({
            success: false,
            error: 'কুরিয়ার ডাটা সার্ভিস থেকে সঠিক রেসপন্স পাওয়া যায়নি। আবার চেষ্টা করুন।',
          });
      }
    }

    return res.status(500).json({
      success: false,
      error: 'চেকটি সম্পন্ন করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।',
    });
  }
}
