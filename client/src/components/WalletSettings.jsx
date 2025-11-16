import { useState } from 'react';
import useAccountStore from '../store/accountStore.js';

export default function WalletSettings({ onClose, onComplete }) {
  const [walletAddress, setWalletAddress] = useState('');
  const { updateWalletAddress, account, loading, error } = useAccountStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateWalletAddress(walletAddress);
      onComplete();
      onClose();
    } catch (err) {

    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Wallet Settings</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {account?.user?.walletAddress && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 mb-1">Current Wallet Address:</p>
            <p className="text-sm font-mono break-all">{account.user.walletAddress}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {account?.user?.walletAddress ? 'Update' : 'Set'} Wallet Address
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your Ethereum wallet address to enable on-chain transactions
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

