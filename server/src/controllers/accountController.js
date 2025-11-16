import accountService from '../services/accountService.js';

export const getAccount = async (req, res) => {
  try {
    const account = await accountService.getAccountDetails(req.user._id);
    res.json(account);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateWalletAddress = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const user = await accountService.updateWalletAddress(req.user._id, walletAddress);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await accountService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await accountService.getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
