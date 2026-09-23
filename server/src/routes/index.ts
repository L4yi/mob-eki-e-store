import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import categoryRoutes from './categories';
import orderRoutes from './orders';
import paymentRoutes from './payments';
import { deliveryRouter, settingsRouter } from './DeliveryAndSettingsRoutes';
import adminRoutes from './admin';

const router = Router();

// Public & Customer Routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/delivery', deliveryRouter);
router.use('/settings', settingsRouter);

// Administrative Management Routes
router.use('/admin', adminRoutes);

export default router;
