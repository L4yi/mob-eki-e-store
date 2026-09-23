import { repositories } from '../repositories';
import { inventoryService } from '../services/InventoryService';

export class BackgroundScheduler {
  private timer: NodeJS.Timeout | null = null;
  private orderRepo = repositories.orderRepo;

  public start(intervalMs = 60 * 1000): void {
    if (this.timer) return;
    console.log('⏱️ [BackgroundScheduler] Started automated reservation release worker');

    this.timer = setInterval(async () => {
      try {
        await this.releaseExpiredReservations();
      } catch (err) {
        console.error('[BackgroundScheduler] Worker error:', err);
      }
    }, intervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async releaseExpiredReservations(): Promise<void> {
    const now = new Date();
    const expiredOrders = await this.orderRepo.findExpiredPendingOrders(now);

    for (const order of expiredOrders) {
      console.log(
        `🧹 [BackgroundScheduler] Releasing expired reservation on order ${order.orderNumber} (ID: ${order.id})`
      );

      // Release stock
      await inventoryService.releaseOrderStock(
        order.items,
        order.id,
        'Checkout reservation expired after 30 minutes'
      );

      // Cancel order
      await this.orderRepo.update(order.id, {
        orderStatus: 'CANCELLED',
        trackingNotes: [
          ...order.trackingNotes,
          {
            timestamp: new Date().toISOString(),
            status: 'CANCELLED',
            note: 'Order auto-cancelled due to checkout timeout / reservation expiry',
          },
        ],
      });
    }
  }
}

export const backgroundScheduler = new BackgroundScheduler();
