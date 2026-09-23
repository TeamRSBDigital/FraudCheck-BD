import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import checkHandler from './api/check.ts';
import healthHandler from './api/health.ts';
import rateLimitHandler from './api/rate-limit.ts';

async function startServer() {
  const app = express();
  const PORT = Number.parseInt(process.env.PORT || '3000', 10) || 3000;

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '32kb' }));

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=()'
    );
    next();
  });

  app.all('/api/check', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkHandler(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.all('/api/rate-limit', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await rateLimitHandler(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.all('/api/health', (req: Request, res: Response) => {
    healthHandler(req, res);
  });

  app.use('/images', express.static(path.join(process.cwd(), 'images')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      etag: true,
      maxAge: '1h',
      setHeaders(res, filePath) {
        if (filePath.includes('/assets/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    }));

    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use(
    (
      error: unknown,
      _req: Request,
      res: Response,
      _next: NextFunction
    ) => {
      console.error(
        '[FraudCheck server]',
        error instanceof Error ? error.message : 'Unknown server error'
      );

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Internal server error.',
        });
      }
    }
  );

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FraudCheck BD running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start FraudCheck BD:', error);
  process.exit(1);
});
