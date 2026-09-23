import { Router } from 'express';
import { deliveryService } from '../services/DeliveryService';
import { settingsService } from '../services/AuthAuditSettingsServices';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validateAndErrors';
import { updateSettingsSchema } from '../validation/schemas';
import { auditLogService } from '../services/AuthAuditSettingsServices';

const deliveryRouter = Router();
const settingsRouter = Router();

// --- Delivery Routes ---
// GET /api/delivery/calculate or /api/delivery/quote (Public)
deliveryRouter.get(['/calculate', '/quote'], async (req, res, next) => {
  try {
    const { state, isPickup } = req.query;
    if (!state && isPickup !== 'true') {
      return res.status(400).json({ error: 'State is required to calculate delivery' });
    }
    const result = await deliveryService.calculateDelivery(
      (state as string) || 'Lagos',
      isPickup === 'true'
    );
    return res.json({
      ...result,
      deliveryFee: result.feeKobo / 100,
      fee: result.feeKobo / 100,
      deliveryFeeKobo: result.feeKobo,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/delivery/zones (Public)
deliveryRouter.get('/zones', async (req, res, next) => {
  try {
    const zones = await deliveryService.getDeliveryZones();
    const enriched = zones.map((z) => ({
      ...z,
      fee: z.feeKobo / 100,
    }));
    return res.json(enriched);
  } catch (err) {
    next(err);
  }
});

// --- Settings Routes ---
// GET /api/settings (Public - Showroom, Team, Bank accounts)
settingsRouter.get('/', async (req, res, next) => {
  try {
    const result = await settingsService.getSettings();
    return res.json({
      settings: {
        ...result.settings,
        deliveryLagos: result.settings.deliveryLagosKobo / 100,
        deliverySouthWest: result.settings.deliverySouthWestKobo / 100,
        deliveryNationwide: result.settings.deliveryNationwideKobo / 100,
      },
      team: result.team,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings (Admin Only)
settingsRouter.put('/', requireAuth, requireAdmin, validate(updateSettingsSchema), async (req, res, next) => {
  try {
    const updated = await settingsService.updateSettings(req.body);
    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'UPDATE_SETTINGS',
      entityType: 'SETTINGS',
      entityId: 'default',
      afterState: updated,
    });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

export { deliveryRouter, settingsRouter };
