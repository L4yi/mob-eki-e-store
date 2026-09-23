import { IProductRepository } from '../interfaces';
import { Product } from '../../types';
import { JsonStore } from './JsonStore';

export class JsonProductRepository implements IProductRepository {
  private store = JsonStore.getInstance();

  async findAll(filter?: {
    category?: string;
    search?: string;
    sort?: string;
    activeOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    const all = await this.store.get('products');
    let list = [...all];

    if (filter?.activeOnly !== false) {
      list = list.filter((p) => p.active);
    }

    if (filter?.category && filter.category !== 'all') {
      const cat = filter.category.toLowerCase();
      list = list.filter(
        (p) =>
          p.categoryId.toLowerCase() === cat ||
          (p.categorySlug && p.categorySlug.toLowerCase() === cat) ||
          (p.categoryName && p.categoryName.toLowerCase() === cat)
      );
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filter?.sort === 'price_asc' || filter?.sort === 'price-asc') {
      list.sort((a, b) => a.priceKobo - b.priceKobo);
    } else if (filter?.sort === 'price_desc' || filter?.sort === 'price-desc') {
      list.sort((a, b) => b.priceKobo - a.priceKobo);
    } else if (filter?.sort === 'featured') {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = list.length;
    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return { products: paginated, total };
  }

  async findById(id: string): Promise<Product | null> {
    const products = await this.store.get('products');
    return products.find((p) => p.id === id) || null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const products = await this.store.get('products');
    return products.find((p) => p.slug === slug || p.id === slug) || null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const products = await this.store.get('products');
    return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase()) || null;
  }

  async create(product: Product): Promise<Product> {
    return this.store.mutate((data) => {
      data.products.push(product);
      return product;
    });
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    return this.store.mutate((data) => {
      const idx = data.products.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      data.products[idx] = {
        ...data.products[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return data.products[idx];
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.store.mutate((data) => {
      const idx = data.products.findIndex((p) => p.id === id);
      if (idx === -1) return false;
      data.products[idx].active = false;
      data.products[idx].updatedAt = new Date().toISOString();
      return true;
    });
  }

  async getLowStock(threshold = 10): Promise<Product[]> {
    const products = await this.store.get('products');
    return products.filter((p) => p.stockQuantity - p.reservedQuantity <= (p.lowStockThreshold || threshold));
  }

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    return this.store.mutate((data) => {
      const p = data.products.find((item) => item.id === productId);
      if (!p) return false;
      const available = p.stockQuantity - p.reservedQuantity;
      if (available < quantity) return false;
      p.reservedQuantity += quantity;
      p.updatedAt = new Date().toISOString();
      return true;
    });
  }

  async releaseStock(productId: string, quantity: number): Promise<boolean> {
    return this.store.mutate((data) => {
      const p = data.products.find((item) => item.id === productId);
      if (!p) return false;
      p.reservedQuantity = Math.max(0, p.reservedQuantity - quantity);
      p.updatedAt = new Date().toISOString();
      return true;
    });
  }

  async commitSale(productId: string, quantity: number): Promise<boolean> {
    return this.store.mutate((data) => {
      const p = data.products.find((item) => item.id === productId);
      if (!p) return false;
      p.reservedQuantity = Math.max(0, p.reservedQuantity - quantity);
      p.stockQuantity = Math.max(0, p.stockQuantity - quantity);
      p.updatedAt = new Date().toISOString();
      return true;
    });
  }
}
