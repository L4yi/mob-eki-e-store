import { IOrderRepository } from '../interfaces';
import { Order } from '../../types';
import { JsonStore } from './JsonStore';

export class JsonOrderRepository implements IOrderRepository {
  private store = JsonStore.getInstance();

  async findAll(filter?: {
    userId?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> {
    const orders = await this.store.get('orders');
    let list = [...orders];

    if (filter?.userId) {
      list = list.filter((o) => o.userId === filter.userId);
    }

    if (filter?.status) {
      list = list.filter((o) => o.orderStatus === filter.status);
    }

    if (filter?.paymentStatus) {
      list = list.filter((o) => o.paymentStatus === filter.paymentStatus);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return { orders: paginated, total };
  }

  async findById(id: string): Promise<Order | null> {
    const orders = await this.store.get('orders');
    return orders.find((o) => o.id === id) || null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const orders = await this.store.get('orders');
    return orders.find((o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase() || o.id === orderNumber) || null;
  }

  async findByTrackingToken(token: string): Promise<Order | null> {
    const orders = await this.store.get('orders');
    return orders.find((o) => o.trackingToken === token) || null;
  }

  async findByIdempotencyKey(key: string): Promise<Order | null> {
    const orders = await this.store.get('orders');
    return orders.find((o) => o.idempotencyKey === key) || null;
  }

  async create(order: Order): Promise<Order> {
    return this.store.mutate((data) => {
      data.orders.push(order);
      return order;
    });
  }

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    return this.store.mutate((data) => {
      const idx = data.orders.findIndex((o) => o.id === id);
      if (idx === -1) return null;
      data.orders[idx] = {
        ...data.orders[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return data.orders[idx];
    });
  }

  async findExpiredPendingOrders(now: Date): Promise<Order[]> {
    const orders = await this.store.get('orders');
    return orders.filter(
      (o) =>
        o.orderStatus === 'PENDING_PAYMENT' &&
        o.reservationExpiresAt &&
        new Date(o.reservationExpiresAt) < now
    );
  }
}
