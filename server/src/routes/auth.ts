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
import {
  loginLimiter,
  registerLimiter,
  passwordChangeLimiter,
} from '../middleware/rateLimiter';

const router = Router();

// POST /api/auth/register (Max 5 attempts / hour / IP)
router.post('/register', registerLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login (Max 5 failed attempts / 15 min / IP + Account)
router.post('/login', loginLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (err: any) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
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

// PUT /api/auth/password (Max 5 attempts / 15 min)
router.put('/password', requireAuth, passwordChangeLimiter, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
