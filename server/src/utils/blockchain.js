import { ethers } from 'ethers';
import eventBus from './eventBus.js';

let provider;
let contract;
let contractAddress;

export const initBlockchain = async () => {
  try {
    // Connect to local Hardhat node
    provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545');
    contractAddress = process.env.BANK_CONTRACT_ADDRESS;

    if (!contractAddress) {
      console.warn('BANK_CONTRACT_ADDRESS not set. Blockchain features disabled.');
      return;
    }

    // ABI for Bank contract
    const abi = [
      "function registerUser(address userAddress) external",
      "function deposit() external payable",
      "function withdraw(uint256 amount) external",
      "function transfer(address to, uint256 amount) external",
      "function getBalance(address userAddress) external view returns (uint256)",
      "function isRegistered(address userAddress) external view returns (bool)",
      "function balances(address) external view returns (uint256)",
      "event UserRegistered(address indexed user, uint256 timestamp)",
      "event Deposit(address indexed user, uint256 amount, uint256 timestamp)",
      "event Withdraw(address indexed user, uint256 amount, uint256 timestamp)",
      "event Transfer(address indexed from, address indexed to, uint256 amount, uint256 timestamp)"
    ];

    contract = new ethers.Contract(contractAddress, abi, provider);

    // Start listening to events
    startEventListeners();

    console.log('Blockchain initialized successfully');
  } catch (error) {
    console.error('Error initializing blockchain:', error);
  }
};

const startEventListeners = () => {
  if (!contract) return;

  // Listen to Deposit events
  contract.on('Deposit', async (user, amount, timestamp, event) => {
    console.log('Deposit event:', { user, amount: amount.toString(), timestamp });
    eventBus.emitBlockchainSync('deposit', {
      user: user.toLowerCase(),
      amount: ethers.formatEther(amount),
      timestamp: Number(timestamp),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });

  // Listen to Withdraw events
  contract.on('Withdraw', async (user, amount, timestamp, event) => {
    console.log('Withdraw event:', { user, amount: amount.toString(), timestamp });
    eventBus.emitBlockchainSync('withdraw', {
      user: user.toLowerCase(),
      amount: ethers.formatEther(amount),
      timestamp: Number(timestamp),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });

  // Listen to Transfer events
  contract.on('Transfer', async (from, to, amount, timestamp, event) => {
    console.log('Transfer event:', { from, to, amount: amount.toString(), timestamp });
    eventBus.emitBlockchainSync('transfer', {
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      amount: ethers.formatEther(amount),
      timestamp: Number(timestamp),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });

  // Listen to UserRegistered events
  contract.on('UserRegistered', async (user, timestamp, event) => {
    console.log('UserRegistered event:', { user, timestamp });
    eventBus.emitBlockchainSync('userRegistered', {
      user: user.toLowerCase(),
      timestamp: Number(timestamp),
      txHash: event.transactionHash,
      blockNumber: event.blockNumber
    });
  });
};

export const getContract = () => {
  return contract;
};

export const getProvider = () => {
  return provider;
};

export const getOnChainBalance = async (walletAddress) => {
  if (!contract || !walletAddress) return '0';
  try {
    const balance = await contract.balances(walletAddress);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting on-chain balance:', error);
    return '0';
  }
};

export const isUserRegisteredOnChain = async (walletAddress) => {
  if (!contract || !walletAddress) return false;
  try {
    return await contract.isRegistered(walletAddress);
  } catch (error) {
    console.error('Error checking on-chain registration:', error);
    return false;
  }
};

