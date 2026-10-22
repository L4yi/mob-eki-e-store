import nodemailer, { Transporter } from 'nodemailer';
import { Order, OrderStatus } from '../types';

export class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured = false;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
        this.isConfigured = true;
        console.log('📧 [EmailService] SMTP Transporter initialized successfully.');
      } catch (err) {
        console.warn('⚠️ [EmailService] Failed to initialize SMTP transporter:', err);
      }
    } else if (process.env.RESEND_API_KEY) {
      this.isConfigured = true;
      console.log('📧 [EmailService] Resend API Key configured for transactional email delivery.');
    } else {
      console.log('ℹ️ [EmailService] No SMTP/Resend credentials provided. Running in simulation/logger mode.');
    }
  }

  public async sendOrderConfirmation(order: Order): Promise<boolean> {
    const totalPayable = order.totalKobo / 100;
    const subtotal = order.subtotalKobo / 100;
    const deliveryFee = order.deliveryFeeKobo / 100;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'muhazoladejo48@gmail.com';

    const itemsRows = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 12px 8px; font-size: 13px; color: #171A1F;">
            <strong>${item.productName}</strong><br/>
            <span style="font-size: 11px; color: #6B7280; font-family: monospace;">SKU: ${item.sku || 'N/A'}</span>
          </td>
          <td style="padding: 12px 8px; font-size: 13px; color: #171A1F; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px 8px; font-size: 13px; color: #171A1F; text-align: right;">₦${(item.unitPriceKobo / 100).toLocaleString()}</td>
          <td style="padding: 12px 8px; font-size: 13px; color: #0B1F3A; font-weight: bold; text-align: right;">₦${((item.unitPriceKobo * item.quantity) / 100).toLocaleString()}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - M.O.B EKI VENTURES</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F8F6; margin: 0; padding: 20px; color: #171A1F;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header Banner -->
        <div style="background-color: #0B1F3A; padding: 30px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-family: Georgia, serif; font-size: 24px; letter-spacing: 1px;">
            M.O.B EKI VENTURES
          </h1>
          <p style="color: #C9A227; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
            Doors &amp; Architectural Hardware Fittings &bull; Lagos, Nigeria
          </p>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="display: inline-block; padding: 4px 12px; background-color: #ECFDF5; color: #065F46; font-size: 12px; font-weight: bold; border-radius: 20px; border: 1px solid #A7F3D0;">
              Order Placed Successfully
            </span>
            <h2 style="color: #0B1F3A; font-size: 20px; margin: 12px 0 4px 0;">
              Order Ref: <span style="font-family: monospace; color: #C9A227;">${order.orderNumber}</span>
            </h2>
            <p style="color: #6B7280; font-size: 12px; margin: 0;">
              Date: ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <!-- Customer & Delivery Info -->
          <div style="background-color: #F8F8F6; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 12px; line-height: 1.6;">
            <p style="margin: 0; font-weight: bold; color: #0B1F3A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Customer &amp; Dispatch Details</p>
            <p style="margin: 0;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin: 0;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="margin: 0;"><strong>Delivery State:</strong> ${order.deliveryState} (${order.deliveryZone})</p>
            <p style="margin: 0;"><strong>Destination:</strong> ${order.deliveryAddress}</p>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #F3F4F6; text-transform: uppercase; font-size: 11px; color: #4B5563;">
                <th style="padding: 8px; text-align: left;">Item</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Unit</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <!-- Financial Summary -->
          <div style="border-top: 2px solid #E5E7EB; padding-top: 12px; margin-bottom: 24px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #4B5563;">
              <span>Subtotal:</span>
              <span>₦${subtotal.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #4B5563;">
              <span>Delivery Fee (${order.deliveryZone}):</span>
              <span>₦${deliveryFee.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #0B1F3A; border-top: 1px solid #E5E7EB; padding-top: 8px;">
              <span>Total Payable:</span>
              <span style="color: #0B1F3A;">₦${totalPayable.toLocaleString()}</span>
            </div>
          </div>

          <!-- Official Payment Details Card -->
          <div style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 18px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #92400E; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
              Official Prepayment Account (No Pay on Delivery)
            </p>
            <p style="margin: 0; font-size: 13px; color: #171A1F;">
              <strong>Bank:</strong> OPay &nbsp;|&nbsp; <strong>Account Name:</strong> Olaide Oladejo
            </p>
            <p style="margin: 8px 0; font-size: 20px; font-family: monospace; font-weight: bold; color: #0B1F3A; letter-spacing: 2px;">
              8025262598
            </p>
            <p style="margin: 0; font-size: 11px; color: #78350F; line-height: 1.4;">
              Please include your order reference <strong>${order.orderNumber}</strong> in your transfer narration.
            </p>
          </div>

          <!-- WhatsApp CTA Button -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://wa.me/2348108725967?text=${encodeURIComponent(`Hello M.O.B EKI VENTURES, I have placed Order ${order.orderNumber}. Customer: ${order.customerName}. Amount: ₦${totalPayable.toLocaleString()}. I am sending my transfer receipt for confirmation.`)}"
               style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 14px 28px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              Send Payment Proof on WhatsApp &rarr;
            </a>
          </div>

          <!-- Showroom & Warehouse Footer -->
          <div style="border-top: 1px solid #E5E7EB; padding-top: 16px; font-size: 11px; color: #6B7280; text-align: center; line-height: 1.5;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #0B1F3A;">
              M.O.B EKI VENTURES Showroom &amp; Central Warehouse
            </p>
            <p style="margin: 0 0 2px 0;">
              <strong>Retail Showroom:</strong> Shop 8, Alhaja Abibatu Mogaji Modern Market, 2, Amu Street, Mushin, Lagos
            </p>
            <p style="margin: 0 0 4px 0;">
              <strong>Central Warehouse &amp; Bulk Intake:</strong> 56, Palm Avenue, Mushin, Lagos
            </p>
            <p style="margin: 0;">
              Direct Phone / WhatsApp: +234 810 872 5967 &bull; Email: sales@mobekiventures.com
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    // 1. Send via Resend REST API if RESEND_API_KEY is available
    if (process.env.RESEND_API_KEY) {
      try {
        const fromAddress = process.env.RESEND_FROM || 'M.O.B EKI VENTURES <onboarding@resend.dev>';
        
        // Dispatch merchant alert
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [adminEmail],
            subject: `🚨 [New Order] ${order.orderNumber} - ₦${totalPayable.toLocaleString()} (${order.customerName})`,
            html: htmlContent,
          }),
        }).catch((e) => console.error('Resend merchant alert error:', e));

        // Dispatch customer confirmation
        if (order.customerEmail) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromAddress,
              to: [order.customerEmail],
              subject: `Order Confirmation: ${order.orderNumber} - M.O.B EKI VENTURES`,
              html: htmlContent,
            }),
          }).catch((e) => console.error('Resend customer email error:', e));
        }

        console.log(`✅ [EmailService:Resend] Dispatched order confirmation emails for ${order.orderNumber}`);
        return true;
      } catch (err) {
        console.error(`❌ [EmailService:Resend] Error sending for ${order.orderNumber}:`, err);
      }
    }

    // 2. Send via SMTP Transporter if configured
    if (this.isConfigured && this.transporter) {
      try {
        const fromAddress = process.env.SMTP_FROM || '"M.O.B EKI VENTURES" <sales@mobekiventures.com>';
        
        await this.transporter.sendMail({
          from: fromAddress,
          to: order.customerEmail,
          subject: `Order Confirmation: ${order.orderNumber} - M.O.B EKI VENTURES`,
          html: htmlContent,
        });

        await this.transporter.sendMail({
          from: fromAddress,
          to: adminEmail,
          subject: `🚨 [New Order] ${order.orderNumber} - ₦${totalPayable.toLocaleString()} (${order.customerName})`,
          html: htmlContent,
        });

        console.log(`✅ [EmailService:SMTP] Dispatched order confirmation emails for ${order.orderNumber}`);
        return true;
      } catch (err) {
        console.error(`❌ [EmailService:SMTP] Failed to send order email for ${order.orderNumber}:`, err);
        return false;
      }
    }

    // 3. Fallback Logger
    console.log(`📝 [EmailService] (Simulated) Order email generated for ${order.orderNumber} -> Customer: ${order.customerEmail}, Merchant: ${adminEmail}`);
    return true;
  }
}

export const emailService = new EmailService();
