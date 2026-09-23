import { Router } from 'express';
import { orderService } from '../services/OrderService';
import { whatsAppService } from '../services/WhatsAppService';
import { optionalAuth, requireAuth, requireAdmin } from '../middleware/auth';
import { validate, idempotency } from '../middleware/validateAndErrors';
import { createOrderSchema, updateOrderStatusSchema } from '../validation/schemas';
import { auditLogService } from '../services/AuthAuditSettingsServices';

const router = Router();

// POST /api/orders (Customer Checkout - Idempotent)
router.post('/', optionalAuth, idempotency, validate(createOrderSchema), async (req, res, next) => {
  try {
    const idempotencyKey = req.headers['idempotency-key'] as string | undefined;
    const order = await orderService.createOrder({
      ...req.body,
      userId: req.user?.id,
      idempotencyKey,
    });

    const whatsAppUrl = whatsAppService.generateWhatsAppDeepLink(order);

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

// GET /api/orders/:idOrToken (Customer & Guest Order Tracking)
router.get('/:idOrToken', optionalAuth, async (req, res, next) => {
  try {
    const param = Array.isArray(req.params.idOrToken) ? req.params.idOrToken[0] : req.params.idOrToken;
    let order = await orderService.getOrderByIdOrNumber(param);
    if (!order) {
      order = await orderService.getOrderByTrackingToken(param);
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Security Check: If order is attached to a registered user, non-admin visitors must either match userId or provide the secret trackingToken
    if (order.userId && (!req.user || req.user.id !== order.userId)) {
      if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
        const queryToken = req.query.token as string;
        if (order.trackingToken !== param && order.trackingToken !== queryToken) {
          return res.status(403).json({ error: 'Unauthorized to view this customer order' });
        }
      }
    }

    const whatsAppUrl = whatsAppService.generateWhatsAppDeepLink(order);

    return res.json({
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

// PUT /api/orders/:id/cancel (Customer Pending Order Cancellation)
router.put('/:id/cancel', optionalAuth, async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const cancelled = await orderService.cancelOrder(id, req.user?.id);
    return res.json(cancelled);
  } catch (err) {
    next(err);
  }
});

export default router;
