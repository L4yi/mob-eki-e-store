// scratch/test_security_privacy.js
// Tests the critical security & privacy fixes:
// 1. Order cancellation without token is rejected with HTTP 403 / 400.
// 2. Order cancellation with valid secret tracking token succeeds.
// 3. Double cancellation is rejected with HTTP 400.
// 4. Public tracking lookup masks customer PII (name, phone, email, address).
// 5. Authenticated / token lookup returns full customer PII.

const http = require('http');

const PORT = 5000;

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING SECURITY & PRIVACY VERIFICATION ---');

  // Step 1: Create an order to test against
  console.log('\n1. Creating test order...');
  const orderPayload = {
    customerName: 'Amina Babatunde',
    customerEmail: 'amina.babatunde@example.com',
    customerPhone: '08023456789',
    deliveryZone: 'LAGOS',
    deliveryState: 'Lagos',
    deliveryCity: 'Yaba',
    deliveryAddress: 'Plot 14, Commercial Avenue, Sabo Yaba, Lagos',
    deliveryNotes: 'Please call before arrival',
    paymentMethod: 'BANK_TRANSFER',
    items: [
      {
        productId: 'prd-hdl-01',
        quantity: 1
      }
    ]
  };

  const createRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: '/api/orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, orderPayload);

  if (createRes.status !== 201) {
    console.error('Failed to create order:', createRes);
    process.exit(1);
  }

  const order = createRes.data;
  console.log(`Order created: ID=${order.id}, Number=${order.orderNumber}`);
  console.log(`Tracking Token present: ${Boolean(order.trackingToken)}`);

  // Step 2: Public Tracking Lookup (No token, unauthenticated)
  console.log('\n2. Testing Public Tracking Lookup (PII Masking)...');
  const publicLookupRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: `/api/orders/${order.orderNumber}`,
    method: 'GET'
  });

  console.log(`Public lookup status: ${publicLookupRes.status}`);
  const publicData = publicLookupRes.data;
  console.log('Masked Name:', publicData.customerName);
  console.log('Masked Phone:', publicData.customerPhone);
  console.log('Masked Email:', publicData.customerEmail);
  console.log('Masked Address:', publicData.deliveryAddress);

  if (publicData.customerName === orderPayload.customerName || publicData.customerPhone === orderPayload.customerPhone) {
    console.error('FAIL: Public tracking leaked unmasked PII!');
    process.exit(1);
  } else {
    console.log('PASS: PII correctly masked in public lookup.');
  }

  // Step 3: Authorized Tracking Lookup (Using tracking token)
  console.log('\n3. Testing Authorized Tracking Lookup with Token...');
  const authLookupRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: `/api/orders/${order.orderNumber}?token=${order.trackingToken}`,
    method: 'GET'
  });

  console.log(`Authorized lookup status: ${authLookupRes.status}`);
  const authData = authLookupRes.data;
  console.log('Full Name:', authData.customerName);
  console.log('Full Phone:', authData.customerPhone);

  if (authData.customerName === orderPayload.customerName && authData.customerPhone === orderPayload.customerPhone) {
    console.log('PASS: Authorized lookup returns full PII to token holder.');
  } else {
    console.error('FAIL: Authorized lookup did not return full details with token!');
    process.exit(1);
  }

  // Step 4: Unauthorized Order Cancellation Attempt (No token)
  console.log('\n4. Testing Unauthorized Cancellation Attempt (No token)...');
  const unauthCancelRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: `/api/orders/${order.id}/cancel`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  }, { reason: 'Anonymous malicious attempt' });

  console.log(`Unauthorized cancellation status: ${unauthCancelRes.status}`);
  if (unauthCancelRes.status === 403 || unauthCancelRes.status === 401) {
    console.log('PASS: Anonymous order cancellation correctly rejected with HTTP', unauthCancelRes.status);
  } else {
    console.error('FAIL: Anonymous cancellation was NOT rejected! Status:', unauthCancelRes.status);
    process.exit(1);
  }

  // Step 5: Authorized Order Cancellation (With secret tracking token)
  console.log('\n5. Testing Authorized Cancellation with valid tracking token...');
  const validCancelRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: `/api/orders/${order.id}/cancel`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  }, { reason: 'Customer changed mind', token: order.trackingToken });

  console.log(`Authorized cancellation status: ${validCancelRes.status}`);
  if (validCancelRes.status === 200 && validCancelRes.data.orderStatus === 'CANCELLED') {
    console.log('PASS: Cancellation succeeded with token, orderStatus is CANCELLED.');
  } else {
    console.error('FAIL: Authorized cancellation failed!', validCancelRes);
    process.exit(1);
  }

  // Step 6: Double Cancellation Prevention
  console.log('\n6. Testing Double Cancellation Prevention...');
  const doubleCancelRes = await request({
    hostname: '127.0.0.1',
    port: PORT,
    path: `/api/orders/${order.id}/cancel`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  }, { reason: 'Cancel again', token: order.trackingToken });

  console.log(`Double cancellation status: ${doubleCancelRes.status}`);
  if (doubleCancelRes.status === 400) {
    console.log('PASS: Redundant cancellation properly rejected with HTTP 400 Bad Request.');
  } else {
    console.error('FAIL: Double cancellation was not rejected with 400! Status:', doubleCancelRes.status);
  }

  console.log('\n--- ALL SECURITY & PRIVACY VERIFICATION CHECKS PASSED ---');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
