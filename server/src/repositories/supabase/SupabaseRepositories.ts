import { SupabaseClient } from '@supabase/supabase-js';
import {
  IProductRepository,
  ICategoryRepository,
  IOrderRepository,
  IInventoryRepository,
  IPaymentRepository,
  IUserRepository,
  ISettingsRepository,
  IAuditLogRepository,
} from '../interfaces';
import {
  Product,
  Category,
  Order,
  InventoryMovement,
  Payment,
  User,
  BusinessSettings,
  TeamMember,
  DeliveryZoneConfig,
  AdminAuditLog,
} from '../../types';

export class SupabaseProductRepository implements IProductRepository {
  constructor(private client: SupabaseClient) {}

  async findAll(filter?: {
    category?: string;
    search?: string;
    sort?: string;
    activeOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    let query = this.client.from('products').select('*', { count: 'exact' });

    if (filter?.activeOnly !== false) {
      query = query.eq('active', true);
    }
    if (filter?.category) {
      query = query.or(`category_id.eq.${filter.category},category_slug.eq.${filter.category}`);
    }
    if (filter?.search) {
      query = query.or(`name.ilike.%${filter.search}%,description.ilike.%${filter.search}%,sku.ilike.%${filter.search}%`);
    }

    if (filter?.sort === 'price_asc') {
      query = query.order('price_kobo', { ascending: true });
    } else if (filter?.sort === 'price_desc') {
      query = query.order('price_kobo', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    return {
      products: (data || []).map(this.mapToProduct),
      total: count || 0,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.client.from('products').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    return this.mapToProduct(data);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.client.from('products').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return null;
    return this.mapToProduct(data);
  }

  async findBySku(sku: string): Promise<Product | null> {
    const { data, error } = await this.client.from('products').select('*').eq('sku', sku).maybeSingle();
    if (error || !data) return null;
    return this.mapToProduct(data);
  }

  async create(product: Product): Promise<Product> {
    const row = this.mapToRow(product);
    const { data, error } = await this.client.from('products').insert(row).select().single();
    if (error) throw error;
    return this.mapToProduct(data);
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const updateRow: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) updateRow.name = updates.name;
    if (updates.slug !== undefined) updateRow.slug = updates.slug;
    if (updates.sku !== undefined) updateRow.sku = updates.sku;
    if (updates.categoryId !== undefined) updateRow.category_id = updates.categoryId;
    if (updates.categoryName !== undefined) updateRow.category_name = updates.categoryName;
    if (updates.categorySlug !== undefined) updateRow.category_slug = updates.categorySlug;
    if (updates.description !== undefined) updateRow.description = updates.description;
    if (updates.priceKobo !== undefined) updateRow.price_kobo = updates.priceKobo;
    if (updates.wholesaleEnabled !== undefined) updateRow.wholesale_enabled = updates.wholesaleEnabled;
    if (updates.retailEnabled !== undefined) updateRow.retail_enabled = updates.retailEnabled;
    if (updates.wholesaleMinQty !== undefined) updateRow.wholesale_min_qty = updates.wholesaleMinQty;
    if (updates.wholesalePriceKobo !== undefined) updateRow.wholesale_price_kobo = updates.wholesalePriceKobo;
    if (updates.images !== undefined) updateRow.images = updates.images;
    if (updates.stockQuantity !== undefined) updateRow.stock_quantity = updates.stockQuantity;
    if (updates.reservedQuantity !== undefined) updateRow.reserved_quantity = updates.reservedQuantity;
    if (updates.lowStockThreshold !== undefined) updateRow.low_stock_threshold = updates.lowStockThreshold;
    if (updates.specs !== undefined) updateRow.specs = updates.specs;
    if (updates.active !== undefined) updateRow.active = updates.active;
    if (updates.featured !== undefined) updateRow.featured = updates.featured;

    const { data, error } = await this.client.from('products').update(updateRow).eq('id', id).select().maybeSingle();
    if (error || !data) return null;
    return this.mapToProduct(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client.from('products').update({ active: false, updated_at: new Date().toISOString() }).eq('id', id);
    return !error;
  }

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.findById(productId);
    if (!product) return false;
    const available = product.stockQuantity - product.reservedQuantity;
    if (available < quantity) return false;

    const { error } = await this.client
      .from('products')
      .update({
        reserved_quantity: product.reservedQuantity + quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);
    return !error;
  }

  async releaseStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.findById(productId);
    if (!product) return false;
    const newReserved = Math.max(0, product.reservedQuantity - quantity);

    const { error } = await this.client
      .from('products')
      .update({
        reserved_quantity: newReserved,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);
    return !error;
  }

  async commitSale(productId: string, quantity: number): Promise<boolean> {
    const product = await this.findById(productId);
    if (!product) return false;
    const newStock = Math.max(0, product.stockQuantity - quantity);
    const newReserved = Math.max(0, product.reservedQuantity - quantity);

    const { error } = await this.client
      .from('products')
      .update({
        stock_quantity: newStock,
        reserved_quantity: newReserved,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);
    return !error;
  }

  async getLowStock(threshold?: number): Promise<Product[]> {
    const { data, error } = await this.client.from('products').select('*').eq('active', true);
    if (error || !data) return [];
    return data
      .map(this.mapToProduct)
      .filter((p) => p.stockQuantity - p.reservedQuantity <= (threshold ?? p.lowStockThreshold));
  }

  private mapToProduct(row: any): Product {
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      sku: row.sku,
      categoryId: row.category_id,
      categoryName: row.category_name,
      categorySlug: row.category_slug,
      description: row.description || '',
      priceKobo: Number(row.price_kobo),
      wholesaleEnabled: row.wholesale_enabled ?? true,
      retailEnabled: row.retail_enabled ?? true,
      wholesaleMinQty: row.wholesale_min_qty,
      wholesalePriceKobo: row.wholesale_price_kobo ? Number(row.wholesale_price_kobo) : undefined,
      images: Array.isArray(row.images) ? row.images : [],
      stockQuantity: row.stock_quantity ?? 0,
      reservedQuantity: row.reserved_quantity ?? 0,
      lowStockThreshold: row.low_stock_threshold ?? 5,
      specs: Array.isArray(row.specs) ? row.specs : [],
      active: row.active ?? true,
      featured: row.featured ?? false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapToRow(p: Product): any {
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      sku: p.sku,
      category_id: p.categoryId,
      category_name: p.categoryName,
      category_slug: p.categorySlug,
      description: p.description,
      price_kobo: p.priceKobo,
      wholesale_enabled: p.wholesaleEnabled,
      retail_enabled: p.retailEnabled,
      wholesale_min_qty: p.wholesaleMinQty,
      wholesale_price_kobo: p.wholesalePriceKobo,
      images: p.images,
      stock_quantity: p.stockQuantity,
      reserved_quantity: p.reservedQuantity,
      low_stock_threshold: p.lowStockThreshold,
      specs: p.specs,
      active: p.active,
      featured: p.featured,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    };
  }
}

export class SupabaseCategoryRepository implements ICategoryRepository {
  constructor(private client: SupabaseClient) {}

  async findAll(activeOnly = true): Promise<Category[]> {
    let query = this.client.from('categories').select('*').order('display_order', { ascending: true });
    if (activeOnly) {
      query = query.eq('active', true);
    }
    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(this.mapToCategory);
  }

  async findById(id: string): Promise<Category | null> {
    const { data, error } = await this.client.from('categories').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    return this.mapToCategory(data);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await this.client.from('categories').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return null;
    return this.mapToCategory(data);
  }

  async create(category: Category): Promise<Category> {
    const row = {
      id: category.id,
      slug: category.slug,
      name: category.name,
      image: category.image,
      description: category.description,
      display_order: category.displayOrder,
      active: category.active,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    };
    const { data, error } = await this.client.from('categories').insert(row).select().single();
    if (error) throw error;
    return this.mapToCategory(data);
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const rowUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) rowUpdates.name = updates.name;
    if (updates.slug !== undefined) rowUpdates.slug = updates.slug;
    if (updates.image !== undefined) rowUpdates.image = updates.image;
    if (updates.description !== undefined) rowUpdates.description = updates.description;
    if (updates.displayOrder !== undefined) rowUpdates.display_order = updates.displayOrder;
    if (updates.active !== undefined) rowUpdates.active = updates.active;

    const { data, error } = await this.client.from('categories').update(rowUpdates).eq('id', id).select().maybeSingle();
    if (error || !data) return null;
    return this.mapToCategory(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client.from('categories').update({ active: false, updated_at: new Date().toISOString() }).eq('id', id);
    return !error;
  }

  private mapToCategory(row: any): Category {
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      image: row.image,
      description: row.description || '',
      displayOrder: row.display_order ?? 0,
      active: row.active ?? true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export class SupabaseOrderRepository implements IOrderRepository {
  constructor(private client: SupabaseClient) {}

  async findAll(filter?: {
    userId?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> {
    let query = this.client.from('orders').select('*', { count: 'exact' });

    if (filter?.userId) query = query.eq('user_id', filter.userId);
    if (filter?.status && filter.status !== 'ALL') query = query.eq('order_status', filter.status);
    if (filter?.paymentStatus && filter.paymentStatus !== 'ALL') query = query.eq('payment_status', filter.paymentStatus);

    query = query.order('created_at', { ascending: false });

    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    return {
      orders: (data || []).map(this.mapToOrder),
      total: count || 0,
    };
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await this.client.from('orders').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    return this.mapToOrder(data);
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await this.client.from('orders').select('*').eq('order_number', orderNumber).maybeSingle();
    if (error || !data) return null;
    return this.mapToOrder(data);
  }

  async findByIdempotencyKey(key: string): Promise<Order | null> {
    const { data, error } = await this.client.from('orders').select('*').eq('idempotency_key', key).maybeSingle();
    if (error || !data) return null;
    return this.mapToOrder(data);
  }

  async findByTrackingToken(token: string): Promise<Order | null> {
    const { data, error } = await this.client.from('orders').select('*').eq('tracking_token', token).maybeSingle();
    if (error || !data) return null;
    return this.mapToOrder(data);
  }

  async findExpiredPendingOrders(now: Date): Promise<Order[]> {
    const threshold = now.toISOString();
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .eq('order_status', 'PENDING_PAYMENT')
      .lt('reservation_expires_at', threshold);

    if (error || !data) return [];
    return data.map(this.mapToOrder);
  }

  async create(order: Order): Promise<Order> {
    const row = {
      id: order.id,
      order_number: order.orderNumber,
      user_id: order.userId || null,
      idempotency_key: order.idempotencyKey || null,
      tracking_token: order.trackingToken,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      delivery_state: order.deliveryState,
      delivery_city: order.deliveryCity,
      delivery_address: order.deliveryAddress,
      delivery_notes: order.deliveryNotes || '',
      delivery_zone: order.deliveryZone,
      subtotal_kobo: order.subtotalKobo,
      delivery_fee_kobo: order.deliveryFeeKobo,
      total_kobo: order.totalKobo,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      items: order.items,
      tracking_notes: order.trackingNotes,
      reservation_expires_at: order.reservationExpiresAt,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    };
    const { data, error } = await this.client.from('orders').insert(row).select().single();
    if (error) throw error;
    return this.mapToOrder(data);
  }

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    const rowUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.orderStatus !== undefined) rowUpdates.order_status = updates.orderStatus;
    if (updates.paymentStatus !== undefined) rowUpdates.payment_status = updates.paymentStatus;
    if (updates.trackingNotes !== undefined) rowUpdates.tracking_notes = updates.trackingNotes;
    if (updates.reservationExpiresAt !== undefined) rowUpdates.reservation_expires_at = updates.reservationExpiresAt;

    const { data, error } = await this.client.from('orders').update(rowUpdates).eq('id', id).select().maybeSingle();
    if (error || !data) return null;
    return this.mapToOrder(data);
  }

  private mapToOrder(row: any): Order {
    return {
      id: row.id,
      orderNumber: row.order_number,
      userId: row.user_id,
      idempotencyKey: row.idempotency_key,
      trackingToken: row.tracking_token,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      deliveryState: row.delivery_state,
      deliveryCity: row.delivery_city,
      deliveryAddress: row.delivery_address,
      deliveryNotes: row.delivery_notes,
      deliveryZone: row.delivery_zone,
      subtotalKobo: Number(row.subtotal_kobo),
      deliveryFeeKobo: Number(row.delivery_fee_kobo),
      discountKobo: Number(row.discount_kobo || 0),
      totalKobo: Number(row.total_kobo),
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      orderStatus: row.order_status,
      items: Array.isArray(row.items) ? row.items : [],
      trackingNotes: Array.isArray(row.tracking_notes) ? row.tracking_notes : [],
      reservationExpiresAt: row.reservation_expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export class SupabaseInventoryRepository implements IInventoryRepository {
  constructor(private client: SupabaseClient) {}

  async recordMovement(movement: InventoryMovement): Promise<InventoryMovement> {
    const row = {
      id: movement.id,
      product_id: movement.productId,
      product_name: movement.productName,
      sku: movement.sku,
      type: movement.type,
      quantity_change: movement.quantityChange,
      previous_stock: movement.previousStock,
      new_stock: movement.newStock,
      reason: movement.reason,
      reference_id: movement.referenceId || null,
      performed_by: movement.performedBy,
      created_at: movement.createdAt,
    };
    const { data, error } = await this.client.from('inventory_movements').insert(row).select().single();
    if (error) throw error;
    return this.mapToMovement(data);
  }

  async getMovements(filter?: {
    productId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ movements: InventoryMovement[]; total: number }> {
    let query = this.client.from('inventory_movements').select('*', { count: 'exact' });

    if (filter?.productId) query = query.eq('product_id', filter.productId);
    if (filter?.type) query = query.eq('type', filter.type);

    query = query.order('created_at', { ascending: false });

    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    return {
      movements: (data || []).map(this.mapToMovement),
      total: count || 0,
    };
  }

  private mapToMovement(row: any): InventoryMovement {
    return {
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      sku: row.sku,
      type: row.type,
      quantityChange: row.quantity_change,
      previousStock: row.previous_stock,
      newStock: row.new_stock,
      reason: row.reason,
      referenceId: row.reference_id,
      performedBy: row.performed_by,
      createdAt: row.created_at,
    };
  }
}

export class SupabasePaymentRepository implements IPaymentRepository {
  constructor(private client: SupabaseClient) {}

  async create(payment: Payment): Promise<Payment> {
    const row = {
      id: payment.id,
      order_id: payment.orderId,
      provider: payment.provider,
      provider_reference: payment.providerReference,
      provider_transaction_id: payment.providerTransactionId || null,
      method: payment.method,
      amount_kobo: payment.amountKobo,
      currency: payment.currency,
      status: payment.status,
      verification_method: payment.verificationMethod || null,
      verified_by: payment.verifiedBy || null,
      verified_at: payment.verifiedAt || null,
      paid_at: payment.paidAt || null,
      created_at: payment.createdAt,
      updated_at: payment.updatedAt,
    };
    const { data, error } = await this.client.from('payments').insert(row).select().single();
    if (error) throw error;
    return this.mapToPayment(data);
  }

  async findById(id: string): Promise<Payment | null> {
    const { data, error } = await this.client.from('payments').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    return this.mapToPayment(data);
  }

  async findByReference(reference: string): Promise<Payment | null> {
    const { data, error } = await this.client.from('payments').select('*').eq('provider_reference', reference).maybeSingle();
    if (error || !data) return null;
    return this.mapToPayment(data);
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const { data, error } = await this.client.from('payments').select('*').eq('order_id', orderId).maybeSingle();
    if (error || !data) return null;
    return this.mapToPayment(data);
  }

  async update(id: string, updates: Partial<Payment>): Promise<Payment | null> {
    const rowUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.status !== undefined) rowUpdates.status = updates.status;
    if (updates.providerReference !== undefined) rowUpdates.provider_reference = updates.providerReference;
    if (updates.providerTransactionId !== undefined) rowUpdates.provider_transaction_id = updates.providerTransactionId;
    if (updates.verificationMethod !== undefined) rowUpdates.verification_method = updates.verificationMethod;
    if (updates.verifiedBy !== undefined) rowUpdates.verified_by = updates.verifiedBy;
    if (updates.verifiedAt !== undefined) rowUpdates.verified_at = updates.verifiedAt;
    if (updates.paidAt !== undefined) rowUpdates.paid_at = updates.paidAt;

    const { data, error } = await this.client.from('payments').update(rowUpdates).eq('id', id).select().maybeSingle();
    if (error || !data) return null;
    return this.mapToPayment(data);
  }

  async findAll(filter?: { orderId?: string; status?: string; page?: number; limit?: number }): Promise<{ payments: Payment[]; total: number }> {
    let query = this.client.from('payments').select('*', { count: 'exact' });

    if (filter?.orderId) query = query.eq('order_id', filter.orderId);
    if (filter?.status) query = query.eq('status', filter.status);

    query = query.order('created_at', { ascending: false });

    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query.range(from, to);
    if (error) throw error;

    return {
      payments: (data || []).map(this.mapToPayment),
      total: count || 0,
    };
  }

  private mapToPayment(row: any): Payment {
    return {
      id: row.id,
      orderId: row.order_id,
      provider: row.provider,
      providerReference: row.provider_reference,
      providerTransactionId: row.provider_transaction_id,
      method: row.method,
      amountKobo: Number(row.amount_kobo),
      currency: row.currency,
      status: row.status,
      verificationMethod: row.verification_method,
      verifiedBy: row.verified_by,
      verifiedAt: row.verified_at,
      paidAt: row.paid_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export class SupabaseUserRepository implements IUserRepository {
  constructor(private client: SupabaseClient) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.client.from('users').select('*').eq('id', id).maybeSingle();
    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client.from('users').select('*').ilike('email', email).maybeSingle();
    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async create(user: User): Promise<User> {
    const row = {
      id: user.id,
      name: user.name,
      email: user.email.toLowerCase(),
      phone: user.phone || null,
      password_hash: user.passwordHash,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
    const { data, error } = await this.client.from('users').insert(row).select().single();
    if (error) throw error;
    return this.mapToUser(data);
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const rowUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) rowUpdates.name = updates.name;
    if (updates.phone !== undefined) rowUpdates.phone = updates.phone;
    if (updates.passwordHash !== undefined) rowUpdates.password_hash = updates.passwordHash;
    if (updates.role !== undefined) rowUpdates.role = updates.role;

    const { data, error } = await this.client.from('users').update(rowUpdates).eq('id', id).select().maybeSingle();
    if (error || !data) return null;
    return this.mapToUser(data);
  }

  async findAll(page = 1, limit = 50): Promise<{ users: User[]; total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count, error } = await this.client.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);
    if (error) throw error;
    return {
      users: (data || []).map(this.mapToUser),
      total: count || 0,
    };
  }

  private mapToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      passwordHash: row.password_hash,
      role: row.role,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export class SupabaseSettingsRepository implements ISettingsRepository {
  constructor(private client: SupabaseClient) {}

  async getSettings(): Promise<BusinessSettings> {
    const { data, error } = await this.client.from('business_settings').select('*').eq('id', 'default').maybeSingle();
    if (data) {
      return {
        id: data.id,
        storeName: data.store_name,
        tagline: data.tagline,
        address: data.address,
        openingHours: data.opening_hours,
        phone1: data.phone1,
        phone2: data.phone2,
        phone3: data.phone3,
        whatsapp: data.whatsapp,
        email: data.email,
        deliveryLagosKobo: Number(data.delivery_lagos_kobo),
        deliverySouthWestKobo: Number(data.delivery_south_west_kobo),
        deliveryNationwideKobo: Number(data.delivery_nationwide_kobo),
        bankName: data.bank_name,
        bankAccountName: data.bank_account_name,
        bankAccountNumber: data.bank_account_number,
        aboutText: data.about_text,
        announcementText: data.announcement_text,
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    }
    // Fallback default
    return {
      id: 'default',
      storeName: 'M.O.B EKI VENTURES',
      tagline: 'Premium Furniture Accessories & Architectural Hardware',
      address: '2, Amu Street, Mushin Market, Lagos, Nigeria',
      openingHours: 'Mon - Sat: 8:00 AM - 5:00 PM',
      phone1: '08108725967',
      phone2: '08025262598',
      phone3: '08028077200',
      whatsapp: '2348108725967',
      email: 'muhazoladejo48@gmail.com',
      deliveryLagosKobo: 200000,
      deliverySouthWestKobo: 350000,
      deliveryNationwideKobo: 500000,
      bankName: 'Guaranty Trust Bank (GTBank)',
      bankAccountName: 'M.O.B EKI VENTURES',
      bankAccountNumber: '0123456789',
      aboutText: 'M.O.B EKI VENTURES is a premier hardware dealership located at 2, Amu Street, Mushin Market, Lagos.',
      announcementText: 'Nationwide delivery available · Retail & wholesale orders welcome',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateSettings(updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const row: any = { id: 'default', updated_at: new Date().toISOString() };
    if (updates.storeName !== undefined) row.store_name = updates.storeName;
    if (updates.tagline !== undefined) row.tagline = updates.tagline;
    if (updates.address !== undefined) row.address = updates.address;
    if (updates.openingHours !== undefined) row.opening_hours = updates.openingHours;
    if (updates.phone1 !== undefined) row.phone1 = updates.phone1;
    if (updates.phone2 !== undefined) row.phone2 = updates.phone2;
    if (updates.phone3 !== undefined) row.phone3 = updates.phone3;
    if (updates.whatsapp !== undefined) row.whatsapp = updates.whatsapp;
    if (updates.email !== undefined) row.email = updates.email;
    if (updates.deliveryLagosKobo !== undefined) row.delivery_lagos_kobo = updates.deliveryLagosKobo;
    if (updates.deliverySouthWestKobo !== undefined) row.delivery_south_west_kobo = updates.deliverySouthWestKobo;
    if (updates.deliveryNationwideKobo !== undefined) row.delivery_nationwide_kobo = updates.deliveryNationwideKobo;
    if (updates.bankName !== undefined) row.bank_name = updates.bankName;
    if (updates.bankAccountName !== undefined) row.bank_account_name = updates.bankAccountName;
    if (updates.bankAccountNumber !== undefined) row.bank_account_number = updates.bankAccountNumber;
    if (updates.aboutText !== undefined) row.about_text = updates.aboutText;
    if (updates.announcementText !== undefined) row.announcement_text = updates.announcementText;

    const { error } = await this.client.from('business_settings').upsert(row);
    if (error) console.error('Error updating business settings:', error);
    return this.getSettings();
  }

  async getTeam(): Promise<TeamMember[]> {
    const { data, error } = await this.client.from('team_members').select('*').order('display_order', { ascending: true });
    if (error || !data || data.length === 0) {
      return [
        {
          id: 'team-1',
          name: 'Mulikat & Mutiu Oladejo',
          position: 'Founders & Directors',
          bio: 'Visionary founders behind M.O.B EKI VENTURES, establishing over three decades of trust in Nigerian hardware trade.',
          image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&h=600&fit=crop&q=80',
          displayOrder: 1,
          active: true,
        },
        {
          id: 'team-2',
          name: 'Oladejo Muhaz Olayiwola',
          position: 'General Manager',
          bio: 'Oversees operational leadership, supply chain logistics, wholesale partnerships, and direct customer satisfaction.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&q=80',
          displayOrder: 2,
          active: true,
        },
      ];
    }
    return data.map((d) => ({
      id: d.id,
      name: d.name,
      position: d.position,
      bio: d.bio,
      image: d.image,
      displayOrder: d.display_order,
      active: d.active,
    }));
  }

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember | null> {
    const { data, error } = await this.client.from('team_members').update(member).eq('id', id).select().maybeSingle();
    if (error || !data) return null;
    return data;
  }

  async createTeamMember(member: TeamMember): Promise<TeamMember> {
    const { data, error } = await this.client.from('team_members').insert(member).select().single();
    if (error) throw error;
    return data;
  }

  async getDeliveryZones(): Promise<DeliveryZoneConfig[]> {
    return [
      { id: 'LAGOS', name: 'Lagos State (Standard)', states: ['Lagos'], feeKobo: 200000, estimatedDays: '1–2 business days', active: true },
      { id: 'SOUTH_WEST', name: 'South-West States (Ogun, Oyo, Osun, Ondo, Ekiti)', states: ['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'], feeKobo: 350000, estimatedDays: '2–3 business days', active: true },
      { id: 'NATIONWIDE', name: 'Nationwide Delivery (All Other States)', states: ['*'], feeKobo: 500000, estimatedDays: '3–5 business days', active: true },
      { id: 'PICKUP', name: 'Store Pickup (2, Amu Street, Mushin Market, Lagos)', states: ['Lagos'], feeKobo: 0, estimatedDays: 'Same Day / Next Day', active: true },
    ];
  }

  async updateDeliveryZone(id: string, config: Partial<DeliveryZoneConfig>): Promise<DeliveryZoneConfig | null> {
    const zones = await this.getDeliveryZones();
    const zone = zones.find((z) => z.id === id);
    if (!zone) return null;
    return { ...zone, ...config };
  }
}

export class SupabaseAuditLogRepository implements IAuditLogRepository {
  constructor(private client: SupabaseClient) {}

  async record(log: AdminAuditLog): Promise<void> {
    const row = {
      id: log.id,
      admin_id: log.adminId,
      admin_email: log.adminEmail,
      action: log.action,
      entity_type: log.entityType,
      entity_id: log.entityId || null,
      before_state: log.beforeState || null,
      after_state: log.afterState || null,
      ip_address: log.ipAddress || null,
      created_at: log.createdAt,
    };
    const { error } = await this.client.from('audit_logs').insert(row);
    if (error) console.error('Error recording audit log in Supabase:', error);
  }

  async findAll(page = 1, limit = 50): Promise<{ logs: AdminAuditLog[]; total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count, error } = await this.client.from('audit_logs').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);
    if (error || !data) return { logs: [], total: 0 };
    return {
      logs: data.map((d) => ({
        id: d.id,
        adminId: d.admin_id,
        adminEmail: d.admin_email,
        action: d.action,
        entityType: d.entity_type,
        entityId: d.entity_id,
        beforeState: d.before_state,
        afterState: d.after_state,
        ipAddress: d.ip_address,
        createdAt: d.created_at,
      })),
      total: count || 0,
    };
  }
}
