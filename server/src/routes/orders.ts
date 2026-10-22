import { Router } from 'express';
import { orderService } from '../services/OrderService';
import { whatsAppService } from '../services/WhatsAppService';
import { emailService } from '../services/EmailService';
import { optionalAuth, requireAuth, requireAdmin } from '../middleware/auth';
import { validate, idempotency } from '../middleware/validateAndErrors';
import { createOrderSchema, updateOrderStatusSchema } from '../validation/schemas';
import { auditLogService } from '../services/AuthAuditSettingsServices';
import { orderCreationLimiter, trackingLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/orders (Customer Checkout - Idempotent, Max 10 orders / 10 min / IP)
router.post('/', orderCreationLimiter, optionalAuth, idempotency, validate(createOrderSchema), async (req, res, next) => {
  try {
    const idempotencyKey = req.headers['idempotency-key'] as string | undefined;
    const order = await orderService.createOrder({
      ...req.body,
      userId: req.user?.id,
      idempotencyKey,
    });

    const whatsAppUrl = whatsAppService.generateWhatsAppDeepLink(order);

    // Asynchronously send branded email confirmation and merchant alert
    emailService.sendOrderConfirmation(order).catch((err) => {
      console.error('Email dispatch error for order ' + order.orderNumber, err);
    });

    return res.status(201).json({
      ...order,
      subtotal: order.subtotalKobo / 100,
      deliveryFee: order.deliveryFeeKobo / 100,
      totalAmount: order.totalKobo / 100,
      whatsAppUrl,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/me (Logged in Customer Orders)
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const result = await orderService.getUserOrders(req.user!.id);
    const enriched = result.orders.map((o) => ({
      ...o,
      subtotal: o.subtotalKobo / 100,
      deliveryFee: o.deliveryFeeKobo / 100,
      totalAmount: o.totalKobo / 100,
    }));
    return res.json(enriched);
  } catch (err) {
    next(err);
  }
});

function maskName(name: string): string {
  if (!name) return 'Customer';
  const parts = name.trim().split(/\s+/);
  return parts.map((p) => (p.length <= 1 ? p : `${p[0]}${'*'.repeat(Math.min(p.length - 1, 3))}`)).join(' ');
}

function maskPhone(phone: string): string {
  if (!phone) return '080******';
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return '****';
  return cleaned.slice(0, 4) + '****' + cleaned.slice(-3);
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'c***@***.com';
  const [local, domain] = email.split('@');
  const maskedLocal = local.length <= 2 ? `${local[0]}*` : `${local[0]}***${local.slice(-1)}`;
  return `${maskedLocal}@${domain}`;
}

function maskAddress(addr: string): string {
  if (!addr) return '***';
  const parts = addr.split(',');
  if (parts.length > 1) {
    return '***, ' + parts.slice(1).join(',').trim();
  }
  return '*** ' + (addr.length > 10 ? addr.slice(-10) : 'Lagos');
}

// GET /api/orders/:idOrToken (Customer & Guest Order Tracking, Max 20 lookups / 10 min / IP)
router.get('/:idOrToken', trackingLimiter, optionalAuth, async (req, res, next) => {
  try {
    const param = Array.isArray(req.params.idOrToken) ? req.params.idOrToken[0] : req.params.idOrToken;
    let order = await orderService.getOrderByIdOrNumber(param);
    if (!order) {
      order = await orderService.getOrderByTrackingToken(param);
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const queryToken = (req.query.token as string) || (req.headers['x-tracking-token'] as string);
    const isDirectTokenQuery = order.trackingToken === param;
    const hasValidToken = Boolean(isDirectTokenQuery || (queryToken && order.trackingToken === queryToken));
    const isOwner = Boolean(req.user && order.userId && req.user.id === order.userId);
    const isAdmin = Boolean(
      req.user &&
      (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')
    );

    const isPrivileged = isOwner || isAdmin || hasValidToken;

    const sanitizedOrder = isPrivileged
      ? order
      : {
          ...order,
          customerName: maskName(order.customerName),
          customerPhone: maskPhone(order.customerPhone),
          customerEmail: maskEmail(order.customerEmail),
          deliveryAddress: maskAddress(order.deliveryAddress),
          trackingToken: undefined,
        };

    const whatsAppUrl = whatsAppService.generateWhatsAppDeepLink(sanitizedOrder as any);

    return res.json({
      ...sanitizedOrder,
      subtotal: sanitizedOrder.subtotalKobo / 100,
      deliveryFee: sanitizedOrder.deliveryFeeKobo / 100,
      totalAmount: sanitizedOrder.totalKobo / 100,
      whatsAppUrl,
      isMasked: !isPrivileged,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/cancel (Customer Pending Order Cancellation)
router.put('/:id/cancel', optionalAuth, async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const token =
      (req.body?.token as string) ||
      (req.query?.token as string) ||
      (req.headers['x-tracking-token'] as string);

    const isAdmin = Boolean(
      req.user &&
      (req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN')
    );

    const cancelled = await orderService.cancelOrder(id, {
      userId: req.user?.id,
      trackingToken: token,
      isAdmin,
    });
    return res.json(cancelled);
  } catch (err: any) {
    if (err.message && (err.message.includes('Unauthorized') || err.message.includes('required'))) {
      return res.status(403).json({ error: err.message });
    }
    if (
      err.message &&
      (err.message.includes('pending') || err.message.includes('not found') || err.message.includes('transition'))
    ) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
