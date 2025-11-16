import express from 'express';
import { getBalance, registerOnChain, getContractInfo } from '../controllers/blockchainController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/balance', getBalance);
router.post('/register', registerOnChain);
router.get('/info', getContractInfo);

export default router;

