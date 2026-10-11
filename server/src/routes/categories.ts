import { Router } from 'express';
import { categoryService } from '../services/ProductAndCategoryServices';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validateAndErrors';
import { createCategorySchema, updateCategorySchema } from '../validation/schemas';
import { auditLogService } from '../services/AuthAuditSettingsServices';
import { productBrowseLimiter, adminMutationLimiter } from '../middleware/rateLimiter';

const router = Router();

// GET /api/categories (Public, Max 120 req / min / IP)
router.get('/', productBrowseLimiter, async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(true);
    return res.json(categories);
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:idOrSlug (Public, Max 120 req / min / IP)
router.get('/:idOrSlug', productBrowseLimiter, async (req, res, next) => {
  try {
    const idOrSlug = Array.isArray(req.params.idOrSlug) ? req.params.idOrSlug[0] : req.params.idOrSlug;
    const category = await categoryService.getCategoryByIdOrSlug(idOrSlug);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.json(category);
  } catch (err) {
    next(err);
  }
});

// POST /api/categories (Admin Only, Max 30 mut / min)
router.post('/', requireAuth, requireAdmin, adminMutationLimiter, validate(createCategorySchema), async (req, res, next) => {
  try {
    const created = await categoryService.createCategory(req.body);
    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'CREATE_CATEGORY',
      entityType: 'CATEGORY',
      entityId: created.id,
      afterState: created,
    });
    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /api/categories/:id (Admin Only, Max 30 mut / min)
router.put('/:id', requireAuth, requireAdmin, adminMutationLimiter, validate(updateCategorySchema), async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const before = await categoryService.getCategoryByIdOrSlug(id);
    const updated = await categoryService.updateCategory(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Category not found' });

    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'UPDATE_CATEGORY',
      entityType: 'CATEGORY',
      entityId: id,
      beforeState: before || undefined,
      afterState: updated,
    });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/categories/:id (Admin Only, Max 30 mut / min)
router.delete('/:id', requireAuth, requireAdmin, adminMutationLimiter, async (req, res, next) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const success = await categoryService.deleteCategory(id);
    if (!success) return res.status(404).json({ error: 'Category not found' });

    await auditLogService.log({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'DEACTIVATE_CATEGORY',
      entityType: 'CATEGORY',
      entityId: id,
    });
    return res.json({ message: 'Category deactivated successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
