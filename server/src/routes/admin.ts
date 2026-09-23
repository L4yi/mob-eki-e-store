import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validateAndErrors';
import {
  adjustInventorySchema,
  verifyTransferSchema,
  updateOrderStatusSchema,
} from '../validation/schemas';
import { orderService } from '../services/OrderService';
import { inventoryService } from '../services/InventoryService';
import { paymentService } from '../services/PaymentService';
import { productService } from '../services/ProductAndCategoryServices';
import { auditLogService } from '../services/AuthAuditSettingsServices';
import { repositories } from '../repositories';
import { whatsAppService } from '../services/WhatsAppService';

const router = Router();

// Protect entire admin router
router.use(requireAuth, requireAdmin);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const ordersResult = await orderService.getAllOrders({ limit: 1000 });
    const lowStock = await inventoryService.getLowStock();
    const productsResult = await productService.getProducts({ limit: 1000, activeOnly: true });
    const usersResult = await repositories.userRepo.findAll(1, 1000);

    const orders = ordersResult.orders;
    const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
    const totalRevenueKobo = paidOrders.reduce((sum, o) => sum + o.totalKobo, 0);

    const pendingOrders = orders.filter(
      (o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PROCESSING'
    );
    const pendingPayments = orders.filter((o) => o.paymentStatus === 'PENDING' || o.paymentStatus === 'AWAITING_VERIFICATION');

    const recentOrders = orders.slice(0, 5).map((o) => ({
      ...o,
      subtotal: o.subtotalKobo / 100,
      deliveryFee: o.deliveryFeeKobo / 100,
      totalAmount: o.totalKobo / 100,
      whatsAppUrl: whatsAppService.generateWhatsAppDeepLink(o),
    }));

    return res.json({
      metrics: {
        totalRevenue: totalRevenueKobo / 100,
        totalOrders: orders.length,
        paidOrdersCount: paidOrders.length,
        pendingOrdersCount: pendingOrders.length,
        pendingPaymentsCount: pendingPayments.length,
        activeProductsCount: productsResult.total,
        lowStockCount: lowStock.length,
        customerCount: usersResult.total,
      },
      recentOrders,
      lowStockProducts: lowStock.map((p) => ({
        ...p,
        price: p.priceKobo / 100,
        availableStock: p.stockQuantity - p.reservedQuantity,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res, next) => {
  try {
    const { status, paymentStatus, page, limit } = req.query;
    const result = await orderService.getAllOrders({
      status: status as string,
      paymentStatus: paymentStatus as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    const enriched = result.orders.map((o) => ({
      ...o,
      subtotal: o.subtotalKobo / 100,
      deliveryFee: o.deliveryFeeKobo / 100,
      totalAmount: o.totalKobo / 100,
      whatsAppUrl: whatsAppService.generateWhatsAppDeepLink(o),
    }));
    return res.json({ orders: enriched, total: result.total });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/orders/:id
router.get('/orders/:id', async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await orderService.getOrderByIdOrNumber(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json({
      ...order,
      subtotal: order.subtotalKobo / 100,
      deliveryFee: order.deliveryFeeKobo / 100,
      totalAmount: order.totalKobo / 100,
      whatsAppUrl: whatsAppService.generateWhatsAppDeepLink(order),
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', validate(updateOrderStatusSchema), async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status, note } = req.body;
    const updated = await orderService.updateOrderStatus(id, status, note);
    if (!updated) return res.status(404).json({ error: 'Order not found' });

    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'ORDER',
      entityId: id,
      afterState: { status, note },
    });

    return res.json({
      ...updated,
      subtotal: updated.subtotalKobo / 100,
      deliveryFee: updated.deliveryFeeKobo / 100,
      totalAmount: updated.totalKobo / 100,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/inventory
router.get('/inventory', async (req, res, next) => {
  try {
    const { productId, type, page, limit } = req.query;
    const result = await inventoryService.getMovements({
      productId: productId as string,
      type: type as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/inventory/low-stock
router.get('/inventory/low-stock', async (req, res, next) => {
  try {
    const lowStock = await inventoryService.getLowStock();
    return res.json(
      lowStock.map((p) => ({
        ...p,
        price: p.priceKobo / 100,
        availableStock: p.stockQuantity - p.reservedQuantity,
      }))
    );
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/inventory/adjust
router.post('/inventory/adjust', validate(adjustInventorySchema), async (req, res, next) => {
  try {
    const updated = await inventoryService.adjustStock({
      ...req.body,
      performedBy: req.user!.email,
    });
    if (!updated) return res.status(404).json({ error: 'Product not found' });

    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'ADJUST_INVENTORY',
      entityType: 'INVENTORY',
      entityId: req.body.productId,
      afterState: req.body,
    });

    return res.json({
      ...updated,
      price: updated.priceKobo / 100,
      availableStock: updated.stockQuantity - updated.reservedQuantity,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/payments
router.get('/payments', async (req, res, next) => {
  try {
    const { orderId, status, page, limit } = req.query;
    const result = await paymentService.getPayments({
      orderId: orderId as string,
      status: status as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
    const enriched = result.payments.map((p) => ({
      ...p,
      amount: p.amountKobo / 100,
    }));
    return res.json({ payments: enriched, total: result.total });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/payments/verify-transfer
router.post('/payments/verify-transfer', validate(verifyTransferSchema), async (req, res, next) => {
  try {
    const { orderId, bankReference, verifiedNotes } = req.body;
    const updatedOrder = await paymentService.verifyBankTransferManual({
      orderId,
      bankReference,
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      notes: verifiedNotes,
    });
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });

    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'VERIFY_BANK_TRANSFER',
      entityType: 'PAYMENT',
      entityId: orderId,
      afterState: { bankReference, verifiedNotes },
    });

    return res.json({
      ...updatedOrder,
      subtotal: updatedOrder.subtotalKobo / 100,
      deliveryFee: updatedOrder.deliveryFeeKobo / 100,
      totalAmount: updatedOrder.totalKobo / 100,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/customers
router.get('/customers', async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await repositories.userRepo.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 50
    );
    const safeUsers = result.users.map(({ passwordHash: _, ...u }) => u);
    return res.json({ customers: safeUsers, total: result.total });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await auditLogService.getLogs(
      page ? Number(page) : 1,
      limit ? Number(limit) : 50
    );
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
