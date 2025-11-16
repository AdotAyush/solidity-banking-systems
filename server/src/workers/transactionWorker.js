import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import transactionQueue from '../utils/transactionQueue.js';
import eventBus from '../utils/eventBus.js';
import { getOnChainBalance } from '../utils/blockchain.js';

class TransactionWorker {
  constructor() {
    this.isRunning = false;
    this.setupListeners();
  }

  setupListeners() {
    transactionQueue.on('transaction:process', async (item) => {
      await this.processTransaction(item);
    });
  }

  async processTransaction(item) {
    const { transactionId, userId, type, amount, source, recipientId } = item;

    try {
      // Update transaction status to processing
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      transaction.status = 'processing';
      await transaction.save();

      // Simulate processing delay (like network latency)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Process based on type
      switch (type) {
        case 'deposit':
          await this.processDeposit(transaction, user, amount, source);
          break;
        case 'withdraw':
          await this.processWithdraw(transaction, user, amount, source);
          break;
        case 'transfer':
          const recipient = await User.findById(recipientId);
          if (!recipient) {
            throw new Error('Recipient not found');
          }
          await this.processTransfer(transaction, user, recipient, amount, source);
          break;
        default:
          throw new Error('Invalid transaction type');
      }

      // Mark as completed
      transaction.status = 'completed';
      await transaction.save();

      // Emit success notification
      eventBus.emitNotification(userId, `${type} of $${amount} completed successfully`, 'success');

    } catch (error) {
      console.error('Error processing transaction:', error);
      
      // Update transaction with error
      const transaction = await Transaction.findById(transactionId);
      if (transaction) {
        transaction.status = 'failed';
        transaction.error = error.message;
        await transaction.save();
      }

      // Emit error notification
      eventBus.emitNotification(userId, `Transaction failed: ${error.message}`, 'error');
    }
  }

  async processDeposit(transaction, user, amount, source) {
    if (source === 'offchain') {
      user.offChainBalance += amount;
      await user.save();
    }
    // On-chain deposits are handled by smart contract events
  }

  async processWithdraw(transaction, user, amount, source) {
    if (source === 'offchain') {
      if (user.offChainBalance < amount) {
        throw new Error('Insufficient balance');
      }
      user.offChainBalance -= amount;
      await user.save();
    }
    // On-chain withdrawals are handled by smart contract events
  }

  async processTransfer(transaction, user, recipient, amount, source) {
    if (source === 'offchain') {
      if (user.offChainBalance < amount) {
        throw new Error('Insufficient balance');
      }
      user.offChainBalance -= amount;
      recipient.offChainBalance += amount;
      await Promise.all([user.save(), recipient.save()]);

      // Update transaction with recipient info
      transaction.recipientId = recipient._id;
      await transaction.save();
    }
    // On-chain transfers are handled by smart contract events
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('Transaction worker started');
  }

  stop() {
    this.isRunning = false;
    console.log('Transaction worker stopped');
  }
}

export default new TransactionWorker();

