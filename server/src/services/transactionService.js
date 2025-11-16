import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import transactionQueue from '../utils/transactionQueue.js';
import eventBus from '../utils/eventBus.js';
import { getOnChainBalance } from '../utils/blockchain.js';

class TransactionService {
  async createDeposit(userId, amount, source = 'offchain') {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'deposit',
      amount,
      status: 'pending',
      source
    });

    await transaction.save();

    // Add to queue for processing
    transactionQueue.enqueue({
      transactionId: transaction._id,
      userId,
      type: 'deposit',
      amount,
      source
    });

    // Emit notification
    eventBus.emitNotification(userId, `Deposit of $${amount} is being processed`, 'info');

    return transaction;
  }

  async createWithdraw(userId, amount, source = 'offchain') {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check balance
    const balance = source === 'onchain' 
      ? parseFloat(await getOnChainBalance(user.walletAddress))
      : user.offChainBalance;

    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'withdraw',
      amount,
      status: 'pending',
      source
    });

    await transaction.save();

    // Add to queue for processing
    transactionQueue.enqueue({
      transactionId: transaction._id,
      userId,
      type: 'withdraw',
      amount,
      source
    });

    // Emit notification
    eventBus.emitNotification(userId, `Withdrawal of $${amount} is being processed`, 'info');

    return transaction;
  }

  async createTransfer(userId, recipientId, amount, source = 'offchain') {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    if (userId.toString() === recipientId.toString()) {
      throw new Error('Cannot transfer to yourself');
    }

    const [user, recipient] = await Promise.all([
      User.findById(userId),
      User.findById(recipientId)
    ]);

    if (!user || !recipient) {
      throw new Error('User or recipient not found');
    }

    // Check balance
    const balance = source === 'onchain'
      ? parseFloat(await getOnChainBalance(user.walletAddress))
      : user.offChainBalance;

    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'transfer',
      amount,
      status: 'pending',
      source,
      recipientId
    });

    await transaction.save();

    // Add to queue for processing
    transactionQueue.enqueue({
      transactionId: transaction._id,
      userId,
      recipientId,
      type: 'transfer',
      amount,
      source
    });

    // Emit notifications
    eventBus.emitNotification(userId, `Transfer of $${amount} is being processed`, 'info');
    eventBus.emitNotification(recipientId, `Incoming transfer of $${amount}`, 'info');

    return transaction;
  }

  async getUserTransactions(userId, limit = 50) {
    // Get transactions where user is the sender
    const sentTransactions = await Transaction.find({ userId })
      .populate('recipientId', 'email')
      .sort({ createdAt: -1 })
      .lean();

    // Get transactions where user is the recipient (received transfers)
    const receivedTransactions = await Transaction.find({ 
      recipientId: userId,
      type: 'transfer'
    })
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .lean();

    // Mark sent transactions
    const markedSent = sentTransactions.map(tx => ({
      ...tx,
      isReceived: false
    }));

    // Mark received transactions
    const markedReceived = receivedTransactions.map(tx => ({
      ...tx,
      isReceived: true
    }));

    // Combine and sort by date, then limit
    const allTransactions = [...markedSent, ...markedReceived]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return allTransactions;
  }

  async getAllTransactions(limit = 100) {
    return await Transaction.find()
      .populate('userId', 'email')
      .populate('recipientId', 'email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getTransactionById(transactionId, userId) {
    const transaction = await Transaction.findById(transactionId)
      .populate('userId', 'email')
      .populate('recipientId', 'email');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Check if user has access (owner or admin)
    if (transaction.userId._id.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    return transaction;
  }
}

export default new TransactionService();

