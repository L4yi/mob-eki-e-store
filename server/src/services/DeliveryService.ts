import { DeliveryZone, DeliveryZoneConfig } from '../types';
import { repositories } from '../repositories';

const STATE_ZONE_MAP: Record<string, DeliveryZone> = {
  // Lagos
  lagos: 'LAGOS',
  // South West
  ogun: 'SOUTH_WEST',
  oyo: 'SOUTH_WEST',
  osun: 'SOUTH_WEST',
  ondo: 'SOUTH_WEST',
  ekiti: 'SOUTH_WEST',
};

export class DeliveryService {
  private settingsRepo = repositories.settingsRepo;

  public async getDeliveryZones(): Promise<DeliveryZoneConfig[]> {
    return this.settingsRepo.getDeliveryZones();
  }

  public async calculateDelivery(state: string, isPickup = false): Promise<{
    zone: DeliveryZone;
    feeKobo: number;
    estimatedDays: string;
    zoneName: string;
  }> {
    if (isPickup) {
      return {
        zone: 'PICKUP',
        feeKobo: 0,
        estimatedDays: 'Available same-day at Mushin Showroom',
        zoneName: 'Direct Store Pickup',
      };
    }

    const cleanState = state.trim().toLowerCase();
    const zone: DeliveryZone = STATE_ZONE_MAP[cleanState] || 'NATIONWIDE';

    const zones = await this.settingsRepo.getDeliveryZones();
    const zoneConfig = zones.find((z) => z.id === zone);

    if (zoneConfig) {
      return {
        zone,
        feeKobo: zoneConfig.feeKobo,
        estimatedDays: zoneConfig.estimatedDays,
        zoneName: zoneConfig.name,
      };
    }

    // Fallback defaults in Kobo
    const fallbackFees: Record<DeliveryZone, number> = {
      LAGOS: 200000,       // ₦2,000
      SOUTH_WEST: 400000,  // ₦4,000
      NATIONWIDE: 600000,  // ₦6,000
      PICKUP: 0,
    };

    return {
      zone,
      feeKobo: fallbackFees[zone] || 600000,
      estimatedDays: zone === 'LAGOS' ? '1–2 business days' : zone === 'SOUTH_WEST' ? '2–3 business days' : '3–5 business days',
      zoneName: zone === 'LAGOS' ? 'Lagos State Delivery' : zone === 'SOUTH_WEST' ? 'South West Region' : 'Nationwide Courier',
    };
  }
}

export const deliveryService = new DeliveryService();
