import { IInventoryRepository } from '../interfaces';
import { InventoryMovement } from '../../types';
import { JsonStore } from './JsonStore';

export class JsonInventoryRepository implements IInventoryRepository {
  private store = JsonStore.getInstance();

  async recordMovement(movement: InventoryMovement): Promise<InventoryMovement> {
    return this.store.mutate((data) => {
      data.movements.unshift(movement);
      return movement;
    });
  }

  async getMovements(filter?: {
    productId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ movements: InventoryMovement[]; total: number }> {
    const movements = await this.store.get('movements');
    let list = [...movements];

    if (filter?.productId) {
      list = list.filter((m) => m.productId === filter.productId);
    }

    if (filter?.type) {
      list = list.filter((m) => m.type === filter.type);
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return { movements: paginated, total };
  }
}
