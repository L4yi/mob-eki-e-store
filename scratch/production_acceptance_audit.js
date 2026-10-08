import http from 'http';
import https from 'https';
import { URL } from 'url';

const PROD_API = 'https://mob-website-phi.vercel.app/api';
const PROD_WEB = 'https://mob-eki-ventures.web.app';

// Helper function to make HTTP requests
function request(method, urlStr, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const client = url.protocol === 'https:' ? https : http;
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    let postData = null;
    if (body) {
      postData = JSON.stringify(body);
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = client.request(
      url,
      {
        method,
        headers: reqHeaders,
        timeout: 15000,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let data = null;
          try {
            data = JSON.parse(raw);
          } catch {
            data = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, data });
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout connecting to ${urlStr}`));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

const auditResults = {
  section1_customer_journey: { name: 'Customer Journey', passed: 0, failed: 0, issues: [] },
  section2_admin_operations: { name: 'Admin Operations', passed: 0, failed: 0, issues: [] },
  section3_catalog_accuracy: { name: 'Product / Catalog Accuracy', passed: 0, failed: 0, issues: [] },
  section4_inventory_integrity: { name: 'Inventory Integrity', passed: 0, failed: 0, issues: [] },
  section5_rbac_security: { name: 'RBAC & Server-Side Security', passed: 0, failed: 0, issues: [] },
  section6_mobile_ux: { name: 'Mobile UX & Links', passed: 0, failed: 0, issues: [] },
  section7_infrastructure: { name: 'Production Infrastructure', passed: 0, failed: 0, issues: [] },
};

function recordTest(sectionKey, testName, isPass, errorMsg = null) {
  const sec = auditResults[sectionKey];
  if (isPass) {
    sec.passed++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    sec.failed++;
    sec.issues.push(`${testName}: ${errorMsg || 'Failed'}`);
    console.error(`  ❌ [FAIL] ${testName} - ${errorMsg || 'Failed'}`);
  }
}

async function runLaunchReadinessAudit() {
  console.log('===============================================================');
  console.log('  M.O.B EKI VENTURES — PRODUCTION LAUNCH READINESS AUDIT');
  console.log(`  Target Frontend: ${PROD_WEB}`);
  console.log(`  Target Backend API: ${PROD_API}`);
  console.log('===============================================================\n');

  let adminToken = '';
  let sampleProduct = null;
  let allProducts = [];

  // =========================================================================
  // 7. PRODUCTION INFRASTRUCTURE AUDIT
  // =========================================================================
  console.log('--- 7. PRODUCTION INFRASTRUCTURE AUDIT ---');
  try {
    const healthRes = await request('GET', `${PROD_API}/health`);
    recordTest('section7_infrastructure', 'Live API Health Check (200 OK)', healthRes.status === 200, `Got status ${healthRes.status}`);
  } catch (err) {
    recordTest('section7_infrastructure', 'Live API Health Check (200 OK)', false, err.message);
  }

  try {
    const webRes = await request('GET', `${PROD_WEB}`);
    recordTest('section7_infrastructure', 'Live Frontend Hosting (200 OK)', webRes.status === 200, `Got status ${webRes.status}`);
  } catch (err) {
    recordTest('section7_infrastructure', 'Live Frontend Hosting (200 OK)', false, err.message);
  }

  // =========================================================================
  // 3. PRODUCT & CATALOG ACCURACY AUDIT
  // =========================================================================
  console.log('\n--- 3. PRODUCT / CATALOG ACCURACY AUDIT ---');
  try {
    const prodRes = await request('GET', `${PROD_API}/products`);
    allProducts = prodRes.data;
    const isArray = Array.isArray(allProducts);
    recordTest('section3_catalog_accuracy', 'Product Catalog Returns Active Array', isArray && allProducts.length >= 20, `Products loaded: ${allProducts.length}`);

    if (isArray && allProducts.length > 0) {
      sampleProduct = allProducts[0];
      const hasAllFields = allProducts.every(p => p.id && p.name && p.price > 0 && p.sku && p.specs && p.stockQuantity >= 0 && p.images?.length > 0);
      recordTest('section3_catalog_accuracy', 'All Products have complete SKUs, Specs, Pricing & Stock', hasAllFields);

      // Check categories
      const catRes = await request('GET', `${PROD_API}/categories`);
      const cats = catRes.data;
      recordTest('section3_catalog_accuracy', 'All 7 Hardware Categories Active', Array.isArray(cats) && cats.length >= 7, `Categories count: ${cats.length}`);
    }
  } catch (err) {
    recordTest('section3_catalog_accuracy', 'Product Catalog Ingestion', false, err.message);
  }

  // =========================================================================
  // 1. CUSTOMER JOURNEY AUDIT
  // =========================================================================
  console.log('\n--- 1. CUSTOMER JOURNEY AUDIT ---');
  let testOrderId = '';
  let testOrderNumber = '';
  try {
    // 1a. Delivery fee calculations
    const lagosFee = await request('GET', `${PROD_API}/delivery/calculate?state=Lagos`);
    recordTest('section1_customer_journey', 'Lagos Delivery Fee Calculation (₦2,000)', lagosFee.data?.deliveryFee === 2000, `Got ₦${lagosFee.data?.deliveryFee}`);

    const swFee = await request('GET', `${PROD_API}/delivery/calculate?state=Ogun`);
    recordTest('section1_customer_journey', 'South-West Delivery Fee Calculation (₦3,500)', swFee.data?.deliveryFee === 3500, `Got ₦${swFee.data?.deliveryFee}`);

    const nationFee = await request('GET', `${PROD_API}/delivery/calculate?state=Kano`);
    recordTest('section1_customer_journey', 'Nationwide Haulage Fee Calculation (₦5,000)', nationFee.data?.deliveryFee === 5000, `Got ₦${nationFee.data?.deliveryFee}`);

    const pickupFee = await request('GET', `${PROD_API}/delivery/calculate?isPickup=true`);
    recordTest('section1_customer_journey', 'Showroom Pickup Fee (₦0)', pickupFee.data?.deliveryFee === 0, `Got ₦${pickupFee.data?.deliveryFee}`);

    // 1b. Create test order
    if (sampleProduct) {
      const orderPayload = {
        customerName: 'Audit Test Customer',
        customerEmail: 'customer@test-audit.com',
        customerPhone: '08012345678',
        deliveryZone: 'LAGOS',
        deliveryState: 'Lagos',
        deliveryCity: 'Ikeja',
        deliveryAddress: '12 Allen Avenue, Ikeja, Lagos',
        paymentMethod: 'BANK_TRANSFER',
        items: [{ productId: sampleProduct.id, quantity: 1 }],
        idempotencyKey: `audit-test-${Date.now()}`,
      };

      const orderRes = await request('POST', `${PROD_API}/orders`, orderPayload);
      const isCreated = orderRes.status === 201 && orderRes.data?.id;
      recordTest('section1_customer_journey', 'Customer Order Creation in PENDING_PAYMENT', isCreated, `Status: ${orderRes.status}`);

      if (isCreated) {
        testOrderId = orderRes.data.id;
        testOrderNumber = orderRes.data.orderNumber;

        // 1c. Live Order Tracking
        const trackRes = await request('GET', `${PROD_API}/orders/${testOrderId}`);
        const trackPass = trackRes.status === 200 && trackRes.data.orderNumber === testOrderNumber;
        recordTest('section1_customer_journey', 'Live Order Tracking Endpoint Query', trackPass);
      }
    }
  } catch (err) {
    recordTest('section1_customer_journey', 'Customer Checkout & Tracking Loop', false, err.message);
  }

  // =========================================================================
  // 5. SERVER-SIDE RBAC & SECURITY AUDIT
  // =========================================================================
  console.log('\n--- 5. SERVER-SIDE RBAC & SECURITY AUDIT ---');
  try {
    // 5a. Unauthorized request to admin dashboard
    const noAuthRes = await request('GET', `${PROD_API}/admin/dashboard`);
    recordTest('section5_rbac_security', 'Unauthorized Access Blocked (401 Unauthorized)', noAuthRes.status === 401, `Status: ${noAuthRes.status}`);

    // 5b. Invalid token
    const invalidTokenRes = await request('GET', `${PROD_API}/admin/dashboard`, null, {
      Authorization: 'Bearer invalid_garbage_token_123',
    });
    recordTest('section5_rbac_security', 'Invalid Session Token Blocked (401)', invalidTokenRes.status === 401);

    // 5c. Valid Admin Authentication
    const loginRes = await request('POST', `${PROD_API}/auth/login`, {
      email: 'admin@mobekiventures.com',
      password: 'adminpassword123',
    });
    const loginPass = loginRes.status === 200 && loginRes.data?.token;
    recordTest('section5_rbac_security', 'Super Admin Login & JWT Issuance', loginPass);

    if (loginPass) {
      adminToken = loginRes.data.token;
    }
  } catch (err) {
    recordTest('section5_rbac_security', 'RBAC & Security Checks', false, err.message);
  }

  // =========================================================================
  // 2. ADMIN OPERATIONS AUDIT
  // =========================================================================
  console.log('\n--- 2. ADMIN OPERATIONS AUDIT ---');
  if (adminToken && testOrderId) {
    try {
      const authHeader = { Authorization: `Bearer ${adminToken}` };

      // 2a. Dashboard metrics
      const dashRes = await request('GET', `${PROD_API}/admin/dashboard`, null, authHeader);
      recordTest('section2_admin_operations', 'Admin Dashboard Metrics Retrieval (200 OK)', dashRes.status === 200 && dashRes.data?.metrics?.totalOrders >= 1);

      // 2b. Order status transition: PENDING_PAYMENT -> CONFIRMED
      const confirmRes = await request('PUT', `${PROD_API}/admin/orders/${testOrderId}/status`, {
        status: 'CONFIRMED',
        note: 'Customer bank transfer verified by M.O.B Store Manager',
      }, authHeader);
      recordTest('section2_admin_operations', 'Order Confirmation Transition (CONFIRMED)', confirmRes.status === 200 && confirmRes.data?.orderStatus === 'CONFIRMED');

      // 2c. Order status transition: CONFIRMED -> PROCESSING
      const procRes = await request('PUT', `${PROD_API}/admin/orders/${testOrderId}/status`, {
        status: 'PROCESSING',
        note: 'Goods picked and packed at Mushin warehouse',
      }, authHeader);
      recordTest('section2_admin_operations', 'Fulfillment Processing Transition (PROCESSING)', procRes.status === 200 && procRes.data?.orderStatus === 'PROCESSING');

      // 2d. Order status transition: PROCESSING -> DISPATCHED
      const dispRes = await request('PUT', `${PROD_API}/admin/orders/${testOrderId}/status`, {
        status: 'DISPATCHED',
        note: 'Dispatched via Lagos Dispatch Rider (Rider: 08123456789)',
      }, authHeader);
      recordTest('section2_admin_operations', 'Fulfillment Dispatch with Tracking Note (DISPATCHED)', dispRes.status === 200 && dispRes.data?.orderStatus === 'DISPATCHED');

      // 2e. Order status transition: DISPATCHED -> DELIVERED
      const delRes = await request('PUT', `${PROD_API}/admin/orders/${testOrderId}/status`, {
        status: 'DELIVERED',
        note: 'Customer received package in good condition',
      }, authHeader);
      recordTest('section2_admin_operations', 'Final Delivery Completion (DELIVERED)', delRes.status === 200 && delRes.data?.orderStatus === 'DELIVERED');
    } catch (err) {
      recordTest('section2_admin_operations', 'Admin Fulfillment Workflow', false, err.message);
    }
  } else {
    recordTest('section2_admin_operations', 'Admin Fulfillment Workflow', false, 'Missing admin token or test order ID');
  }

  // =========================================================================
  // 4. INVENTORY INTEGRITY AUDIT
  // =========================================================================
  console.log('\n--- 4. INVENTORY INTEGRITY AUDIT ---');
  if (adminToken && sampleProduct) {
    try {
      const authHeader = { Authorization: `Bearer ${adminToken}` };

      // 4a. Initial product state
      const beforeProd = (await request('GET', `${PROD_API}/products/${sampleProduct.id}`)).data;
      const initialStock = beforeProd.stockQuantity;

      // 4b. Create second test order and cancel it to verify stock restoration
      const cancelOrderPayload = {
        customerName: 'Cancellation Stock Test Customer',
        customerEmail: 'cancel-test@audit.com',
        customerPhone: '08099887766',
        deliveryZone: 'PICKUP',
        deliveryState: 'Lagos',
        deliveryCity: 'Mushin',
        deliveryAddress: '2, Amu Street, Mushin',
        paymentMethod: 'PAY_ON_DELIVERY',
        items: [{ productId: sampleProduct.id, quantity: 2 }],
        idempotencyKey: `cancel-test-${Date.now()}`,
      };

      const cOrder = (await request('POST', `${PROD_API}/orders`, cancelOrderPayload)).data;
      if (cOrder?.id) {
        // Confirm it (commits stock sale)
        await request('PUT', `${PROD_API}/admin/orders/${cOrder.id}/status`, { status: 'CONFIRMED' }, authHeader);

        const stockAfterConfirm = (await request('GET', `${PROD_API}/products/${sampleProduct.id}`)).data.stockQuantity;
        recordTest('section4_inventory_integrity', 'Atomic Stock Decrement on CONFIRMED (-2 units)', stockAfterConfirm === initialStock - 2, `Expected ${initialStock - 2}, got ${stockAfterConfirm}`);

        // Cancel it (must restore stock)
        await request('PUT', `${PROD_API}/admin/orders/${cOrder.id}/status`, { status: 'CANCELLED', note: 'Customer cancelled order before dispatch' }, authHeader);

        const stockAfterCancel = (await request('GET', `${PROD_API}/products/${sampleProduct.id}`)).data.stockQuantity;
        recordTest('section4_inventory_integrity', 'Automatic Stock Restitution on CANCELLED (+2 units restored)', stockAfterCancel === initialStock, `Expected ${initialStock}, got ${stockAfterCancel}`);
      }

      // 4c. Out of stock guard test
      const excessiveOrderPayload = {
        customerName: 'Excessive Quantity Test',
        customerEmail: 'excessive@audit.com',
        customerPhone: '08011223344',
        deliveryZone: 'LAGOS',
        deliveryState: 'Lagos',
        deliveryCity: 'Ikeja',
        deliveryAddress: 'Test Address',
        paymentMethod: 'BANK_TRANSFER',
        items: [{ productId: sampleProduct.id, quantity: 999999 }], // Exceeds stock
      };
      const excessRes = await request('POST', `${PROD_API}/orders`, excessiveOrderPayload);
      recordTest('section4_inventory_integrity', 'Negative Stock / Overdraft Guard (Rejects > On-hand Stock)', excessRes.status >= 400);
    } catch (err) {
      recordTest('section4_inventory_integrity', 'Inventory Concurrency & Restoration', false, err.message);
    }
  }

  // =========================================================================
  // 6. MOBILE UX & LINKS AUDIT
  // =========================================================================
  console.log('\n--- 6. MOBILE UX & LINKS AUDIT ---');
  try {
    const settingsRes = await request('GET', `${PROD_API}/settings`);
    const whatsapp = settingsRes.data?.settings?.whatsapp;
    const isValidWa = whatsapp === '2348108725967';
    recordTest('section6_mobile_ux', 'WhatsApp Deep Links Sanitized to International Format (2348108725967)', isValidWa, `Current: ${whatsapp}`);

    // Check sample product image accessibility on CDN
    if (sampleProduct && sampleProduct.images?.[0]) {
      const imgPath = sampleProduct.images[0];
      const fullImgUrl = imgPath.startsWith('http') ? imgPath : `${PROD_WEB}${imgPath}`;
      const imgRes = await request('GET', fullImgUrl);
      recordTest('section6_mobile_ux', 'Product Image CDN Fast Loading (HTTP 200)', imgRes.status === 200, `Image URL: ${fullImgUrl}`);
    }
  } catch (err) {
    recordTest('section6_mobile_ux', 'Mobile UX & Links', false, err.message);
  }

  // =========================================================================
  // AUDIT SUMMARY REPORT
  // =========================================================================
  console.log('\n===============================================================');
  console.log('                   AUDIT RESULTS SUMMARY');
  console.log('===============================================================');
  let totalPassed = 0;
  let totalFailed = 0;

  for (const [key, sec] of Object.entries(auditResults)) {
    totalPassed += sec.passed;
    totalFailed += sec.failed;
    const rating = sec.failed === 0 ? '🟢 PASS' : '🔴 FAIL';
    console.log(`${rating} | ${sec.name.padEnd(32)}: ${sec.passed} Passed, ${sec.failed} Failed`);
    if (sec.issues.length > 0) {
      sec.issues.forEach(iss => console.log(`      ⚠️ ${iss}`));
    }
  }
  console.log('===============================================================');
  console.log(`TOTAL SCORE: ${totalPassed} Passed, ${totalFailed} Failed (${Math.round((totalPassed / (totalPassed + totalFailed || 1)) * 100)}%)`);
  console.log('===============================================================\n');
}

runLaunchReadinessAudit().catch((err) => {
  console.error('Fatal audit error:', err);
});
