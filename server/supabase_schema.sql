-- =========================================================================
-- M.O.B EKI VENTURES - Supabase PostgreSQL Database Schema & Migration
-- Showroom: 2, Amu Street, Mushin Market, Lagos, Nigeria
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT 'usr-' || uuid_generate_v4()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CUSTOMER', -- 'CUSTOMER', 'ADMIN', 'SUPER_ADMIN'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT 'prod-' || uuid_generate_v4()::text,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    category_name TEXT DEFAULT 'Hardware',
    category_slug TEXT DEFAULT 'hardware',
    description TEXT DEFAULT '',
    price_kobo BIGINT NOT NULL,
    wholesale_enabled BOOLEAN DEFAULT TRUE,
    retail_enabled BOOLEAN DEFAULT TRUE,
    wholesale_min_qty INTEGER DEFAULT 10,
    wholesale_price_kobo BIGINT,
    images JSONB DEFAULT '[]'::jsonb,
    stock_quantity INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    specs JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY DEFAULT 'ord-' || uuid_generate_v4()::text,
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    idempotency_key TEXT UNIQUE,
    tracking_token TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_state TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT DEFAULT '',
    delivery_zone TEXT NOT NULL, -- 'LAGOS', 'SOUTH_WEST', 'NATIONWIDE', 'PICKUP'
    delivery_zone_id TEXT DEFAULT '',
    subtotal_kobo BIGINT NOT NULL,
    delivery_fee_kobo BIGINT NOT NULL,
    total_kobo BIGINT NOT NULL,
    payment_method TEXT NOT NULL, -- 'PAYSTACK', 'BANK_TRANSFER', 'PAY_ON_DELIVERY'
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    order_status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    tracking_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    reservation_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVENTORY MOVEMENTS TABLE (Double-Entry Stock Ledger)
CREATE TABLE IF NOT EXISTS inventory_movements (
    id TEXT PRIMARY KEY DEFAULT 'mov-' || uuid_generate_v4()::text,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    type TEXT NOT NULL, -- 'RESTOCK', 'SALE', 'ADJUSTMENT', 'RESERVATION_RELEASE'
    quantity_change INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id TEXT,
    performed_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY DEFAULT 'pay-' || uuid_generate_v4()::text,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'PAYSTACK', 'BANK_TRANSFER'
    provider_reference TEXT UNIQUE NOT NULL,
    provider_transaction_id TEXT,
    method TEXT NOT NULL,
    amount_kobo BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'PENDING',
    verification_method TEXT,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT NOT NULL DEFAULT 'M.O.B EKI VENTURES',
    tagline TEXT DEFAULT 'Premium Furniture Accessories & Architectural Hardware',
    address TEXT DEFAULT '2, Amu Street, Mushin Market, Lagos, Nigeria',
    opening_hours TEXT DEFAULT 'Mon - Sat: 8:00 AM - 5:00 PM',
    phone1 TEXT DEFAULT '08108725967',
    phone2 TEXT DEFAULT '08025262598',
    phone3 TEXT DEFAULT '08028077200',
    whatsapp TEXT DEFAULT '2348108725967',
    email TEXT DEFAULT 'muhazoladejo48@gmail.com',
    delivery_lagos_kobo BIGINT DEFAULT 200000,
    delivery_south_west_kobo BIGINT DEFAULT 350000,
    delivery_nationwide_kobo BIGINT DEFAULT 500000,
    bank_name TEXT DEFAULT 'Guaranty Trust Bank (GTBank)',
    bank_account_name TEXT DEFAULT 'M.O.B EKI VENTURES',
    bank_account_number TEXT DEFAULT '0123456789',
    about_text TEXT DEFAULT 'M.O.B EKI VENTURES is a premier hardware dealership located at 2, Amu Street, Mushin Market, Lagos.',
    announcement_text TEXT DEFAULT 'Nationwide delivery available · Retail & wholesale orders welcome',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    bio TEXT,
    image TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY DEFAULT 'aud-' || uuid_generate_v4()::text,
    admin_id TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    before_state JSONB,
    after_state JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR HIGH-SPEED QUERY PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(provider_reference);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_movements(product_id);

-- =========================================================================
-- INITIAL SEED DATA FOR CATEGORIES & SUPER ADMIN
-- =========================================================================

-- Insert Super Admin (Password: adminpassword123)
INSERT INTO users (id, name, email, phone, password_hash, role)
VALUES (
    'usr-admin-01',
    'M.O.B Admin',
    'admin@mobekiventures.com',
    '08108725967',
    '$2b$10$Qt7eGHOVRZRuyL6jmW.HHe.6XmdvqKVjy6cZZEDWOmyOt1uUt20V2',
    'SUPER_ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Insert Categories
INSERT INTO categories (id, slug, name, image, description, display_order, active)
VALUES
('cat-handles', 'handles', 'Handles', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80', 'Modern cabinet bar handles, profile pulls, T-bars, and luxury wardrobe handles.', 1, true),
('cat-knobs', 'knobs', 'Knobs', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&q=80', 'Brass, matte black, crystal, and stainless steel drawer and dresser knobs.', 2, true),
('cat-hinges', 'hinges', 'Hinges', 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop&q=80', 'Hydraulic soft-close cabinet hinges, concealed 3D hinges, and heavy-duty pivot hinges.', 3, true),
('cat-locks', 'locks', 'Locks', 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80', 'Drawer locks, wardrobe cam locks, digital keypad locks, and central locking bars.', 4, true),
('cat-fittings', 'furniture-fittings', 'Furniture Fittings', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop&q=80', 'Heavy-duty ball bearing slides, push-to-open latches, and gas springs.', 5, true),
('cat-accessories', 'other-accessories', 'Other Accessories', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop&q=80', 'Shelf brackets, cable grommets, corner braces, and installation hardware.', 6, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Default Business Settings
INSERT INTO business_settings (id, store_name, tagline, address, opening_hours, phone1, phone2, phone3, whatsapp, email, delivery_lagos_kobo, delivery_south_west_kobo, delivery_nationwide_kobo, bank_name, bank_account_name, bank_account_number)
VALUES (
    'default',
    'M.O.B EKI VENTURES',
    'Premium Furniture Accessories & Architectural Hardware',
    '2, Amu Street, Mushin Market, Lagos, Nigeria',
    'Mon - Sat: 8:00 AM - 5:00 PM',
    '08108725967',
    '08025262598',
    '08028077200',
    '2348108725967',
    'muhazoladejo48@gmail.com',
    200000,
    350000,
    500000,
    'Guaranty Trust Bank (GTBank)',
    'M.O.B EKI VENTURES',
    '0123456789'
) ON CONFLICT (id) DO NOTHING;

-- Insert Team Members
INSERT INTO team_members (id, name, position, bio, image, display_order, active)
VALUES
('team-1', 'Mulikat & Mutiu Oladejo', 'Founders & Directors', 'Visionary founders behind M.O.B EKI VENTURES, establishing over three decades of trust in Nigerian hardware trade.', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&h=600&fit=crop&q=80', 1, true),
('team-2', 'Oladejo Muhaz Olayiwola', 'General Manager', 'Oversees operational leadership, supply chain logistics, wholesale partnerships, and direct customer satisfaction.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&q=80', 2, true)
ON CONFLICT (id) DO NOTHING;
