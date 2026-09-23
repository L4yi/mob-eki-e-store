import { ICategoryRepository } from '../interfaces';
import { Category } from '../../types';
import { JsonStore } from './JsonStore';

export class JsonCategoryRepository implements ICategoryRepository {
  private store = JsonStore.getInstance();

  async findAll(activeOnly = true): Promise<Category[]> {
    const categories = await this.store.get('categories');
    const products = await this.store.get('products');

    let list = activeOnly ? categories.filter((c) => c.active) : [...categories];
    list.sort((a, b) => a.displayOrder - b.displayOrder);

    // Compute dynamic product count
    return list.map((cat) => ({
      ...cat,
      count: products.filter(
        (p) =>
          p.active &&
          (p.categoryId === cat.id ||
            p.categorySlug === cat.slug ||
            p.categoryId === cat.slug)
      ).length,
    }));
  }

  async findById(id: string): Promise<Category | null> {
    const categories = await this.store.get('categories');
    return categories.find((c) => c.id === id) || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const categories = await this.store.get('categories');
    return categories.find((c) => c.slug === slug || c.id === slug) || null;
  }

  async create(category: Category): Promise<Category> {
    return this.store.mutate((data) => {
      data.categories.push(category);
      return category;
    });
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    return this.store.mutate((data) => {
      const idx = data.categories.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      data.categories[idx] = {
        ...data.categories[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return data.categories[idx];
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.store.mutate((data) => {
      const idx = data.categories.findIndex((c) => c.id === id);
      if (idx === -1) return false;
      data.categories[idx].active = false;
      data.categories[idx].updatedAt = new Date().toISOString();
      return true;
    });
  }
}
