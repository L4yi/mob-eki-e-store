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
} from '../types';

export interface IProductRepository {
  findAll(filter?: {
    category?: string;
    search?: string;
    sort?: string;
    activeOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  update(id: string, updates: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
  getLowStock(threshold?: number): Promise<Product[]>;
  reserveStock(productId: string, quantity: number): Promise<boolean>;
  releaseStock(productId: string, quantity: number): Promise<boolean>;
  commitSale(productId: string, quantity: number): Promise<boolean>;
}

export interface ICategoryRepository {
  findAll(activeOnly?: boolean): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(category: Category): Promise<Category>;
  update(id: string, updates: Partial<Category>): Promise<Category | null>;
  delete(id: string): Promise<boolean>;
}

export interface IOrderRepository {
  findAll(filter?: {
    userId?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }>;
  findById(id: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findByTrackingToken(token: string): Promise<Order | null>;
  findByIdempotencyKey(key: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  update(id: string, updates: Partial<Order>): Promise<Order | null>;
  findExpiredPendingOrders(now: Date): Promise<Order[]>;
}

export interface IInventoryRepository {
  recordMovement(movement: InventoryMovement): Promise<InventoryMovement>;
  getMovements(filter?: {
    productId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ movements: InventoryMovement[]; total: number }>;
}

export interface IPaymentRepository {
  findAll(filter?: {
    orderId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ payments: Payment[]; total: number }>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  findByReference(reference: string): Promise<Payment | null>;
  create(payment: Payment): Promise<Payment>;
  update(id: string, updates: Partial<Payment>): Promise<Payment | null>;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User | null>;
  findAll(page?: number, limit?: number): Promise<{ users: User[]; total: number }>;
}

export interface IAddressRepository {
  findByUserId(userId: string): Promise<SavedAddress[]>;
  findById(id: string): Promise<SavedAddress | null>;
  create(address: SavedAddress): Promise<SavedAddress>;
  update(id: string, updates: Partial<SavedAddress>): Promise<SavedAddress | null>;
  delete(id: string): Promise<boolean>;
}

export interface IAuditLogRepository {
  record(log: AdminAuditLog): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{ logs: AdminAuditLog[]; total: number }>;
}

export interface ISettingsRepository {
  getSettings(): Promise<BusinessSettings>;
  updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings>;
  getTeam(): Promise<TeamMember[]>;
  updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember | null>;
  createTeamMember(member: TeamMember): Promise<TeamMember>;
  getDeliveryZones(): Promise<DeliveryZoneConfig[]>;
  updateDeliveryZone(id: string, config: Partial<DeliveryZoneConfig>): Promise<DeliveryZoneConfig | null>;
}
