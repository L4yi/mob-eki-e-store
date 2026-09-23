import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid Nigerian phone number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Category Schemas
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric lowercase with dashes').optional(),
  image: z.string().min(1, 'Image is required'),
  description: z.string().default(''),
  displayOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema.partial();

// Product Schemas
export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2).optional(),
  sku: z.string().min(2).optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  description: z.string().default(''),
  price: z.number().positive('Price must be positive').optional(),
  priceKobo: z.number().int().positive('Price in kobo must be positive').optional(),
  wholesaleEnabled: z.boolean().default(true),
  retailEnabled: z.boolean().default(true),
  wholesaleMinQty: z.number().int().positive().optional(),
  wholesalePrice: z.number().positive().optional(),
  wholesalePriceKobo: z.number().int().positive().optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  stockQuantity: z.number().int().min(0, 'Stock cannot be negative').default(0),
  lowStockThreshold: z.number().int().min(1).default(5),
  specs: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  })).default([]),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial();

// Order Schemas
export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  productName: z.string().optional(),
  sku: z.string().optional(),
  unitPrice: z.number().optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerEmail: z.string().email('Valid customer email is required'),
  customerPhone: z.string().min(10, 'Valid Nigerian phone number is required'),
  deliveryZone: z.enum(['LAGOS', 'SOUTH_WEST', 'NATIONWIDE', 'PICKUP']),
  deliveryState: z.string().min(1, 'Delivery state is required'),
  deliveryCity: z.string().min(1, 'Delivery city is required'),
  deliveryAddress: z.string().min(3, 'Delivery address is required'),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(['PAYSTACK', 'BANK_TRANSFER', 'PAY_ON_DELIVERY']),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'CONFIRMED',
    'PROCESSING',
    'DISPATCHED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
  note: z.string().optional(),
});

// Inventory Schemas
export const adjustInventorySchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  type: z.enum(['RESTOCK', 'ADJUSTMENT', 'DAMAGE', 'RETURN']),
  quantityChange: z.number().int().refine((n) => n !== 0, 'Quantity change cannot be 0'),
  reason: z.string().min(3, 'Reason for adjustment is required'),
});

// Payment Schemas
export const initializePaystackSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
});

export const verifyTransferSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  bankReference: z.string().min(2, 'Bank transaction reference is required'),
  verifiedNotes: z.string().optional(),
});

// Settings Schemas
export const updateSettingsSchema = z.object({
  storeName: z.string().min(2).optional(),
  tagline: z.string().optional(),
  address: z.string().min(5).optional(),
  openingHours: z.string().optional(),
  phone1: z.string().min(10).optional(),
  phone2: z.string().optional(),
  phone3: z.string().optional(),
  whatsapp: z.string().min(10).optional(),
  email: z.string().email().optional(),
  deliveryLagosKobo: z.number().int().min(0).optional(),
  deliverySouthWestKobo: z.number().int().min(0).optional(),
  deliveryNationwideKobo: z.number().int().min(0).optional(),
  bankName: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  aboutText: z.string().optional(),
  announcementText: z.string().optional(),
});
