import type { Request, Response } from 'express';

function hasValue(value: string | undefined): boolean {
  return Boolean(value && value.trim());
}

export default function handler(_req: Request, res: Response) {
  const courierConfigured =
    hasValue(process.env.BDCOURIER_API_URL) &&
    hasValue(process.env.BDCOURIER_API_KEY);

  const persistentRateLimitConfigured =
    hasValue(process.env.UPSTASH_REDIS_REST_URL) &&
    hasValue(process.env.UPSTASH_REDIS_REST_TOKEN);

  res.setHeader('Cache-Control', 'no-store, max-age=0');

  res.status(courierConfigured ? 200 : 503).json({
    status: courierConfigured ? 'ready' : 'configuration_required',
    service: 'FraudCheck BD',
    version: '2.0.0',
    mode: 'live',
    courierApi: courierConfigured ? 'configured' : 'missing_configuration',
    rateLimitStore: persistentRateLimitConfigured ? 'persistent' : 'memory',
    timestamp: new Date().toISOString(),
  });
}
