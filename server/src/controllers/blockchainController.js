import { getContract, getProvider, getOnChainBalance, isUserRegisteredOnChain } from '../utils/blockchain.js';
import { ethers } from 'ethers';
import User from '../models/User.js';

export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.walletAddress) {
      return res.status(400).json({ error: 'Wallet address not set' });
    }

    const balance = await getOnChainBalance(user.walletAddress);
    res.json({ 
      walletAddress: user.walletAddress,
      balance: parseFloat(balance),
      balanceWei: ethers.parseEther(balance).toString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerOnChain = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.walletAddress) {
      return res.status(400).json({ error: 'Wallet address not set' });
    }

    const contract = getContract();
    if (!contract) {
      return res.status(503).json({ error: 'Blockchain not available' });
    }

    // Check if already registered
    const isRegistered = await isUserRegisteredOnChain(user.walletAddress);
    if (isRegistered) {
      return res.json({ message: 'User already registered on blockchain', registered: true });
    }

    // Note: This requires a wallet with private key to sign transactions
    // For production, you'd use a service account or user's wallet
    res.json({ 
      message: 'To register on-chain, send a transaction to registerUser() with your wallet',
      contractAddress: contract.target,
      walletAddress: user.walletAddress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContractInfo = async (req, res) => {
  try {
    const contract = getContract();
    if (!contract) {
      return res.status(503).json({ error: 'Blockchain not available' });
    }

    const provider = getProvider();
    const blockNumber = await provider.getBlockNumber();
    const network = await provider.getNetwork();

    res.json({
      contractAddress: contract.target,
      network: {
        name: network.name,
        chainId: network.chainId.toString(),
        blockNumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

