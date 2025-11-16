import User from '../models/User.js';
import { getOnChainBalance, isUserRegisteredOnChain } from '../utils/blockchain.js';

class AccountService {
  async getAccountDetails(userId) {
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
      throw new Error('User not found');
    }

    let onChainBalance = '0';
    let isRegisteredOnChain = false;

    if (user.walletAddress) {
      onChainBalance = await getOnChainBalance(user.walletAddress);
      isRegisteredOnChain = await isUserRegisteredOnChain(user.walletAddress);
    }

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      },
      balances: {
        offChain: user.offChainBalance,
        onChain: parseFloat(onChainBalance),
        total: user.offChainBalance + parseFloat(onChainBalance)
      },
      isRegisteredOnChain
    };
  }

  async updateWalletAddress(userId, walletAddress) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.walletAddress = walletAddress;
    await user.save();

    return {
      id: user._id,
      email: user.email,
      walletAddress: user.walletAddress
    };
  }

  async getAllUsers() {
    return await User.find().select('-password -refreshToken');
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export default new AccountService();

