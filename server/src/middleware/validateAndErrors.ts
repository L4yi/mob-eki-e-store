import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError || err?.issues) {
        const issues = (err.issues || []) as any[];
        const errors = issues.map((e) => ({
          path: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
          message: e.message,
        }));
        return res.status(400).json({ error: 'Validation failed', details: errors });
      }
      return res.status(400).json({ error: 'Invalid request payload' });
    }
  };
};

const idempotencyCache = new Map<string, { statusCode: number; body: any; timestamp: number }>();

export const idempotency = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers['idempotency-key'] as string;
  if (!key) return next();

  // Clean old cache entries > 24 hours
  const now = Date.now();
  if (idempotencyCache.has(key)) {
    const cached = idempotencyCache.get(key)!;
    if (now - cached.timestamp < 24 * 60 * 60 * 1000) {
      return res.status(cached.statusCode).json(cached.body);
    }
    idempotencyCache.delete(key);
  }

  // Intercept response
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      idempotencyCache.set(key, {
        statusCode: res.statusCode,
        body,
        timestamp: Date.now(),
      });
    }
    return originalJson(body);
  };

  next();
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error]', err);
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  // Do not expose stack trace or database internals in production
  return res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
