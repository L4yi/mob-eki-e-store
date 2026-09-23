export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string;
  description?: string;
  displayOrder: number;
  active: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  description: string;
  price: number;
  images: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  specs: ProductSpec[];
  active: boolean;
  featured: boolean;
  retailEnabled: boolean;
  wholesaleEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type DeliveryZone = 'LAGOS' | 'SOUTH_WEST' | 'NATIONWIDE' | 'PICKUP';
export type PaymentMethod = 'PAYSTACK' | 'BANK_TRANSFER' | 'PAY_ON_DELIVERY';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryState: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  deliveryZone: DeliveryZone;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName?: string;
  sku?: string;
  type: 'RESTOCK' | 'SALE' | 'ADJUSTMENT' | 'RESERVATION_RELEASE';
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string;
  createdAt: string;
}

export interface BusinessSettings {
  id: string;
  storeName: string;
  tagline: string;
  address: string;
  openingHours: string;
  phone1: string;
  phone2: string;
  phone3: string;
  whatsapp: string;
  email: string;
  deliveryLagos: number;
  deliverySouthWest: number;
  deliveryNationwide: number;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  aboutText: string;
  announcementText: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image: string;
  displayOrder: number;
  active: boolean;
}
