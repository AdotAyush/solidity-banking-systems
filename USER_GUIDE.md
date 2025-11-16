# User Guide - Distributed Banking System

This guide will walk you through all the features and how to use them in the banking application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding Your Account](#understanding-your-account)
3. [Setting Up Your Wallet](#setting-up-your-wallet)
4. [Depositing Funds](#depositing-funds)
5. [Withdrawing Funds](#withdrawing-funds)
6. [Transferring Funds](#transferring-funds)
7. [Viewing Transaction History](#viewing-transaction-history)
8. [Understanding Balances](#understanding-balances)
9. [On-Chain vs Off-Chain Transactions](#on-chain-vs-off-chain-transactions)
10. [Admin Features](#admin-features)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Creating an Account

1. **Navigate to the application** (usually http://localhost:3000)
2. **Click "Sign up"** or navigate to the signup page
3. **Enter your details:**
   - Email address (this will be your username)
   - Password (minimum 6 characters)
4. **Click "Sign up"**
5. You'll be automatically logged in and redirected to your dashboard

### Logging In

1. **Navigate to the login page**
2. **Enter your credentials:**
   - Email address
   - Password
3. **Click "Sign in"**
4. You'll be redirected to your dashboard

### Logging Out

- Click the **"Logout"** button in the top-right corner of the navigation bar

---

## Understanding Your Account

### Dashboard Overview

When you log in, you'll see your **Dashboard** which displays:

1. **Three Balance Cards:**
   - **Off-Chain Balance**: Funds stored in the database (traditional banking)
   - **On-Chain Balance**: Funds stored on the blockchain (Ethereum smart contract)
   - **Total Balance**: Sum of both balances

2. **Wallet Address** (if set): Your Ethereum wallet address for blockchain transactions

3. **Action Buttons:**
   - Deposit
   - Withdraw
   - Transfer
   - Wallet Settings

4. **Transaction History**: A table showing all your past transactions

---

## Setting Up Your Wallet

### Why You Need a Wallet Address

To perform **on-chain transactions** (blockchain operations), you need to set up an Ethereum wallet address. This allows the system to:
- Register you on the blockchain
- Track your on-chain balance
- Process blockchain deposits, withdrawals, and transfers

### How to Set Up Your Wallet

1. **Click "Wallet Settings"** on your dashboard
2. **Enter your Ethereum wallet address** (starts with `0x...`)
3. **Click "Save"**

**Where to get a wallet address:**
- If using Hardhat for local development, use one of the accounts shown when you start `npx hardhat node`
- For production, use MetaMask or any Ethereum wallet
- Example format: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

**Note:** You can update your wallet address at any time, but make sure it's a valid Ethereum address.

---

## Depositing Funds

### Off-Chain Deposit (Traditional Banking)

**What it does:** Adds funds to your off-chain balance stored in the database.

**When to use:**
- Quick deposits without blockchain fees
- Testing the system
- When you don't need blockchain verification

**How to deposit off-chain:**

1. **Click "Deposit"** on your dashboard
2. **Enter the amount** you want to deposit (e.g., 100.50)
3. **Select "Off-Chain"** from the Source dropdown
4. **Click "Deposit"**
5. Your off-chain balance will update immediately
6. The transaction will appear in your transaction history with status "completed"

**Requirements:**
- No wallet address needed
- No blockchain connection needed
- Instant processing

---

### On-Chain Deposit (Blockchain)

**What it does:** Adds funds to your on-chain balance stored in the smart contract.

**When to use:**
- When you want blockchain verification
- For transparent, immutable transaction records
- When you need to interact with other blockchain services

**How to deposit on-chain:**

**Prerequisites:**
- ✅ Wallet address must be set in Wallet Settings
- ✅ You must be registered on the blockchain (see below)
- ✅ You need ETH in your wallet to pay for gas fees
- ✅ The smart contract must be deployed and running

**Step 1: Register on Blockchain (First Time Only)**

Before your first on-chain deposit, you need to register your wallet on the blockchain:

1. **Set your wallet address** in Wallet Settings (if not already done)
2. **Use a blockchain wallet** (like MetaMask) or Hardhat account
3. **Connect to the local Hardhat network** (or your network)
4. **Call the `registerUser()` function** on the Bank contract with your wallet address
   - Contract address: Available in the blockchain info endpoint
   - You can use Remix, Hardhat console, or a frontend wallet interface

**Step 2: Deposit ETH to Contract**

1. **Click "Deposit"** on your dashboard
2. **Enter the amount** you want to deposit
3. **Select "On-Chain (Blockchain)"** from the Source dropdown
4. **Click "Deposit"**
5. **Approve the transaction** in your wallet (MetaMask, etc.)
6. **Wait for blockchain confirmation** (usually a few seconds on local network)
7. Your on-chain balance will update automatically
8. The transaction will appear in history with a transaction hash (TX)

**Note:** On-chain deposits require you to send ETH directly to the smart contract. The backend listens to blockchain events and syncs them to your account.

---

## Withdrawing Funds

### Off-Chain Withdrawal

**What it does:** Removes funds from your off-chain balance.

**When to use:**
- Quick withdrawals
- When you don't need blockchain verification

**How to withdraw off-chain:**

1. **Click "Withdraw"** on your dashboard
2. **Enter the amount** you want to withdraw
3. **Select "Off-Chain"** from the Source dropdown
4. **Click "Withdraw"**
5. The system checks if you have sufficient balance
6. If successful, your off-chain balance decreases
7. Transaction appears in history with status "completed"

**Requirements:**
- Sufficient off-chain balance
- Amount must be greater than 0

**Error Messages:**
- "Insufficient balance": You don't have enough funds in your off-chain account

---

### On-Chain Withdrawal

**What it does:** Removes funds from your on-chain balance (blockchain) and sends them to your wallet.

**When to use:**
- When you want to move funds from blockchain to your wallet
- For blockchain-verified withdrawals

**How to withdraw on-chain:**

**Prerequisites:**
- ✅ Wallet address must be set
- ✅ You must be registered on the blockchain
- ✅ Sufficient on-chain balance
- ✅ You need ETH for gas fees

**Steps:**

1. **Click "Withdraw"** on your dashboard
2. **Enter the amount** you want to withdraw
3. **Select "On-Chain (Blockchain)"** from the Source dropdown
4. **Click "Withdraw"**
5. **Approve the transaction** in your wallet
6. **Wait for blockchain confirmation**
7. ETH will be sent to your wallet address
8. Your on-chain balance decreases
9. Transaction appears in history with transaction hash

**Note:** On-chain withdrawals require calling the smart contract's `withdraw()` function, which sends ETH from the contract to your wallet.

---

## Transferring Funds

### What is a Transfer?

A transfer moves funds from your account to another user's account in the system.

### Off-Chain Transfer

**What it does:** Transfers funds from your off-chain balance to another user's off-chain balance.

**How to transfer off-chain:**

1. **Click "Transfer"** on your dashboard
2. **Select or enter recipient:**
   - If you're an admin, you'll see a dropdown of all users
   - If you're a regular user, enter the recipient's User ID
   - You can find User IDs by asking the recipient or checking admin panel
3. **Enter the amount** you want to transfer
4. **Select "Off-Chain"** from the Source dropdown
5. **Click "Transfer"**
6. The system checks your balance
7. If successful:
   - Your off-chain balance decreases
   - Recipient's off-chain balance increases
   - Both users see the transaction in their history
8. Transaction status: "completed"

**Requirements:**
- Sufficient off-chain balance
- Valid recipient User ID
- Cannot transfer to yourself

**Error Messages:**
- "Insufficient balance": You don't have enough funds
- "Recipient not found": Invalid User ID
- "Cannot transfer to yourself": Self-transfers not allowed

---

### On-Chain Transfer

**What it does:** Transfers funds from your on-chain balance to another user's on-chain balance on the blockchain.

**How to transfer on-chain:**

**Prerequisites:**
- ✅ Wallet address must be set
- ✅ Recipient must have wallet address set
- ✅ Both users must be registered on the blockchain
- ✅ Sufficient on-chain balance
- ✅ ETH for gas fees

**Steps:**

1. **Click "Transfer"** on your dashboard
2. **Select or enter recipient** (they must have a wallet address set)
3. **Enter the amount** you want to transfer
4. **Select "On-Chain (Blockchain)"** from the Source dropdown
5. **Click "Transfer"**
6. **Approve the transaction** in your wallet
7. **Wait for blockchain confirmation**
8. The smart contract transfers funds between wallets
9. Both users' on-chain balances update
10. Transaction appears in both users' history with transaction hash

**Note:** On-chain transfers require calling the smart contract's `transfer()` function, which moves ETH between registered users on the blockchain.

---

## Viewing Transaction History

### Transaction History Table

Your dashboard shows a **Transaction History** table with all your transactions.

### Understanding Transaction Columns

1. **Type:**
   - **Deposit**: Funds added to your account
   - **Withdraw**: Funds removed from your account
   - **Transfer**: Funds sent to or received from another user

2. **Amount:** The transaction amount in dollars

3. **Status:**
   - **Pending**: Transaction is queued, waiting to be processed
   - **Processing**: Transaction is being processed
   - **Completed**: Transaction successfully completed
   - **Failed**: Transaction failed (check error message)

4. **Source:**
   - **On-Chain**: Blockchain transaction (has transaction hash)
   - **Off-Chain**: Database transaction (traditional)

5. **Date:** When the transaction was created

6. **Details:**
   - **Recipient**: For transfers, shows recipient email
   - **TX Hash**: For on-chain transactions, shows blockchain transaction hash
   - **Error**: If transaction failed, shows error message

### Transaction Status Flow

1. **Pending** → Transaction created, added to queue
2. **Processing** → Worker is processing the transaction
3. **Completed** → Transaction successful, balances updated
4. **Failed** → Transaction failed, check error message

### Filtering and Searching

Currently, transactions are shown in reverse chronological order (newest first). The system shows the last 50 transactions by default.

---

## Understanding Balances

### Three Types of Balances

Your dashboard shows three balance cards:

1. **Off-Chain Balance (Blue Card)**
   - Funds stored in the database
   - Updated instantly
   - No blockchain fees
   - Traditional banking model

2. **On-Chain Balance (Green Card)**
   - Funds stored in the smart contract
   - Requires blockchain confirmation
   - Immutable and transparent
   - May have gas fees

3. **Total Balance (Purple Card)**
   - Sum of off-chain + on-chain balances
   - Your complete account value

### How Balances Update

- **Off-Chain Transactions:** Update immediately
- **On-Chain Transactions:** Update after blockchain confirmation (usually a few seconds)
- **Automatic Sync:** The system automatically syncs blockchain events to update your on-chain balance

### Balance Verification

- **Off-Chain:** Stored in MongoDB database
- **On-Chain:** Stored in Ethereum smart contract (queryable via blockchain)
- Both are displayed together for a complete view

---

## On-Chain vs Off-Chain Transactions

### Comparison Table

| Feature | Off-Chain | On-Chain |
|---------|-----------|----------|
| **Speed** | Instant | Few seconds (blockchain confirmation) |
| **Fees** | None | Gas fees (ETH) |
| **Verification** | Database | Blockchain (immutable) |
| **Transparency** | Private | Public (on blockchain) |
| **Wallet Required** | No | Yes |
| **Registration** | Automatic | Manual (registerUser) |
| **Use Case** | Quick transactions | Verified, transparent transactions |

### When to Use Off-Chain

✅ Quick deposits/withdrawals  
✅ Testing and development  
✅ No need for blockchain verification  
✅ Avoiding gas fees  
✅ Private transactions  

### When to Use On-Chain

✅ Need blockchain verification  
✅ Want immutable transaction records  
✅ Transparent, auditable transactions  
✅ Interacting with other blockchain services  
✅ Long-term record keeping  

### Mixed Strategy

You can use both:
- Keep some funds off-chain for quick access
- Keep some funds on-chain for verification
- Transfer between them as needed

---

## Admin Features

### Admin Account

If you have an **admin role**, you have access to additional features:

### View All Users

1. Navigate to admin panel (if implemented)
2. View list of all registered users
3. See user details (email, role, balances)

### View All Transactions

1. Access the transactions endpoint
2. View transactions from all users
3. Monitor system activity

### User Management

- View user accounts
- Check user balances
- Review transaction history for any user

**Note:** Admin features are accessed through the API endpoints. A full admin UI can be built using the same endpoints.

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Wallet address not set" Error

**Problem:** Trying to perform on-chain transaction without wallet address.

**Solution:**
- Go to Wallet Settings
- Enter your Ethereum wallet address
- Save and try again

---

#### 2. "User not registered on blockchain" Error

**Problem:** Wallet address is set, but not registered on the smart contract.

**Solution:**
- Register your wallet on the blockchain first
- Call `registerUser(yourWalletAddress)` on the Bank contract
- Use Remix, Hardhat console, or a wallet interface

---

#### 3. "Insufficient balance" Error

**Problem:** Trying to withdraw/transfer more than available.

**Solution:**
- Check your balance on the dashboard
- Make sure you're using the correct source (on-chain vs off-chain)
- Deposit more funds if needed

---

#### 4. "Blockchain not available" Error

**Problem:** Backend can't connect to blockchain.

**Solution:**
- Ensure Hardhat node is running: `npx hardhat node`
- Check `BLOCKCHAIN_RPC_URL` in server `.env` file
- Verify contract address is set correctly

---

#### 5. Transaction Stuck in "Pending" Status

**Problem:** Transaction not processing.

**Solution:**
- Wait a few seconds (worker processes asynchronously)
- Check server logs for errors
- Refresh the page
- If still stuck, check transaction error message

---

#### 6. On-Chain Balance Not Updating

**Problem:** Blockchain transaction completed but balance not updated.

**Solution:**
- Wait a few seconds for event sync
- Refresh the dashboard
- Check if transaction appears in history
- Verify blockchain event listener is running

---

#### 7. "Invalid recipient" Error

**Problem:** Transfer recipient not found.

**Solution:**
- Verify recipient User ID is correct
- Ensure recipient has an account
- For on-chain transfers, recipient must have wallet address set

---

#### 8. Cannot See Other Users in Transfer

**Problem:** Transfer modal shows "Enter User ID" instead of dropdown.

**Solution:**
- This is normal for non-admin users
- Ask the recipient for their User ID
- Or create an admin account to see all users

---

### Getting Help

1. **Check Transaction History:** Look for error messages in failed transactions
2. **Check Browser Console:** Open Developer Tools (F12) for frontend errors
3. **Check Server Logs:** Look at terminal where server is running
4. **Verify Setup:** Ensure MongoDB and blockchain are running
5. **Check Environment Variables:** Verify `.env` file is configured correctly

---

## Best Practices

### Security

1. **Never share your password**
2. **Use strong passwords** (minimum 6 characters, but longer is better)
3. **Keep your wallet private key secure** (if using real wallets)
4. **Log out** when using shared computers

### Transaction Management

1. **Start with small amounts** when testing
2. **Check balances** before large transactions
3. **Verify recipient details** before transferring
4. **Keep transaction hashes** for on-chain transactions (for records)

### Performance

1. **Use off-chain** for quick, frequent transactions
2. **Use on-chain** for important, verified transactions
3. **Monitor your balances** regularly
4. **Check transaction history** to track activity

---

## Quick Reference

### Transaction Requirements

| Transaction Type | Wallet Address | Blockchain Registration | Gas Fees |
|-----------------|----------------|-------------------------|----------|
| Off-Chain Deposit | ❌ No | ❌ No | ❌ No |
| On-Chain Deposit | ✅ Yes | ✅ Yes | ✅ Yes |
| Off-Chain Withdraw | ❌ No | ❌ No | ❌ No |
| On-Chain Withdraw | ✅ Yes | ✅ Yes | ✅ Yes |
| Off-Chain Transfer | ❌ No | ❌ No | ❌ No |
| On-Chain Transfer | ✅ Yes (both users) | ✅ Yes (both users) | ✅ Yes |

### Status Meanings

- **Pending**: Waiting in queue
- **Processing**: Currently being processed
- **Completed**: Successfully finished
- **Failed**: Error occurred (check error message)

### Balance Types

- **Off-Chain**: Database-stored, instant updates
- **On-Chain**: Blockchain-stored, requires confirmation
- **Total**: Sum of both

---

## Need More Help?

- Check the **README.md** for technical setup
- Review **SETUP.md** for installation instructions
- See **ENV_SETUP.md** for environment configuration
- Check server logs for detailed error messages
- Review transaction history for transaction-specific errors

---

**Last Updated:** This guide covers all features as of the current version. Features may be added or updated in future versions.

