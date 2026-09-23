import fs from 'fs';
import path from 'path';
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
import {
  initialCategories,
  initialProducts,
  initialSettings,
  initialTeamMembers,
  initialDeliveryZones,
  getInitialAdminUser,
} from '../../lib/seedData';

export interface DataStoreShape {
  users: User[];
  addresses: SavedAddress[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  movements: InventoryMovement[];
  payments: Payment[];
  auditLogs: AdminAuditLog[];
  settings: BusinessSettings;
  team: TeamMember[];
  deliveryZones: DeliveryZoneConfig[];
}

const DATA_DIR = path.join(__dirname, '../../../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

export class JsonStore {
  private static instance: JsonStore;
  private data: DataStoreShape = {
    users: [],
    addresses: [],
    categories: [],
    products: [],
    orders: [],
    movements: [],
    payments: [],
    auditLogs: [],
    settings: initialSettings,
    team: initialTeamMembers,
    deliveryZones: initialDeliveryZones,
  };
  private isLoaded = false;
  private lock = false;

  private constructor() {}

  public static getInstance(): JsonStore {
    if (!JsonStore.instance) {
      JsonStore.instance = new JsonStore();
    }
    return JsonStore.instance;
  }

  public async init(): Promise<void> {
    if (this.isLoaded) return;

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || [],
          addresses: parsed.addresses || [],
          categories: parsed.categories || initialCategories,
          products: (parsed.products || initialProducts).map((p: any) => ({
            ...p,
            priceKobo: p.priceKobo || (p.price ? p.price * 100 : 0),
            reservedQuantity: p.reservedQuantity || 0,
            stockQuantity: p.stockQuantity !== undefined ? p.stockQuantity : 0,
            lowStockThreshold: p.lowStockThreshold || 5,
          })),
          orders: parsed.orders || [],
          movements: parsed.movements || parsed.inventory || [],
          payments: parsed.payments || [],
          auditLogs: parsed.auditLogs || [],
          settings: parsed.settings || initialSettings,
          team: parsed.team || initialTeamMembers,
          deliveryZones: parsed.deliveryZones || initialDeliveryZones,
        };
      } catch (e) {
        console.error('[JsonStore] Corrupt store.json detected, re-seeding...', e);
        await this.seed();
      }
    } else {
      await this.seed();
    }

    this.isLoaded = true;
  }

  public async seed(): Promise<void> {
    const adminUser = await getInitialAdminUser();
    this.data = {
      users: [adminUser],
      addresses: [],
      categories: initialCategories,
      products: initialProducts,
      orders: [],
      movements: initialProducts.map((p) => ({
        id: `mov-init-${p.id}`,
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        type: 'RESTOCK',
        quantityChange: p.stockQuantity,
        previousStock: 0,
        newStock: p.stockQuantity,
        reason: 'Initial Mushin Showroom Stock Loading',
        performedBy: 'SYSTEM',
        createdAt: new Date().toISOString(),
      })),
      payments: [],
      auditLogs: [],
      settings: initialSettings,
      team: initialTeamMembers,
      deliveryZones: initialDeliveryZones,
    };
    this.save();
  }

  public save(): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[JsonStore] Failed to write store.json:', e);
    }
  }

  public async get<K extends keyof DataStoreShape>(key: K): Promise<DataStoreShape[K]> {
    await this.init();
    return this.data[key];
  }

  public async mutate<R>(fn: (data: DataStoreShape) => R): Promise<R> {
    await this.init();
    while (this.lock) {
      await new Promise((r) => setTimeout(r, 10));
    }
    this.lock = true;
    try {
      const result = fn(this.data);
      this.save();
      return result;
    } finally {
      this.lock = false;
    }
  }
}
