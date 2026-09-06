import type { Request, Response } from 'express';

export default function handler(_req: Request, res: Response) {
  res.status(200).json({
    status: 'ok',
    service: 'FraudCheck BD',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
