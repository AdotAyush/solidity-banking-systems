import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import eventBus from '../utils/eventBus.js';

class BlockchainSync {
  constructor() {
    this.setupListeners();
  }

  setupListeners() {
    eventBus.on('blockchain:sync', async (event) => {
      await this.syncEvent(event);
    });
  }

  async syncEvent(event) {
    const { type, data } = event;

    try {
      switch (type) {
        case 'deposit':
          await this.syncDeposit(data);
          break;
        case 'withdraw':
          await this.syncWithdraw(data);
          break;
        case 'transfer':
          await this.syncTransfer(data);
          break;
        case 'userRegistered':
          await this.syncUserRegistered(data);
          break;
      }
    } catch (error) {
      console.error('Error syncing blockchain event:', error);
    }
  }

  async syncDeposit(data) {
    const { user, amount, txHash, blockNumber } = data;
    
    // Find user by wallet address
    const dbUser = await User.findOne({ walletAddress: user.toLowerCase() });
    if (!dbUser) {
      console.warn(`User with wallet ${user} not found in database`);
      return;
    }

    // Check if transaction already exists
    const existingTx = await Transaction.findOne({ txHash });
    if (existingTx) {
      return; // Already synced
    }

    // Create transaction record
    const transaction = new Transaction({
      userId: dbUser._id,
      type: 'deposit',
      amount: parseFloat(amount),
      status: 'completed',
      source: 'onchain',
      txHash,
      blockNumber
    });

    await transaction.save();

    // Update user's on-chain balance is tracked by contract, but we can emit notification
    eventBus.emitNotification(dbUser._id, `On-chain deposit of $${amount} confirmed`, 'success');
  }

  async syncWithdraw(data) {
    const { user, amount, txHash, blockNumber } = data;
    
    const dbUser = await User.findOne({ walletAddress: user.toLowerCase() });
    if (!dbUser) {
      console.warn(`User with wallet ${user} not found in database`);
      return;
    }

    const existingTx = await Transaction.findOne({ txHash });
    if (existingTx) {
      return;
    }

    const transaction = new Transaction({
      userId: dbUser._id,
      type: 'withdraw',
      amount: parseFloat(amount),
      status: 'completed',
      source: 'onchain',
      txHash,
      blockNumber
    });

    await transaction.save();

    eventBus.emitNotification(dbUser._id, `On-chain withdrawal of $${amount} confirmed`, 'success');
  }

  async syncTransfer(data) {
    const { from, to, amount, txHash, blockNumber } = data;
    
    const [fromUser, toUser] = await Promise.all([
      User.findOne({ walletAddress: from.toLowerCase() }),
      User.findOne({ walletAddress: to.toLowerCase() })
    ]);

    if (!fromUser || !toUser) {
      console.warn(`Users not found for transfer: ${from} -> ${to}`);
      return;
    }

    const existingTx = await Transaction.findOne({ txHash });
    if (existingTx) {
      return;
    }

    // Create transaction record for sender
    const transaction = new Transaction({
      userId: fromUser._id,
      type: 'transfer',
      amount: parseFloat(amount),
      status: 'completed',
      source: 'onchain',
      recipientId: toUser._id,
      recipientAddress: to,
      txHash,
      blockNumber
    });

    await transaction.save();

    eventBus.emitNotification(fromUser._id, `On-chain transfer of $${amount} to ${toUser.email} confirmed`, 'success');
    eventBus.emitNotification(toUser._id, `Received on-chain transfer of $${amount} from ${fromUser.email}`, 'success');
  }

  /**
   * Sync user registered event
   */
  async syncUserRegistered(data) {
    const { user } = data;
    
    const dbUser = await User.findOne({ walletAddress: user.toLowerCase() });
    if (dbUser) {
      eventBus.emitNotification(dbUser._id, 'Wallet registered on blockchain', 'success');
    }
  }
}

export default new BlockchainSync();

