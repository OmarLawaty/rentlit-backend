import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

export const rateLimiter = (refillRate: number, refillInterval: number, capacity: number) => {
  const buckets: { [key: string]: TokenBucket } = {};

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip as string;

    if (!buckets[ip]) {
      buckets[ip] = {
        tokens: capacity,
        lastRefill: Date.now(),
      };
    }

    const bucket = buckets[ip];
    const now = Date.now();
    const elapsedTime = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((elapsedTime / refillInterval) * refillRate);

    bucket.tokens = Math.min(capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      next();
    } else {
      throw new ApiError('Too Many Requests', 429);
    }
  };
};
