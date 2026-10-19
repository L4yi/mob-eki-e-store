const fs = require('fs');
const path = require('path');
const bcrypt = require(path.join(__dirname, '../server/node_modules/bcryptjs'));

const storePath = path.join(__dirname, '../server/data/store.json');
const outputPath = path.join(__dirname, '../supabase/seed_catalog.sql');
const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));

async function buildSql() {
  const hash = await bcrypt.hash('Awenimi90', 10);
  let sql = '-- =========================================================================\n';
  sql += '-- M.O.B EKI VENTURES - Full Catalog & Admin Seed (33 Products, 8 Categories)\n';
  sql += '-- =========================================================================\n\n';

  // 1. Admin Users
  sql += '-- 1. SUPER ADMIN ACCOUNTS\n';
  sql += `INSERT INTO users (id, name, email, phone, password_hash, role) VALUES\n`;
  sql += `('usr-admin-02', 'Oladejo Muhaz', 'muhazoladejo@gmail.com', '08108725967', '${hash}', 'SUPER_ADMIN'),\n`;
  sql += `('usr-admin-03', 'Oladejo Muhaz Olayiwola', 'muhazoladejo48@gmail.com', '08108725967', '${hash}', 'SUPER_ADMIN')\n`;
  sql += `ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'SUPER_ADMIN';\n\n`;

  // 2. Categories
  sql += '-- 2. ALL 8 PRODUCT CATEGORIES\n';
  const catValues = store.categories.map(c => {
    const name = c.name.replace(/'/g, "''");
    const desc = (c.description || '').replace(/'/g, "''");
    return `('${c.id}', '${c.slug}', '${name}', '${c.image}', '${desc}', ${c.displayOrder || 1}, true)`;
  }).join(',\n');
  sql += `INSERT INTO categories (id, slug, name, image, description, display_order, active) VALUES\n${catValues}\n`;
  sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, image = EXCLUDED.image, description = EXCLUDED.description;\n\n`;

  // 3. Products
  sql += '-- 3. ALL 33 REAL STOREFRONT PRODUCTS\n';
  const prodValues = store.products.map(p => {
    const name = p.name.replace(/'/g, "''");
    const catName = (p.categoryName || 'Hardware').replace(/'/g, "''");
    const desc = (p.description || '').replace(/'/g, "''");
    const specsJson = JSON.stringify(p.specs || []).replace(/'/g, "''");
    const imagesJson = JSON.stringify(p.images || []).replace(/'/g, "''");
    return `('${p.id}', '${p.slug}', '${name}', '${p.sku}', '${p.categoryId}', '${catName}', '${p.categorySlug}', '${desc}', ${p.priceKobo}, ${p.wholesalePriceKobo || p.priceKobo}, ${p.wholesaleMinQty || 5}, ${p.wholesaleEnabled !== false}, ${p.retailEnabled !== false}, '${imagesJson}'::jsonb, ${p.stockQuantity || 100}, ${p.reservedQuantity || 0}, ${p.lowStockThreshold || 5}, '${specsJson}'::jsonb, true, ${p.featured ? true : false})`;
  }).join(',\n');
  sql += `INSERT INTO products (id, slug, name, sku, category_id, category_name, category_slug, description, price_kobo, wholesale_price_kobo, wholesale_min_qty, wholesale_enabled, retail_enabled, images, stock_quantity, reserved_quantity, low_stock_threshold, specs, active, featured) VALUES\n${prodValues}\n`;
  sql += `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sku = EXCLUDED.sku, price_kobo = EXCLUDED.price_kobo, wholesale_price_kobo = EXCLUDED.wholesale_price_kobo, images = EXCLUDED.images, specs = EXCLUDED.specs, stock_quantity = EXCLUDED.stock_quantity;\n\n`;

  // 4. Update Business Settings with OPay (No Pay on Delivery)
  sql += '-- 4. BUSINESS SETTINGS (OPay - No Pay on Delivery)\n';
  sql += `UPDATE business_settings SET
    bank_name = 'OPay',
    bank_account_name = 'Olaide Oladejo',
    bank_account_number = '8025262598',
    delivery_lagos_kobo = 200000,
    delivery_south_west_kobo = 350000,
    delivery_nationwide_kobo = 500000
  WHERE id = 'default';\n`;

  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log(`Generated ${outputPath} successfully (${store.products.length} products, ${store.categories.length} categories)!`);
}

buildSql().catch(err => {
  console.error(err);
  process.exit(1);
});
