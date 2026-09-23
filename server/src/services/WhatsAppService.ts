import { Order } from '../types';

export class WhatsAppService {
  public generateOrderSummaryText(order: Order): string {
    const formattedTotal = (order.totalKobo / 100).toLocaleString();
    const formattedSubtotal = (order.subtotalKobo / 100).toLocaleString();
    const formattedDelivery = (order.deliveryFeeKobo / 100).toLocaleString();

    const itemsText = order.items
      .map((i) => `• ${i.productName} (x${i.quantity}) - ₦${((i.unitPriceKobo * i.quantity) / 100).toLocaleString()}`)
      .join('\n');

    return `🔔 *NEW ORDER: ${order.orderNumber}*
👤 *Customer:* ${order.customerName}
📞 *Phone:* ${order.customerPhone}
📧 *Email:* ${order.customerEmail}

📍 *Delivery Details:*
${order.deliveryAddress}
${order.deliveryCity}, ${order.deliveryState} (${order.deliveryZone})
${order.deliveryNotes ? `_Notes: ${order.deliveryNotes}_\n` : ''}
📦 *Items Ordered:*
${itemsText}

💰 *Financials:*
Subtotal: ₦${formattedSubtotal}
Delivery: ₦${formattedDelivery}
*Total: ₦${formattedTotal}*

💳 *Payment:* ${order.paymentMethod} (${order.paymentStatus})
🚚 *Status:* ${order.orderStatus}`;
  }

  public generateWhatsAppDeepLink(order: Order, businessNumber = '2348108725967'): string {
    const text = this.generateOrderSummaryText(order);
    const cleanNumber = businessNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  }
}

export const whatsAppService = new WhatsAppService();
