import { Router } from 'express';
import { listCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.get('/', listCategories);
router.post('/', protect, adminOnly, createCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);
export default router;
