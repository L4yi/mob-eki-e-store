import { Router } from 'express';
import { paymentService } from '../services/PaymentService';
import { validate } from '../middleware/validateAndErrors';
import { initializePaystackSchema } from '../validation/schemas';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// POST /api/payments/paystack/initialize (Public / Customer)
router.post('/paystack/initialize', optionalAuth, validate(initializePaystackSchema), async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const result = await paymentService.initializePaystack(orderId);
    return res.json({
      authorizationUrl: result.authorizationUrl,
      reference: result.reference,
      amount: result.amountKobo / 100,
      amountKobo: result.amountKobo,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/paystack/webhook (Paystack Server-to-Server HMAC Verified)
router.post('/paystack/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;
    if (!signature) {
      return res.status(400).json({ error: 'Missing Paystack signature' });
    }

    const rawBody = JSON.stringify(req.body);
    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);

    if (!isValid && process.env.NODE_ENV === 'production') {
      console.warn('[Paystack Webhook] Invalid HMAC signature detected');
      return res.status(401).json({ error: 'Invalid HMAC signature' });
    }

    const handled = await paymentService.handlePaystackWebhook(req.body);
    return res.status(200).json({ status: 'ok', processed: handled });
  } catch (err) {
    console.error('[Paystack Webhook Handler Error]', err);
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

// GET /api/payments/:reference (Lookup by Reference)
router.get('/:reference', async (req, res, next) => {
  try {
    const payments = await paymentService.getPayments();
    const match = payments.payments.find(
      (p) =>
        p.providerReference?.toLowerCase() === req.params.reference.toLowerCase() ||
        p.id === req.params.reference
    );
    if (!match) return res.status(404).json({ error: 'Payment record not found' });
    return res.json({
      ...match,
      amount: match.amountKobo / 100,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
