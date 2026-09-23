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

  const dedicatedRateLimitSaltConfigured = hasValue(process.env.RATE_LIMIT_SALT);

  const status = !courierConfigured
    ? 'configuration_required'
    : persistentRateLimitConfigured && dedicatedRateLimitSaltConfigured
      ? 'ready'
      : 'degraded';

  res.setHeader('Cache-Control', 'no-store, max-age=0');

  res.status(courierConfigured ? 200 : 503).json({
    status,
    service: 'FraudCheck BD',
    version: '2.1.0',
    mode: 'live',
    courierApi: courierConfigured ? 'configured' : 'missing_configuration',
    rateLimitStore: persistentRateLimitConfigured ? 'persistent' : 'memory',
    rateLimitSalt: dedicatedRateLimitSaltConfigured ? 'configured' : 'fallback',
    timestamp: new Date().toISOString(),
  });
}
