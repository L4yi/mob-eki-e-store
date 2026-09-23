export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'ORDER_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  passwordHash?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface SavedAddress {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  deliveryNotes?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string; // UNIQUE (e.g. handles, knobs, hinges, locks, fittings, accessories)
  name: string;
  image: string;
  description: string;
  displayOrder: number;
  active: boolean;
  count?: number; // Calculated dynamically
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string; // UNIQUE
  sku: string;  // UNIQUE
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  description: string;
  priceKobo: number; // Stored in Kobo (₦1 = 100 kobo)
  wholesaleEnabled: boolean;
  retailEnabled: boolean;
  wholesaleMinQty?: number;
  wholesalePriceKobo?: number;
  images: string[];
  stockQuantity: number;      // Physical on-hand stock
  reservedQuantity: number;   // Pending payment reservation
  lowStockThreshold: number;
  specs: ProductSpec[];
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'AWAITING_VERIFICATION'
  | 'PAID'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

export type PaymentMethod =
  | 'PAYSTACK'
  | 'BANK_TRANSFER'
  | 'PAY_ON_DELIVERY';

export type DeliveryZone =
  | 'LAGOS'
  | 'SOUTH_WEST'
  | 'NATIONWIDE'
  | 'PICKUP';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPriceKobo: number; // Historical price snapshot in Kobo
  quantity: number;
}

export interface TrackingNote {
  timestamp: string;
  status: OrderStatus;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. MOB-2026-0842 (UNIQUE human reference)
  trackingToken: string; // Cryptographic secure token for guest order lookup
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryZone: DeliveryZone;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  subtotalKobo: number;
  discountKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  reservationExpiresAt?: string;
  items: OrderItem[];
  trackingNotes: TrackingNote[];
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export type InventoryAction =
  | 'RESTOCK'
  | 'RESERVATION'
  | 'RELEASE'
  | 'SALE'
  | 'ADJUSTMENT'
  | 'DAMAGE'
  | 'RETURN';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: InventoryAction;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  referenceType?: 'ORDER' | 'MANUAL_AUDIT' | 'RESTOCK_SHIPMENT';
  referenceId?: string;
  reason: string;
  performedBy?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: 'PAYSTACK' | 'BANK_TRANSFER' | 'MANUAL';
  providerReference?: string; // UNIQUE Paystack reference
  providerTransactionId?: string;
  method: PaymentMethod;
  amountKobo: number;
  currency: 'NGN';
  status: PaymentStatus;
  verificationMethod?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  entityType: 'PRODUCT' | 'CATEGORY' | 'ORDER' | 'INVENTORY' | 'PAYMENT' | 'SETTINGS';
  entityId: string;
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

export interface DeliveryZoneConfig {
  id: DeliveryZone;
  name: string;
  states: string[];
  feeKobo: number;
  estimatedDays: string;
  active: boolean;
}

export interface BusinessSettings {
  id: string;
  storeName: string;
  tagline: string;
  address: string;
  openingHours: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  whatsapp: string;
  email: string;
  deliveryLagosKobo: number;
  deliverySouthWestKobo: number;
  deliveryNationwideKobo: number;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  aboutText: string;
  announcementText: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  displayOrder: number;
  active: boolean;
}
