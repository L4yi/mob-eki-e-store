import { repositories } from '../repositories';
import { InventoryAction, InventoryMovement, Product } from '../types';
import crypto from 'crypto';

export class InventoryService {
  private productRepo = repositories.productRepo;
  private inventoryRepo = repositories.inventoryRepo;

  public async reserveOrderStock(items: { productId: string; quantity: number }[]): Promise<boolean> {
    const reservedItems: { productId: string; quantity: number }[] = [];

    for (const item of items) {
      const success = await this.productRepo.reserveStock(item.productId, item.quantity);
      if (!success) {
        // Rollback all previous reservations in this batch
        for (const rolled of reservedItems) {
          await this.productRepo.releaseStock(rolled.productId, rolled.quantity);
        }
        return false;
      }
      reservedItems.push(item);
    }
    return true;
  }

  public async releaseOrderStock(
    items: { productId: string; quantity: number }[],
    orderId: string,
    reason = 'Order cancelled or payment expired'
  ): Promise<void> {
    for (const item of items) {
      await this.productRepo.releaseStock(item.productId, item.quantity);
      const product = await this.productRepo.findById(item.productId);
      if (product) {
        await this.inventoryRepo.recordMovement({
          id: `mov-${crypto.randomUUID()}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          type: 'RELEASE',
          quantityChange: item.quantity,
          previousStock: product.stockQuantity,
          newStock: product.stockQuantity,
          referenceType: 'ORDER',
          referenceId: orderId,
          reason,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  public async commitOrderSale(
    items: { productId: string; quantity: number }[],
    orderId: string,
    orderNumber: string
  ): Promise<void> {
    for (const item of items) {
      const product = await this.productRepo.findById(item.productId);
      const prevStock = product ? product.stockQuantity : 0;
      await this.productRepo.commitSale(item.productId, item.quantity);
      const updatedProduct = await this.productRepo.findById(item.productId);
      const newStock = updatedProduct ? updatedProduct.stockQuantity : Math.max(0, prevStock - item.quantity);

      if (product) {
        await this.inventoryRepo.recordMovement({
          id: `mov-${crypto.randomUUID()}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          type: 'SALE',
          quantityChange: -item.quantity,
          previousStock: prevStock,
          newStock,
          referenceType: 'ORDER',
          referenceId: orderNumber || orderId,
          reason: `Confirmed customer sale on order ${orderNumber}`,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  public async adjustStock(params: {
    productId: string;
    type: 'RESTOCK' | 'ADJUSTMENT' | 'DAMAGE' | 'RETURN';
    quantityChange: number;
    reason: string;
    performedBy?: string;
  }): Promise<Product | null> {
    const product = await this.productRepo.findById(params.productId);
    if (!product) return null;

    const previousStock = product.stockQuantity;
    const newStock = Math.max(0, previousStock + params.quantityChange);

    const updated = await this.productRepo.update(product.id, {
      stockQuantity: newStock,
    });

    if (updated) {
      await this.inventoryRepo.recordMovement({
        id: `mov-${crypto.randomUUID()}`,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        type: params.type,
        quantityChange: params.quantityChange,
        previousStock,
        newStock,
        reason: params.reason,
        performedBy: params.performedBy || 'ADMIN',
        createdAt: new Date().toISOString(),
      });
    }

    return updated;
  }

  public async getMovements(filter?: { productId?: string; type?: string; page?: number; limit?: number }) {
    return this.inventoryRepo.getMovements(filter);
  }

  public async getLowStock() {
    return this.productRepo.getLowStock();
  }
}

export const inventoryService = new InventoryService();
