import transactionService from '../services/transactionService.js';

export const createDeposit = async (req, res) => {
  try {
    const { amount, source } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const transaction = await transactionService.createDeposit(
      req.user._id,
      amount,
      source || 'offchain'
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createWithdraw = async (req, res) => {
  try {
    const { amount, source } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const transaction = await transactionService.createWithdraw(
      req.user._id,
      amount,
      source || 'offchain'
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createTransfer = async (req, res) => {
  try {
    const { recipientId, amount, source } = req.body;

    if (!recipientId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Recipient ID and valid amount are required' });
    }

    const transaction = await transactionService.createTransfer(
      req.user._id,
      recipientId,
      amount,
      source || 'offchain'
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const transactions = await transactionService.getUserTransactions(req.user._id, limit);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const transactions = await transactionService.getAllTransactions(limit);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id, req.user._id);
    res.json(transaction);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

