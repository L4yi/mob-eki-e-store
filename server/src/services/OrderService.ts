import { repositories } from '../repositories';
import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '../types';
import { deliveryService } from './DeliveryService';
import { inventoryService } from './InventoryService';
import crypto from 'crypto';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export class OrderService {
  private orderRepo = repositories.orderRepo;
  private productRepo = repositories.productRepo;

  public async createOrder(params: {
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryZone: 'LAGOS' | 'SOUTH_WEST' | 'NATIONWIDE' | 'PICKUP';
    deliveryState: string;
    deliveryCity: string;
    deliveryAddress: string;
    deliveryNotes?: string;
    paymentMethod: PaymentMethod;
    items: { productId: string; quantity: number }[];
    idempotencyKey?: string;
  }): Promise<Order> {
    // 1. Idempotency Check
    if (params.idempotencyKey) {
      const existing = await this.orderRepo.findByIdempotencyKey(params.idempotencyKey);
      if (existing) return existing;
    }

    // 2. Validate Items & Fetch Authoritative Server Prices
    const orderItems: OrderItem[] = [];
    let subtotalKobo = 0;

    for (const item of params.items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product || !product.active) {
        throw new Error(`Product ${item.productId} is not available.`);
      }

      const available = product.stockQuantity - product.reservedQuantity;
      if (available < item.quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Only ${available} units available.`
        );
      }

      // Check wholesale pricing tier if quantity threshold met
      let unitPrice = product.priceKobo;
      if (
        product.wholesaleEnabled &&
        product.wholesaleMinQty &&
        product.wholesalePriceKobo &&
        item.quantity >= product.wholesaleMinQty
      ) {
        unitPrice = product.wholesalePriceKobo;
      }

      subtotalKobo += unitPrice * item.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        unitPriceKobo: unitPrice,
        quantity: item.quantity,
      });
    }

    // 3. Server-Calculated Delivery Fee
    const isPickup = params.deliveryZone === 'PICKUP';
    const deliveryCalc = await deliveryService.calculateDelivery(params.deliveryState, isPickup);
    const deliveryFeeKobo = deliveryCalc.feeKobo;
    const finalZone = isPickup ? 'PICKUP' : deliveryCalc.zone;

    // 4. Calculate Final Authoritative Total
    const discountKobo = 0;
    const totalKobo = subtotalKobo + deliveryFeeKobo - discountKobo;

    // 5. Atomic Inventory Stock Reservation
    const stockReserved = await inventoryService.reserveOrderStock(orderItems);
    if (!stockReserved) {
      throw new Error('Could not reserve stock for order items. Please try again.');
    }

    // 6. Generate Unique References
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MOB-${year}-${randomSuffix}`;
    const trackingToken = crypto.randomBytes(16).toString('hex');

    // 30 minute reservation window for online payment
    const reservationExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const newOrder: Order = {
      id: `ord-${crypto.randomUUID()}`,
      orderNumber,
      trackingToken,
      userId: params.userId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      deliveryZone: finalZone,
      deliveryState: params.deliveryState,
      deliveryCity: params.deliveryCity,
      deliveryAddress: params.deliveryAddress,
      deliveryNotes: params.deliveryNotes,
      subtotalKobo,
      discountKobo,
      deliveryFeeKobo,
      totalKobo,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING_PAYMENT',
      reservationExpiresAt,
      items: orderItems,
      trackingNotes: [
        {
          timestamp: new Date().toISOString(),
          status: 'PENDING_PAYMENT',
          note: 'Order created, awaiting payment confirmation.',
        },
      ],
      idempotencyKey: params.idempotencyKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.orderRepo.create(newOrder);
  }

  public async getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
    const byId = await this.orderRepo.findById(idOrNumber);
    if (byId) return byId;
    return this.orderRepo.findByOrderNumber(idOrNumber);
  }

  public async getOrderByTrackingToken(token: string): Promise<Order | null> {
    return this.orderRepo.findByTrackingToken(token);
  }

  public async getUserOrders(userId: string) {
    return this.orderRepo.findAll({ userId });
  }

  public async getAllOrders(filter?: {
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }) {
    return this.orderRepo.findAll(filter);
  }

  public async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ): Promise<Order | null> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    const allowed = VALID_TRANSITIONS[order.orderStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from "${order.orderStatus}" to "${newStatus}".`
      );
    }

    // If order is cancelled from PENDING_PAYMENT, release stock reservation
    if (newStatus === 'CANCELLED' && order.orderStatus === 'PENDING_PAYMENT') {
      await inventoryService.releaseOrderStock(order.items, order.id, 'Order cancelled by staff or user');
    }

    const trackingNotes = [
      ...order.trackingNotes,
      {
        timestamp: new Date().toISOString(),
        status: newStatus,
        note: note || `Order transitioned to ${newStatus}`,
      },
    ];

    return this.orderRepo.update(order.id, {
      orderStatus: newStatus,
      trackingNotes,
    });
  }

  public async cancelOrder(orderId: string, userId?: string): Promise<Order | null> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (userId && order.userId !== userId) {
      throw new Error('Unauthorized to cancel this order');
    }

    if (order.orderStatus !== 'PENDING_PAYMENT') {
      throw new Error('Only pending orders can be directly cancelled by customer');
    }

    return this.updateOrderStatus(order.id, 'CANCELLED', 'Order cancelled by customer');
  }
}

export const orderService = new OrderService();
