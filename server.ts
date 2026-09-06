import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { BdCourierClient } from './lib/courier/bd-courier.ts';
import { normalizeCourierData } from './lib/courier/normalizer.ts';
import { calculateDeliveryRisk } from './lib/risk-engine.ts';
import { defaultRateLimiter } from './lib/rate-limiter.ts';
import { isValidBdPhone, maskBdPhone, normalizeBdPhone } from './lib/phone.ts';

const appDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic security and parsing middleware
  app.use(express.json({ limit: '100kb' }));
  app.disable('x-powered-by');

  // Trust proxy for proper client IP resolution in reverse-proxied containers (Cloud Run, Vercel)
  app.set('trust proxy', 1);

  const courierClient = new BdCourierClient();

  // Helper to resolve client IP
  const getClientIp = (req: Request): string => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || '127.0.0.1';
  };

  // ==========================================
  // API Routes (Defined BEFORE Vite Middleware)
  // ==========================================

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: 'FraudCheck BD',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Client rate limit status endpoint
  app.get('/api/rate-limit', async (req: Request, res: Response) => {
    try {
      const clientIp = getClientIp(req);
      const status = await defaultRateLimiter.getStatus(clientIp);
      res.setHeader('X-RateLimit-Limit', status.limit.toString());
      res.setHeader('X-RateLimit-Remaining', status.remaining.toString());
      res.setHeader('X-RateLimit-Reset', Math.floor(status.resetTime / 1000).toString());

      res.json({
        limit: status.limit,
        remaining: status.remaining,
        resetTimestamp: status.resetTime,
      });
    } catch {
      res.status(500).json({ error: 'Unable to check rate limit' });
    }
  });

  // Main Courier Risk Check endpoint
  app.post('/api/check', async (req: Request, res: Response) => {
    try {
      const { phone } = req.body as { phone?: unknown };
      const clientIp = getClientIp(req);

      // 1. Phone Input Sanitization & Validation
      if (!phone || typeof phone !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Enter a valid Bangladeshi mobile number.',
        });
        return;
      }

      const normalizedPhone = normalizeBdPhone(phone);
      if (!isValidBdPhone(normalizedPhone)) {
        res.status(400).json({
          success: false,
          error: 'Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX).',
        });
        return;
      }

      // 2. Server-side Rate Limiting Enforcement
      const rateLimitCheck = await defaultRateLimiter.check(clientIp);
      res.setHeader('X-RateLimit-Limit', rateLimitCheck.limit.toString());
      res.setHeader('X-RateLimit-Remaining', rateLimitCheck.remaining.toString());
      res.setHeader('X-RateLimit-Reset', Math.floor(rateLimitCheck.resetTime / 1000).toString());

      if (!rateLimitCheck.allowed) {
        res.status(429).json({
          success: false,
          error: 'Daily limit reached. Free checks reset daily. Please try again tomorrow.',
          rateLimit: {
            limit: rateLimitCheck.limit,
            remaining: 0,
            resetTimestamp: rateLimitCheck.resetTime,
          },
        });
        return;
      }

      // 3. Consume 1 check token
      const consumed = await defaultRateLimiter.consume(clientIp);
      res.setHeader('X-RateLimit-Remaining', consumed.remaining.toString());

      // 4. Secure Courier API Request
      const courierResult = await courierClient.getCourierHistory(normalizedPhone);

      // 5. Normalize response
      const normalizedData = normalizeCourierData(courierResult.raw);

      // 6. Calculate deterministic risk indicators
      const riskAssessment = calculateDeliveryRisk(normalizedData);

      // 7. Sanitize response - mask phone, never expose raw backend response or secrets
      res.status(200).json({
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
      // Do not expose stack traces or secrets to users
      console.error('[API /check] Error processing courier check:', err);
      res.status(500).json({
        success: false,
        error: 'Unable to complete the check right now. Please try again in a moment.',
      });
    }
  });

  // ==========================================
  // Vite Middleware / Static Serving
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FraudCheck BD server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start FraudCheck BD server:', err);
  process.exit(1);
});
