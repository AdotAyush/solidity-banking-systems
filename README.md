# Distributed Banking System

A full-stack distributed banking system built with React, Node.js, Express, MongoDB, and Ethereum smart contracts. This system demonstrates a modern banking application with both on-chain (blockchain) and off-chain transaction capabilities.

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for modern, responsive UI
- **Zustand** for state management
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose for data persistence
- **JWT Authentication** (access + refresh tokens)
- **Role-based access control** (customer, admin)
- **Event-driven architecture** using Node EventEmitter
- **Transaction queueing** (in-memory, RabbitMQ-like)
- **Blockchain integration** via ethers.js

### Blockchain
- **Solidity** smart contracts
- **Hardhat** for development and testing
- **Bank.sol** contract with deposit, withdraw, transfer operations
- **Event listening** for syncing on-chain transactions to MongoDB

## 📁 Project Structure

```
project-banking-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── utils/         # Utilities (API client)
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── utils/         # Utilities (JWT, blockchain, event bus)
│   │   ├── workers/       # Transaction workers
│   │   ├── events/        # Event handlers
│   │   └── index.js       # Server entry point
│   ├── package.json
│   └── .env.example
│
├── blockchain/             # Smart contracts
│   ├── contracts/         # Solidity contracts
│   │   └── Bank.sol
│   ├── scripts/           # Deployment scripts
│   │   └── deploy.js
│   ├── test/              # Contract tests
│   │   └── Bank.test.js
│   ├── hardhat.config.js
│   └── package.json
│
├── package.json           # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or connection string)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-banking-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This will install dependencies for root, client, server, and blockchain.

3. **Set up environment variables**

   **Server (.env)**
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit `server/.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/banking-system
   ACCESS_TOKEN_SECRET=your-secret-key
   REFRESH_TOKEN_SECRET=your-refresh-secret-key
   BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
   BANK_CONTRACT_ADDRESS=your-contract-address
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

5. **Deploy Smart Contract**

   In a new terminal:
   ```bash
   # Start local Hardhat node
   cd blockchain
   npx hardhat node
   ```
   
   In another terminal:
   ```bash
   cd blockchain
   npm run deploy:local
   ```
   
   Copy the contract address from the output and add it to `server/.env`:
   ```env
   BANK_CONTRACT_ADDRESS=0x...
   ```

6. **Start the application**

   From the root directory:
   ```bash
   npm run dev
   ```
   
   This will start both the frontend (port 3000) and backend (port 5000) simultaneously.

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health check: http://localhost:5000/api/health

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Smart Contract Tests
```bash
cd blockchain
npm test
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user (requires auth)

### Accounts (`/api/accounts`)
- `GET /api/accounts/me` - Get current user account (requires auth)
- `PUT /api/accounts/wallet` - Update wallet address (requires auth)
- `GET /api/accounts/users` - Get all users (admin only)
- `GET /api/accounts/users/:id` - Get user by ID (admin only)

### Transactions (`/api/transactions`)
- `POST /api/transactions/deposit` - Create deposit (requires auth)
- `POST /api/transactions/withdraw` - Create withdrawal (requires auth)
- `POST /api/transactions/transfer` - Create transfer (requires auth)
- `GET /api/transactions` - Get user transactions (requires auth)
- `GET /api/transactions/all` - Get all transactions (admin only)
- `GET /api/transactions/:id` - Get transaction by ID (requires auth)

### Blockchain (`/api/blockchain`)
- `GET /api/blockchain/balance` - Get on-chain balance (requires auth)
- `POST /api/blockchain/register` - Register on-chain (requires auth)
- `GET /api/blockchain/info` - Get contract info (requires auth)

## 🔐 Authentication

The system uses JWT tokens for authentication:
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to refresh access tokens

Include the access token in requests:
```
Authorization: Bearer <access-token>
```

## 🔄 Distributed Architecture

### Event Bus
The system uses an internal event bus (Node EventEmitter) for:
- Transaction processing events
- Notification events
- Blockchain sync events

### Transaction Queue
Transactions are queued and processed asynchronously by worker services, simulating a distributed worker system.

### Blockchain Sync
The backend listens to smart contract events and automatically syncs them to MongoDB, providing a unified view of on-chain and off-chain transactions.

## 💼 Smart Contract

### Bank.sol Functions
- `registerUser(address)` - Register a user on the blockchain
- `deposit()` - Deposit ETH to the contract
- `withdraw(uint256)` - Withdraw ETH from the contract
- `transfer(address, uint256)` - Transfer ETH between users
- `getBalance(address)` - Get user's balance
- `isRegistered(address)` - Check if user is registered

### Events
- `UserRegistered` - Emitted when a user registers
- `Deposit` - Emitted on deposit
- `Withdraw` - Emitted on withdrawal
- `Transfer` - Emitted on transfer

## 🎨 Frontend Features

- **Login/Signup** - User authentication
- **Dashboard** - View balances (off-chain, on-chain, total)
- **Deposit** - Deposit funds (off-chain or on-chain)
- **Withdraw** - Withdraw funds (off-chain or on-chain)
- **Transfer** - Transfer funds to other users
- **Transaction History** - View all transactions (merged on-chain + off-chain)
- **Wallet Settings** - Set/update Ethereum wallet address

## 🔧 Development

### Adding New Features

1. **Backend**: Add routes in `server/src/routes/`, controllers in `server/src/controllers/`, and services in `server/src/services/`
2. **Frontend**: Add components in `client/src/components/` and pages in `client/src/pages/`
3. **Smart Contract**: Add functions in `blockchain/contracts/Bank.sol` and update tests

### Code Structure

- **Services**: Business logic and data operations
- **Controllers**: HTTP request handling
- **Models**: Database schemas
- **Middleware**: Authentication and authorization
- **Utils**: Reusable utilities (JWT, blockchain, event bus)

## 📖 Documentation

- **README.md** - This file (technical overview and setup)
- **SETUP.md** - Step-by-step setup instructions
- **ENV_SETUP.md** - Environment variables configuration guide
- **USER_GUIDE.md** - **Complete user guide with feature walkthroughs** ⭐
- **PROJECT_SUMMARY.md** - Project overview and completed components

**New users should read [USER_GUIDE.md](./USER_GUIDE.md) for detailed instructions on using all features.**

## 📝 Notes

- The blockchain integration requires a running Hardhat node
- On-chain transactions require users to have a wallet address set
- The system supports both on-chain and off-chain transactions
- Transaction queueing simulates distributed processing
- All on-chain events are automatically synced to MongoDB

## 🐛 Troubleshooting

1. **MongoDB connection error**: Ensure MongoDB is running and the connection string in `.env` is correct
2. **Blockchain not available**: Ensure Hardhat node is running and contract address is set in `.env`
3. **Port already in use**: Change ports in `server/.env` or `client/vite.config.js`
4. **CORS errors**: Check that the frontend proxy is configured correctly in `vite.config.js`

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 🙏 Acknowledgments

Built with:
- React
- Express.js
- MongoDB
- Hardhat
- Solidity
- TailwindCSS
- Zustand

