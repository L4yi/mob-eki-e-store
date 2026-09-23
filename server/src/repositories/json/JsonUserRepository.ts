import { IUserRepository } from '../interfaces';
import { User } from '../../types';
import { JsonStore } from './JsonStore';

export class JsonUserRepository implements IUserRepository {
  private store = JsonStore.getInstance();

  async findById(id: string): Promise<User | null> {
    const users = await this.store.get('users');
    return users.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.store.get('users');
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async create(user: User): Promise<User> {
    return this.store.mutate((data) => {
      data.users.push(user);
      return user;
    });
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    return this.store.mutate((data) => {
      const idx = data.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      data.users[idx] = {
        ...data.users[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return data.users[idx];
    });
  }

  async findAll(page = 1, limit = 50): Promise<{ users: User[]; total: number }> {
    const users = await this.store.get('users');
    const total = users.length;
    const start = (page - 1) * limit;
    return { users: users.slice(start, start + limit), total };
  }
}
