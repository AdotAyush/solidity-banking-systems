import { jest } from '@jest/globals';
import transactionService from '../services/transactionService.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import transactionQueue from '../utils/transactionQueue.js';

// Mock dependencies
jest.mock('../models/Transaction.js');
jest.mock('../models/User.js');
jest.mock('../utils/transactionQueue.js', () => ({
  enqueue: jest.fn()
}));
jest.mock('../utils/eventBus.js', () => ({
  emitNotification: jest.fn()
}));
jest.mock('../utils/blockchain.js', () => ({
  getOnChainBalance: jest.fn(() => Promise.resolve('100'))
}));

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDeposit', () => {
    it('should create deposit transaction', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com'
      };
      User.findById = jest.fn().mockResolvedValue(mockUser);

      const mockTransaction = {
        _id: 'tx-id',
        userId: 'user-id',
        type: 'deposit',
        amount: 100,
        status: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };
      Transaction.mockImplementation(() => mockTransaction);

      const result = await transactionService.createDeposit('user-id', 100);

      expect(result).toHaveProperty('type', 'deposit');
      expect(result).toHaveProperty('amount', 100);
      expect(transactionQueue.enqueue).toHaveBeenCalled();
    });

    it('should throw error for invalid amount', async () => {
      await expect(
        transactionService.createDeposit('user-id', -10)
      ).rejects.toThrow('Amount must be greater than 0');
    });
  });

  describe('createWithdraw', () => {
    it('should create withdrawal transaction', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        offChainBalance: 200
      };
      User.findById = jest.fn().mockResolvedValue(mockUser);

      const mockTransaction = {
        _id: 'tx-id',
        userId: 'user-id',
        type: 'withdraw',
        amount: 50,
        status: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };
      Transaction.mockImplementation(() => mockTransaction);

      const result = await transactionService.createWithdraw('user-id', 50);

      expect(result).toHaveProperty('type', 'withdraw');
      expect(result).toHaveProperty('amount', 50);
    });

    it('should throw error for insufficient balance', async () => {
      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        offChainBalance: 10
      };
      User.findById = jest.fn().mockResolvedValue(mockUser);

      await expect(
        transactionService.createWithdraw('user-id', 100)
      ).rejects.toThrow('Insufficient balance');
    });
  });
});

