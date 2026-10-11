import rateLimit, { Options } from 'express-rate-limit';
import { Request, Response } from 'express';

// Safe security event logger (Section 15)
// Logs meaningful rate-limit violations without exposing secrets, JWTs, passwords, or customer PII.
function logRateLimitEvent(category: string, req: Request) {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const method = req.method;
  const path = req.originalUrl || req.baseUrl || req.url;
  const userId = req.user?.id || 'anonymous';
  const hasBodyEmail = Boolean(req.body?.email);

  console.warn(
    `🛡️ [SECURITY AUDIT - RATE LIMIT EXCEEDED] Category: [${category}] | Time: ${timestamp} | IP: ${ip} | Method: ${method} | Path: ${path} | User: ${userId}${
      hasBodyEmail ? ' | Account: [Redacted Email Identifier]' : ''
    }`
  );
}

// Standard JSON response factory (Section 14)
function createLimiter(category: string, options: Partial<Options>, customMessage?: string) {
  return rateLimit({
    standardHeaders: 'draft-7', // Adds RateLimit-* and standard Retry-After headers
    legacyHeaders: true,        // Adds X-RateLimit-* headers
    validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false }, // Avoid noisy proxy/ipv6 warnings behind Vercel edge
    handler: (req: Request, res: Response) => {
      logRateLimitEvent(category, req);
      const retryAfter = res.getHeader('Retry-After') || Math.ceil((options.windowMs || 60000) / 1000);
      return res.status(429).json({
        error: 'Too many requests',
        message: customMessage || 'Please try again later.',
        retryAfter: Number(retryAfter) || 60,
      });
    },
    ...options,
  });
}

// 1. Global Baseline Rate Limiter: 120 req / 1 min / IP
export const globalApiLimiter = createLimiter(
  'GLOBAL_API',
  {
    windowMs: 60 * 1000,
    max: 120,
  },
  'Too many requests to the API. Please slow down.'
);

// 2. Authentication Login Limiter: 5 failed attempts / 15 min / IP + Account identifier
export const loginLimiter = createLimiter(
  'AUTH_LOGIN',
  {
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true, // Successful logins DO NOT count against the failed limit
    keyGenerator: (req: Request) => {
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      const ip = req.ip || req.socket.remoteAddress || 'anon-ip';
      return `${ip}_${email}`;
    },
  },
  'Too many failed login attempts. Please try again in 15 minutes.'
);

// 3. User Registration Limiter: 5 registrations / 1 hour / IP
export const registerLimiter = createLimiter(
  'AUTH_REGISTER',
  {
    windowMs: 60 * 60 * 1000,
    max: 5,
  },
  'Too many account registration attempts from this network. Please try again later.'
);

// 4. Password Change Limiter: 5 attempts / 15 min / User
export const passwordChangeLimiter = createLimiter(
  'AUTH_PASSWORD_CHANGE',
  {
    windowMs: 15 * 60 * 1000,
    max: 5,
    keyGenerator: (req: Request) => req.user?.id || req.ip || 'anon-user',
  },
  'Too many password update requests. Please wait before trying again.'
);

// 5. Order Creation Limiter: 10 orders / 10 min / IP
export const orderCreationLimiter = createLimiter(
  'ORDER_CREATION',
  {
    windowMs: 10 * 60 * 1000,
    max: 10,
  },
  'Too many order submissions. Please wait before placing another order.'
);

// 6. Public Order Tracking Limiter: 20 tracking lookups / 10 min / IP
export const trackingLimiter = createLimiter(
  'ORDER_TRACKING',
  {
    windowMs: 10 * 60 * 1000,
    max: 20,
  },
  'Too many order tracking lookups. Please try again later.'
);

// 7. Product & Catalog Browsing Limiter: 120 req / 1 min / IP
export const productBrowseLimiter = createLimiter(
  'PRODUCT_BROWSE',
  {
    windowMs: 60 * 1000,
    max: 120,
  },
  'Too many product browsing requests. Please slow down.'
);

// 8. Admin Mutation Limiter: 30 mutations / 1 min / Admin User
export const adminMutationLimiter = createLimiter(
  'ADMIN_MUTATION',
  {
    windowMs: 60 * 1000,
    max: 30,
    keyGenerator: (req: Request) => req.user?.id || req.ip || 'admin',
  },
  'Too many admin requests. Please wait a moment.'
);

// 9. Image Upload Limiter: 10 uploads / 10 min / Admin User
export const imageUploadLimiter = createLimiter(
  'IMAGE_UPLOAD',
  {
    windowMs: 10 * 60 * 1000,
    max: 10,
    keyGenerator: (req: Request) => req.user?.id || req.ip || 'admin-upload',
  },
  'Too many file uploads. Please wait before uploading additional images.'
);

// 10. Settings Mutation Limiter: 20 updates / 1 hour / Admin User
export const settingsMutationLimiter = createLimiter(
  'SETTINGS_MUTATION',
  {
    windowMs: 60 * 60 * 1000,
    max: 20,
    keyGenerator: (req: Request) => req.user?.id || req.ip || 'admin-settings',
  },
  'Too many store settings updates. Please try again later.'
);

// 11. Inventory Adjustment Limiter: 30 adjustments / 10 min / Inventory Manager
export const inventoryMutationLimiter = createLimiter(
  'INVENTORY_MUTATION',
  {
    windowMs: 10 * 60 * 1000,
    max: 30,
    keyGenerator: (req: Request) => req.user?.id || req.ip || 'inventory-manager',
  },
  'Too many inventory adjustments submitted. Please wait before recording more movements.'
);
