import { Router } from 'express';
import { authService } from '../services/AuthAuditSettingsServices';
import { validate } from '../middleware/validateAndErrors';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validation/schemas';
import { requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const profile = await authService.getProfile(req.user!.id);
    if (!profile) return res.status(404).json({ error: 'User profile not found' });
    return res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, validate(updateProfileSchema), async (req, res, next) => {
  try {
    const updated = await authService.updateProfile(req.user!.id, req.body);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/password
router.put('/password', requireAuth, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
