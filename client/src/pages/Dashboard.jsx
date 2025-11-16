import { useState, useEffect } from 'react';
import useAccountStore from '../store/accountStore.js';
import useTransactionStore from '../store/transactionStore.js';
import DepositModal from '../components/DepositModal.jsx';
import WithdrawModal from '../components/WithdrawModal.jsx';
import TransferModal from '../components/TransferModal.jsx';
import TransactionHistory from '../components/TransactionHistory.jsx';
import WalletSettings from '../components/WalletSettings.jsx';

export default function Dashboard() {
  const { account, fetchAccount, loading: accountLoading } = useAccountStore();
  const { transactions, fetchTransactions, loading: transactionsLoading } = useTransactionStore();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showWalletSettings, setShowWalletSettings] = useState(false);

  useEffect(() => {
    fetchAccount();
    fetchTransactions();
  }, []);

  const handleTransactionComplete = () => {
    fetchAccount();
    fetchTransactions();
  };

  if (accountLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading account...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your banking operations</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">User ID</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-gray-900 break-all flex-1">{account?.user?.id || 'N/A'}</p>
              {account?.user?.id && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(account.user.id);
                    alert('User ID copied to clipboard!');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50 transition"
                  title="Copy User ID"
                >
                  Copy
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
            <p className="text-sm text-gray-900">{account?.user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
            <p className="text-sm text-gray-900 capitalize">{account?.user?.role || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Off-Chain Balance</h3>
          <p className="text-3xl font-bold text-blue-600">
            ${account?.balances?.offChain?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">On-Chain Balance</h3>
          <p className="text-3xl font-bold text-green-600">
            ${account?.balances?.onChain?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Balance</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${account?.balances?.total?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      {account?.user?.walletAddress && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Wallet Address</h3>
          <p className="text-sm font-mono text-gray-800 break-all">
            {account.user.walletAddress}
          </p>
          {account.isRegisteredOnChain && (
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              Registered on Blockchain
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setShowDeposit(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Deposit
        </button>
        <button
          onClick={() => setShowWithdraw(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Withdraw
        </button>
        <button
          onClick={() => setShowTransfer(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Transfer
        </button>
        <button
          onClick={() => setShowWalletSettings(true)}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Wallet Settings
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
        </div>
        <TransactionHistory transactions={transactions} loading={transactionsLoading} />
      </div>

      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onComplete={handleTransactionComplete}
        />
      )}
      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          onComplete={handleTransactionComplete}
        />
      )}
      {showTransfer && (
        <TransferModal
          onClose={() => setShowTransfer(false)}
          onComplete={handleTransactionComplete}
        />
      )}
      {showWalletSettings && (
        <WalletSettings
          onClose={() => setShowWalletSettings(false)}
          onComplete={handleTransactionComplete}
        />
      )}
    </div>
  );
}
