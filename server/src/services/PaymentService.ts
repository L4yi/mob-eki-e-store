import { repositories } from '../repositories';
import { Payment, PaymentStatus, Order } from '../types';
import { inventoryService } from './InventoryService';
import crypto from 'crypto';

export class PaymentService {
  private paymentRepo = repositories.paymentRepo;
  private orderRepo = repositories.orderRepo;

  public async initializePaystack(orderId: string): Promise<{
    authorizationUrl: string;
    reference: string;
    amountKobo: number;
  }> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');

    if (order.orderStatus !== 'PENDING_PAYMENT') {
      throw new Error(`Cannot initialize payment for order in state "${order.orderStatus}"`);
    }

    const reference = `PAY-${order.orderNumber}-${Date.now()}`;
    const amountKobo = order.totalKobo;

    // Check if live Paystack key is present
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    let authorizationUrl = `https://checkout.paystack.com/test-${reference}`;

    if (paystackSecret && !paystackSecret.includes('placeholder')) {
      try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${paystackSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: order.customerEmail,
            amount: amountKobo, // Paystack requires amount in Kobo
            reference,
            callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/success?orderNumber=${order.orderNumber}&ref=${reference}`,
            metadata: {
              orderId: order.id,
              orderNumber: order.orderNumber,
              customerPhone: order.customerPhone,
            },
          }),
        });

        const data = (await response.json()) as any;
        if (data && data.status && data.data?.authorization_url) {
          authorizationUrl = data.data.authorization_url;
        }
      } catch (err) {
        console.error('[Paystack] API initialize error, falling back to reference:', err);
      }
    }

    // Record Payment in database
    const paymentRecord: Payment = {
      id: `pay-${crypto.randomUUID()}`,
      orderId: order.id,
      provider: 'PAYSTACK',
      providerReference: reference,
      method: 'PAYSTACK',
      amountKobo,
      currency: 'NGN',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.paymentRepo.create(paymentRecord);

    return {
      authorizationUrl,
      reference,
      amountKobo,
    };
  }

  public verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY || 'mob_eki_paystack_secret';
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    return hash === signature;
  }

  public async handlePaystackWebhook(event: {
    event: string;
    data: {
      reference: string;
      amount: number;
      currency: string;
      status: string;
      id?: number;
    };
  }): Promise<boolean> {
    if (event.event !== 'charge.success') {
      return true; // Acknowledge other events safely
    }

    const { reference, amount, status } = event.data;
    if (status !== 'success') return true;

    const payment = await this.paymentRepo.findByReference(reference);
    if (!payment) {
      console.warn(`[Payment Webhook] Payment with reference ${reference} not found`);
      return false;
    }

    // Webhook Idempotency: if already paid, do nothing
    if (payment.status === 'PAID') {
      return true;
    }

    const order = await this.orderRepo.findById(payment.orderId);
    if (!order) return false;

    // Verify amount matches
    if (payment.amountKobo !== amount) {
      console.error(
        `[Payment Webhook] Mismatched amount. Expected ${payment.amountKobo}, got ${amount}`
      );
      await this.paymentRepo.update(payment.id, { status: 'FAILED' });
      return false;
    }

    // Atomic Fulfillment
    await this.paymentRepo.update(payment.id, {
      status: 'PAID',
      paidAt: new Date().toISOString(),
      providerTransactionId: String(event.data.id || ''),
    });

    await this.orderRepo.update(order.id, {
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      trackingNotes: [
        ...order.trackingNotes,
        {
          timestamp: new Date().toISOString(),
          status: 'CONFIRMED',
          note: `Payment verified via Paystack (Ref: ${reference})`,
        },
      ],
    });

    // Commit stock from reserved -> sale
    await inventoryService.commitOrderSale(order.items, order.id, order.orderNumber);

    return true;
  }

  public async verifyBankTransferManual(params: {
    orderId: string;
    bankReference: string;
    adminId: string;
    adminEmail: string;
    notes?: string;
  }): Promise<Order | null> {
    const order = await this.orderRepo.findById(params.orderId);
    if (!order) throw new Error('Order not found');

    if (order.paymentStatus === 'PAID') {
      return order; // Already paid
    }

    // Record or update payment
    let payment = await this.paymentRepo.findByOrderId(order.id);
    if (payment) {
      await this.paymentRepo.update(payment.id, {
        status: 'PAID',
        paidAt: new Date().toISOString(),
        providerReference: params.bankReference,
        verificationMethod: 'MANUAL_BANK_AUDIT',
        verifiedBy: params.adminEmail,
        verifiedAt: new Date().toISOString(),
      });
    } else {
      await this.paymentRepo.create({
        id: `pay-${crypto.randomUUID()}`,
        orderId: order.id,
        provider: 'BANK_TRANSFER',
        providerReference: params.bankReference,
        method: 'BANK_TRANSFER',
        amountKobo: order.totalKobo,
        currency: 'NGN',
        status: 'PAID',
        verificationMethod: 'MANUAL_BANK_AUDIT',
        verifiedBy: params.adminEmail,
        verifiedAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Update order
    const updatedOrder = await this.orderRepo.update(order.id, {
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      trackingNotes: [
        ...order.trackingNotes,
        {
          timestamp: new Date().toISOString(),
          status: 'CONFIRMED',
          note: `Bank transfer payment confirmed by ${params.adminEmail} (Bank Ref: ${params.bankReference})`,
        },
      ],
    });

    // Commit stock
    await inventoryService.commitOrderSale(order.items, order.id, order.orderNumber);

    return updatedOrder;
  }

  public async getPayments(filter?: { orderId?: string; status?: string; page?: number; limit?: number }) {
    return this.paymentRepo.findAll(filter);
  }
}

export const paymentService = new PaymentService();
