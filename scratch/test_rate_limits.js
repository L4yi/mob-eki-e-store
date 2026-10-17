import http from 'http';
import { app } from '../server/src/app.js';
import { JsonStore } from '../server/src/repositories/json/JsonStore.js';

async function runRateLimitingTests() {
  console.log('======================================================');
  console.log('🛡️ M.O.B EKI VENTURES — RATE LIMITING & ABUSE TEST SUITE');
  console.log('======================================================\n');

  // Initialize store
  const store = JsonStore.getInstance();
  await store.init();

  // Start test server on port 5055
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5055, resolve));
  const BASE_URL = 'http://127.0.0.1:5055/api';
  console.log('🚀 Test server active at', BASE_URL);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Global Health & Product Browsing Baseline
    // -------------------------------------------------------------
    console.log('\n--- 1. Baseline API & Product Browsing ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    assert(healthRes.status === 200, 'GET /api/health returns 200 OK');

    const productsRes = await fetch(`${BASE_URL}/products`);
    assert(productsRes.status === 200, 'GET /api/products returns 200 OK');
    const products = await productsRes.json();
    assert(Array.isArray(products) && products.length > 0, `Catalog returns ${products.length} active products`);

    // -------------------------------------------------------------
    // Test 2: Login Rate Limiter (5 failed attempts per 15 min)
    // -------------------------------------------------------------
    console.log('\n--- 2. Login Rate Limiting (5 failed attempts / 15m) ---');
    const testEmail = `brute_force_test_${Date.now()}@example.com`;
    let got429OnLogin = false;
    let loginRetryAfter = null;
    let loginErrorBody = null;

    for (let i = 1; i <= 7; i++) {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'wrongpassword' }),
      });

      if (res.status === 429) {
        got429OnLogin = true;
        loginRetryAfter = res.headers.get('retry-after');
        loginErrorBody = await res.json();
        console.log(`    -> Attempt ${i}: Received 429 Too Many Requests (Retry-After: ${loginRetryAfter}s)`);
        break;
      } else {
        console.log(`    -> Attempt ${i}: Status ${res.status}`);
      }
    }

    assert(got429OnLogin, 'Repeated failed login attempts trigger 429 Too Many Requests');
    assert(Boolean(loginRetryAfter), `Retry-After header present on 429 login response (${loginRetryAfter}s)`);
    assert(loginErrorBody?.error === 'Too many requests', 'Clean error response returned on 429');

    // -------------------------------------------------------------
    // Test 3: Successful Authentication Does NOT Block Valid Users
    // -------------------------------------------------------------
    console.log('\n--- 3. Successful Admin Authentication & RBAC ---');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'muhazoladejo@gmail.com', password: 'Awenimi90' }),
    });

    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && Boolean(adminLoginData.token), 'Super Admin login succeeds and issues JWT');
    const adminToken = adminLoginData.token;

    // -------------------------------------------------------------
    // Test 4: Idempotency Protection on Order Creation
    // -------------------------------------------------------------
    console.log('\n--- 4. Order Creation Idempotency & Abuse Protection ---');
    const idempotencyKey = `test-idem-${Date.now()}`;
    const orderPayload = {
      customerName: 'Adebayo Test',
      customerEmail: 'adebayo.test@example.com',
      customerPhone: '08108725967',
      deliveryZone: 'LAGOS',
      deliveryState: 'Lagos',
      deliveryCity: 'Ikeja',
      deliveryAddress: '15 Commercial Avenue',
      paymentMethod: 'BANK_TRANSFER',
      items: [{ productId: products[0].id, quantity: 1 }],
    };

    const firstOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(orderPayload),
    });

    const firstOrder = await firstOrderRes.json();
    assert(firstOrderRes.status === 201 && Boolean(firstOrder.orderNumber), `Order placed successfully: ${firstOrder.orderNumber}`);

    // Replay with exact same idempotency key
    const replayOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(orderPayload),
    });

    const replayOrder = await replayOrderRes.json();
    assert(replayOrder.orderNumber === firstOrder.orderNumber, 'Idempotency key prevents duplicate order on double-click/replay');

    // -------------------------------------------------------------
    // Test 5: Order Creation Rate Limiter (10 orders per 10 min)
    // -------------------------------------------------------------
    console.log('\n--- 5. Order Creation Rate Limiter (10 orders / 10 min) ---');
    let got429OnOrders = false;
    let orderRetryAfter = null;

    for (let i = 1; i <= 12; i++) {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `batch-order-${Date.now()}-${i}`,
        },
        body: JSON.stringify({
          ...orderPayload,
          customerEmail: `order_${i}_${Date.now()}@example.com`,
        }),
      });

      if (res.status === 429) {
        got429OnOrders = true;
        orderRetryAfter = res.headers.get('retry-after');
        console.log(`    -> Order attempt ${i}: 429 Too Many Requests (Retry-After: ${orderRetryAfter}s)`);
        break;
      }
    }

    assert(got429OnOrders, 'Excessive order submissions trigger 429 Too Many Requests');
    assert(Boolean(orderRetryAfter), `Retry-After header present on order rate limit (${orderRetryAfter}s)`);

    // -------------------------------------------------------------
    // Test 6: Order Tracking Rate Limiter (20 lookups per 10 min)
    // -------------------------------------------------------------
    console.log('\n--- 6. Tracking Rate Limiter (20 lookups / 10 min) ---');
    let got429OnTracking = false;
    let trackingRetryAfter = null;

    for (let i = 1; i <= 25; i++) {
      const res = await fetch(`${BASE_URL}/orders/${firstOrder.orderNumber}`);
      if (res.status === 429) {
        got429OnTracking = true;
        trackingRetryAfter = res.headers.get('retry-after');
        console.log(`    -> Tracking lookup ${i}: 429 Too Many Requests (Retry-After: ${trackingRetryAfter}s)`);
        break;
      }
    }

    assert(got429OnTracking, 'Excessive tracking lookups trigger 429 Too Many Requests');
    assert(Boolean(trackingRetryAfter), `Retry-After header present on tracking limit (${trackingRetryAfter}s)`);

    // -------------------------------------------------------------
    // Test 7: Admin RBAC & Unauthorized Access Protection
    // -------------------------------------------------------------
    console.log('\n--- 7. Admin Security & Role Authorization ---');
    const unauthUploadRes = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: 'test.jpg', fileData: 'data:image/jpeg;base64,123' }),
    });
    assert(unauthUploadRes.status === 401, 'Unauthenticated admin upload is blocked with 401 Unauthorized');

    const authSettingsRes = await fetch(`${BASE_URL}/settings`);
    assert(authSettingsRes.status === 200, 'Public settings query returns 200 OK');

  } catch (err) {
    console.error('Test run exception:', err);
    failed++;
  } finally {
    server.close();
    console.log('\n======================================================');
    console.log(`🎯 RATE LIMITING TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('======================================================\n');
  }
}

runRateLimitingTests();
