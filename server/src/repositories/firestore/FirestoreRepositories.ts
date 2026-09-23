import {
  IProductRepository,
  ICategoryRepository,
  IOrderRepository,
  IInventoryRepository,
  IPaymentRepository,
  IUserRepository,
  IAddressRepository,
  IAuditLogRepository,
  ISettingsRepository,
} from '../interfaces';
import {
  Product,
  Category,
  Order,
  InventoryMovement,
  Payment,
  User,
  SavedAddress,
  AdminAuditLog,
  BusinessSettings,
  TeamMember,
  DeliveryZoneConfig,
} from '../../types';
import { getFirebaseAdmin } from '../../lib/firebaseAdmin';

export class FirestoreProductRepository implements IProductRepository {
  private get db(): FirebaseFirestore.Firestore {
    const fb = getFirebaseAdmin();
    if (!fb.db) throw new Error('Firestore database is not available');
    return fb.db;
  }

  async findAll(filter?: {
    category?: string;
    search?: string;
    sort?: string;
    activeOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    let query: FirebaseFirestore.Query = this.db.collection('products');
    if (filter?.activeOnly !== false) {
      query = query.where('active', '==', true);
    }
    if (filter?.category && filter.category !== 'all') {
      query = query.where('categoryId', '==', filter.category);
    }

    const snapshot = await query.get();
    let list: Product[] = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => doc.data() as Product);

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter((p: Product) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
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

    return { products: list.slice(start, start + limit), total };
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await this.db.collection('products').doc(id).get();
    return doc.exists ? (doc.data() as Product) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const snap = await this.db.collection('products').where('slug', '==', slug).limit(1).get();
    if (!snap.empty) return snap.docs[0].data() as Product;
    return this.findById(slug);
  }

  async findBySku(sku: string): Promise<Product | null> {
    const snap = await this.db.collection('products').where('sku', '==', sku).limit(1).get();
    return snap.empty ? null : (snap.docs[0].data() as Product);
  }

  async create(product: Product): Promise<Product> {
    await this.db.collection('products').doc(product.id).set(product);
    return product;
  }

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const ref = this.db.collection('products').doc(id);
    await ref.update({ ...updates, updatedAt: new Date().toISOString() });
    const updated = await ref.get();
    return updated.data() as Product;
  }

  async delete(id: string): Promise<boolean> {
    await this.db.collection('products').doc(id).update({ active: false, updatedAt: new Date().toISOString() });
    return true;
  }

  async getLowStock(threshold = 10): Promise<Product[]> {
    const snap = await this.db.collection('products').where('active', '==', true).get();
    const list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Product);
    return list.filter((p: Product) => p.stockQuantity - p.reservedQuantity <= (p.lowStockThreshold || threshold));
  }

  async reserveStock(productId: string, quantity: number): Promise<boolean> {
    const ref = this.db.collection('products').doc(productId);
    return this.db.runTransaction(async (t: FirebaseFirestore.Transaction) => {
      const doc = await t.get(ref);
      if (!doc.exists) return false;
      const data = doc.data() as Product;
      const available = data.stockQuantity - data.reservedQuantity;
      if (available < quantity) return false;
      t.update(ref, {
        reservedQuantity: data.reservedQuantity + quantity,
        updatedAt: new Date().toISOString(),
      });
      return true;
    });
  }

  async releaseStock(productId: string, quantity: number): Promise<boolean> {
    const ref = this.db.collection('products').doc(productId);
    return this.db.runTransaction(async (t: FirebaseFirestore.Transaction) => {
      const doc = await t.get(ref);
      if (!doc.exists) return false;
      const data = doc.data() as Product;
      t.update(ref, {
        reservedQuantity: Math.max(0, data.reservedQuantity - quantity),
        updatedAt: new Date().toISOString(),
      });
      return true;
    });
  }

  async commitSale(productId: string, quantity: number): Promise<boolean> {
    const ref = this.db.collection('products').doc(productId);
    return this.db.runTransaction(async (t: FirebaseFirestore.Transaction) => {
      const doc = await t.get(ref);
      if (!doc.exists) return false;
      const data = doc.data() as Product;
      t.update(ref, {
        reservedQuantity: Math.max(0, data.reservedQuantity - quantity),
        stockQuantity: Math.max(0, data.stockQuantity - quantity),
        updatedAt: new Date().toISOString(),
      });
      return true;
    });
  }
}

export class FirestoreOrderRepository implements IOrderRepository {
  private get db(): FirebaseFirestore.Firestore {
    const fb = getFirebaseAdmin();
    if (!fb.db) throw new Error('Firestore database is not available');
    return fb.db;
  }

  async findAll(filter?: {
    userId?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> {
    let query: FirebaseFirestore.Query = this.db.collection('orders');
    if (filter?.userId) query = query.where('userId', '==', filter.userId);
    if (filter?.status) query = query.where('orderStatus', '==', filter.status);
    if (filter?.paymentStatus) query = query.where('paymentStatus', '==', filter.paymentStatus);

    const snapshot = await query.get();
    const list = snapshot.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Order);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const start = (page - 1) * limit;

    return { orders: list.slice(start, start + limit), total };
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await this.db.collection('orders').doc(id).get();
    return doc.exists ? (doc.data() as Order) : null;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const snap = await this.db.collection('orders').where('orderNumber', '==', orderNumber).limit(1).get();
    return snap.empty ? null : (snap.docs[0].data() as Order);
  }

  async findByTrackingToken(token: string): Promise<Order | null> {
    const snap = await this.db.collection('orders').where('trackingToken', '==', token).limit(1).get();
    return snap.empty ? null : (snap.docs[0].data() as Order);
  }

  async findByIdempotencyKey(key: string): Promise<Order | null> {
    const snap = await this.db.collection('orders').where('idempotencyKey', '==', key).limit(1).get();
    return snap.empty ? null : (snap.docs[0].data() as Order);
  }

  async create(order: Order): Promise<Order> {
    await this.db.collection('orders').doc(order.id).set(order);
    return order;
  }

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    const ref = this.db.collection('orders').doc(id);
    await ref.update({ ...updates, updatedAt: new Date().toISOString() });
    const updated = await ref.get();
    return updated.data() as Order;
  }

  async findExpiredPendingOrders(now: Date): Promise<Order[]> {
    const snap = await this.db
      .collection('orders')
      .where('orderStatus', '==', 'PENDING_PAYMENT')
      .get();
    const list = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Order);
    return list.filter((o: Order) => o.reservationExpiresAt && new Date(o.reservationExpiresAt) < now);
  }
}
