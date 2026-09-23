import { IPaymentRepository } from '../interfaces';
import { Payment } from '../../types';
import { JsonStore } from './JsonStore';

export class JsonPaymentRepository implements IPaymentRepository {
  private store = JsonStore.getInstance();

  async findAll(filter?: {
    orderId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ payments: Payment[]; total: number }> {
    const payments = await this.store.get('payments');
    let list = [...payments];

    if (filter?.orderId) {
      list = list.filter((p) => p.orderId === filter.orderId);
    }

    if (filter?.status) {
      list = list.filter((p) => p.status === filter.status);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return { payments: paginated, total };
  }

  async findById(id: string): Promise<Payment | null> {
    const payments = await this.store.get('payments');
    return payments.find((p) => p.id === id) || null;
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const payments = await this.store.get('payments');
    return payments.find((p) => p.orderId === orderId) || null;
  }

  async findByReference(reference: string): Promise<Payment | null> {
    const payments = await this.store.get('payments');
    return (
      payments.find(
        (p) =>
          p.providerReference?.toLowerCase() === reference.toLowerCase() ||
          p.providerTransactionId?.toLowerCase() === reference.toLowerCase()
      ) || null
    );
  }

  async create(payment: Payment): Promise<Payment> {
    return this.store.mutate((data) => {
      data.payments.push(payment);
      return payment;
    });
  }

  async update(id: string, updates: Partial<Payment>): Promise<Payment | null> {
    return this.store.mutate((data) => {
      const idx = data.payments.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      data.payments[idx] = {
        ...data.payments[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return data.payments[idx];
    });
  }
}
