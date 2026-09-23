import { Router } from 'express';
import { productService } from '../services/ProductAndCategoryServices';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validateAndErrors';
import { createProductSchema, updateProductSchema } from '../validation/schemas';
import { auditLogService } from '../services/AuthAuditSettingsServices';

const router = Router();

// GET /api/products (Public)
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sort, page, limit } = req.query;
    const result = await productService.getProducts({
      category: category as string,
      search: search as string,
      sort: sort as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
      activeOnly: true,
    });
    // Format products with price in Naira as well for compatibility
    const enriched = result.products.map((p) => ({
      ...p,
      price: p.priceKobo / 100,
      stockLevel:
        p.stockQuantity - p.reservedQuantity <= 0
          ? 'out_of_stock'
          : p.stockQuantity - p.reservedQuantity <= p.lowStockThreshold
          ? 'low_stock'
          : 'in_stock',
    }));
    return res.json(enriched);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:idOrSlug (Public)
router.get('/:idOrSlug', async (req, res, next) => {
  try {
    const idOrSlug = Array.isArray(req.params.idOrSlug) ? req.params.idOrSlug[0] : req.params.idOrSlug;
    const product = await productService.getProductByIdOrSlug(idOrSlug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({
      ...product,
      price: product.priceKobo / 100,
      stockLevel:
        product.stockQuantity - product.reservedQuantity <= 0
          ? 'out_of_stock'
          : product.stockQuantity - product.reservedQuantity <= product.lowStockThreshold
          ? 'low_stock'
          : 'in_stock',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/products (Admin Only)
router.post('/', requireAuth, requireAdmin, validate(createProductSchema), async (req, res, next) => {
  try {
    const created = await productService.createProduct(req.body);
    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'CREATE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: created.id,
      afterState: created,
    });
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id (Admin Only)
router.put('/:id', requireAuth, requireAdmin, validate(updateProductSchema), async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const before = await productService.getProductByIdOrSlug(id);
    const updated = await productService.updateProduct(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });

    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'UPDATE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: id,
      beforeState: before || undefined,
      afterState: updated,
    });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id (Admin Only - Soft Delete)
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const success = await productService.deleteProduct(id);
    if (!success) return res.status(404).json({ error: 'Product not found' });

    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'DEACTIVATE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: id,
    });
    return res.json({ message: 'Product deactivated successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
