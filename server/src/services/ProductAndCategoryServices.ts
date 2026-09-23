import { repositories } from '../repositories';
import { Product, Category } from '../types';
import crypto from 'crypto';

export class ProductService {
  private productRepo = repositories.productRepo;
  private categoryRepo = repositories.categoryRepo;

  public async getProducts(filter?: {
    category?: string;
    search?: string;
    sort?: string;
    activeOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    return this.productRepo.findAll(filter);
  }

  public async getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
    const product = await this.productRepo.findById(idOrSlug);
    if (product) return product;
    return this.productRepo.findBySlug(idOrSlug);
  }

  public async createProduct(data: {
    name: string;
    slug?: string;
    sku?: string;
    categoryId: string;
    description?: string;
    price?: number;
    priceKobo?: number;
    wholesaleEnabled?: boolean;
    retailEnabled?: boolean;
    wholesaleMinQty?: number;
    wholesalePrice?: number;
    wholesalePriceKobo?: number;
    images: string[];
    stockQuantity?: number;
    lowStockThreshold?: number;
    specs?: { label: string; value: string }[];
    active?: boolean;
    featured?: boolean;
  }): Promise<Product> {
    const category = await this.categoryRepo.findById(data.categoryId) || await this.categoryRepo.findBySlug(data.categoryId);
    const categoryName = category ? category.name : 'Hardware';
    const categorySlug = category ? category.slug : data.categoryId;

    const baseSlug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let finalSlug = baseSlug;
    let count = 1;
    while (await this.productRepo.findBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${count++}`;
    }

    const sku = data.sku || `MOB-${Math.floor(100 + Math.random() * 900)}`;
    const finalPriceKobo = data.priceKobo ?? (data.price ? Math.round(data.price * 100) : 0);
    const finalWholesalePriceKobo = data.wholesalePriceKobo ?? (data.wholesalePrice ? Math.round(data.wholesalePrice * 100) : undefined);

    const newProduct: Product = {
      id: `prod-${crypto.randomUUID()}`,
      name: data.name,
      slug: finalSlug,
      sku,
      categoryId: category ? category.id : data.categoryId,
      categoryName,
      categorySlug,
      description: data.description || '',
      priceKobo: finalPriceKobo,
      wholesaleEnabled: data.wholesaleEnabled !== false,
      retailEnabled: data.retailEnabled !== false,
      wholesaleMinQty: data.wholesaleMinQty,
      wholesalePriceKobo: finalWholesalePriceKobo,
      images: data.images,
      stockQuantity: data.stockQuantity || 0,
      reservedQuantity: 0,
      lowStockThreshold: data.lowStockThreshold || 5,
      specs: data.specs || [],
      active: data.active !== false,
      featured: Boolean(data.featured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.productRepo.create(newProduct);
  }

  public async updateProduct(id: string, updates: any): Promise<Product | null> {
    const payload: Partial<Product> = { ...updates };
    if (updates.price !== undefined && updates.priceKobo === undefined) {
      payload.priceKobo = Math.round(updates.price * 100);
    }
    if (updates.wholesalePrice !== undefined && updates.wholesalePriceKobo === undefined) {
      payload.wholesalePriceKobo = Math.round(updates.wholesalePrice * 100);
    }
    return this.productRepo.update(id, payload);
  }

  public async deleteProduct(id: string): Promise<boolean> {
    return this.productRepo.delete(id); // Soft deactivates
  }
}

export class CategoryService {
  private categoryRepo = repositories.categoryRepo;

  public async getCategories(activeOnly = true): Promise<Category[]> {
    return this.categoryRepo.findAll(activeOnly);
  }

  public async getCategoryByIdOrSlug(idOrSlug: string): Promise<Category | null> {
    const byId = await this.categoryRepo.findById(idOrSlug);
    if (byId) return byId;
    return this.categoryRepo.findBySlug(idOrSlug);
  }

  public async createCategory(data: {
    name: string;
    slug?: string;
    image: string;
    description?: string;
    displayOrder?: number;
    active?: boolean;
  }): Promise<Category> {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCategory: Category = {
      id: `cat-${crypto.randomUUID()}`,
      name: data.name,
      slug,
      image: data.image,
      description: data.description || '',
      displayOrder: data.displayOrder || 0,
      active: data.active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.categoryRepo.create(newCategory);
  }

  public async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    return this.categoryRepo.update(id, updates);
  }

  public async deleteCategory(id: string): Promise<boolean> {
    return this.categoryRepo.delete(id);
  }
}

export const productService = new ProductService();
export const categoryService = new CategoryService();
