import {
  Product,
  Category,
  Order,
  InventoryTransaction,
  BusinessSettings,
  TeamMember,
  User,
  OrderStatus,
} from '../types';

const API_BASE = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` : '/api');

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('mob_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // --- Products ---
  async getProducts(params?: { category?: string; search?: string; sort?: string; page?: number; limit?: number }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return Array.isArray(data) ? data : data.products || [];
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create product' }));
      throw new Error(err.error || err.details?.[0]?.message || 'Failed to create product');
    }
    return res.json();
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update product' }));
      throw new Error(err.error || 'Failed to update product');
    }
    return res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async getCategory(idOrSlug: string): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Category not found');
    return res.json();
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create category' }));
      throw new Error(err.error || 'Failed to create category');
    }
    return res.json();
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete category');
  },

  // --- Orders ---
  async createOrder(orderData: any): Promise<Order & { whatsAppUrl?: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to place order' }));
      throw new Error(err.error || err.details?.[0]?.message || 'Failed to place order');
    }
    return res.json();
  },

  async getOrder(idOrToken: string): Promise<Order & { whatsAppUrl?: string }> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(idOrToken)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Order not found' }));
      throw new Error(err.error || 'Order not found');
    }
    return res.json();
  },

  async trackOrder(query: string): Promise<Order & { whatsAppUrl?: string }> {
    return this.getOrder(query);
  },

  async getUserOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user orders');
    const data = await res.json();
    return Array.isArray(data) ? data : data.orders || [];
  },

  async getAdminOrders(params?: { status?: string; paymentStatus?: string; page?: number; limit?: number }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.paymentStatus) query.append('paymentStatus', params.paymentStatus);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin orders');
    const data = await res.json();
    return Array.isArray(data) ? data : data.orders || [];
  },

  async updateOrderStatus(id: string, status: OrderStatus | string, note?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/admin/orders/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update order status' }));
      throw new Error(err.error || 'Failed to update order status');
    }
    return res.json();
  },

  // --- Inventory ---
  async getInventoryTransactions(params?: { productId?: string; type?: string; page?: number; limit?: number }): Promise<InventoryTransaction[]> {
    const query = new URLSearchParams();
    if (params?.productId) query.append('productId', params.productId);
    if (params?.type) query.append('type', params.type);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/admin/inventory?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch inventory transactions');
    const data = await res.json();
    return Array.isArray(data) ? data : data.movements || [];
  },

  async adjustStock(productId: string, quantityChange: number, type: string, reason: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/admin/inventory/adjust`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantityChange, type, reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to adjust stock' }));
      throw new Error(err.error || 'Failed to adjust stock');
    }
    return res.json();
  },

  async getLowStock(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/admin/inventory/low-stock`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch low stock items');
    return res.json();
  },

  // --- Settings ---
  async getSettings(): Promise<{ settings: BusinessSettings; team: TeamMember[] }> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch store settings');
    return res.json();
  },

  async updateSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update store settings');
    return res.json();
  },

  // --- Payments ---
  async getPaymentTransactions(params?: { orderId?: string; status?: string; page?: number; limit?: number }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.orderId) query.append('orderId', params.orderId);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/admin/payments?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch payments');
    const data = await res.json();
    return Array.isArray(data) ? data : data.payments || [];
  },

  async initializePayment(orderId: string): Promise<{ authorizationUrl: string; reference: string; amount: number }> {
    const res = await fetch(`${API_BASE}/payments/initialize`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to initialize payment' }));
      throw new Error(err.error || 'Failed to initialize payment');
    }
    const data = await res.json();
    return {
      authorizationUrl: data.authorizationUrl,
      reference: data.reference,
      amount: data.amountKobo / 100,
    };
  },

  async verifyBankTransfer(orderId: string, bankReference: string, verifiedNotes?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/admin/payments/verify-transfer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId, bankReference, verifiedNotes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to verify transfer' }));
      throw new Error(err.error || 'Failed to verify transfer');
    }
    return res.json();
  },

  // --- Delivery Quote ---
  async getDeliveryQuote(state: string, isWholesale = false, totalQuantity = 1): Promise<{ zone: string; deliveryFee: number }> {
    const res = await fetch(
      `${API_BASE}/delivery/quote?state=${encodeURIComponent(state)}&isWholesale=${isWholesale}&totalQuantity=${totalQuantity}`
    );
    if (!res.ok) throw new Error('Failed to calculate delivery fee');
    const data = await res.json();
    return {
      zone: data.zone,
      deliveryFee: data.deliveryFeeKobo / 100,
    };
  },

  // --- Auth ---
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Invalid email or password' }));
      throw new Error(err.error || 'Invalid email or password');
    }
    return res.json();
  },

  async register(name: string, email: string, phone: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('mob_auth_token');
      if (!token) return null;
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  // --- Admin Dashboard ---
  async getAdminDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },
};
