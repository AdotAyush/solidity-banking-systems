import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['onchain', 'offchain'],
    required: true
  },
  // For transfers
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  recipientAddress: {
    type: String,
    default: null
  },
  // Blockchain transaction hash (if on-chain)
  txHash: {
    type: String,
    default: null
  },
  // Blockchain block number (if on-chain)
  blockNumber: {
    type: Number,
    default: null
  },
  error: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });

export default mongoose.model('Transaction', transactionSchema);

