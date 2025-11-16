import express from 'express';
import { getAccount, updateWalletAddress, getAllUsers, getUserById } from '../controllers/accountController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/me', getAccount);
router.put('/wallet', updateWalletAddress);

// Admin only routes
router.get('/users', authorize('admin'), getAllUsers);
router.get('/users/:id', authorize('admin'), getUserById);

export default router;
