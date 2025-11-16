import express from 'express';
import {
  createDeposit,
  createWithdraw,
  createTransfer,
  getTransactions,
  getAllTransactions,
  getTransactionById
} from '../controllers/transactionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/deposit', createDeposit);
router.post('/withdraw', createWithdraw);
router.post('/transfer', createTransfer);
router.get('/', getTransactions);
router.get('/all', authorize('admin'), getAllTransactions);
router.get('/:id', getTransactionById);

export default router;

