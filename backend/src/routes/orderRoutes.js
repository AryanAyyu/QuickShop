import { Router } from 'express';
import { createOrder, myOrders, allOrders, getOrder } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.post('/', protect, createOrder);
router.get('/my', protect, myOrders);
router.get('/', protect, adminOnly, allOrders);
router.get('/:id', protect, getOrder);
export default router;
