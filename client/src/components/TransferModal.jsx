import { useState, useEffect } from 'react';
import useTransactionStore from '../store/transactionStore.js';
import api from '../utils/api.js';

export default function TransferModal({ onClose, onComplete }) {
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [source, setSource] = useState('offchain');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { createTransfer, loading, error } = useTransactionStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        try {
          const response = await api.get('/accounts/users');
          setUsers(response.data);
        } catch (err) {
          console.log('User list not available, using manual entry');
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientId) {
      alert('Please select a recipient');
      return;
    }
    try {
      await createTransfer(recipientId, parseFloat(amount), source);
      onComplete();
      onClose();
    } catch (err) {

    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Transfer Funds</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient {users.length > 0 ? '(Select from list)' : '(Enter User ID)'}
            </label>
            {loadingUsers ? (
              <div className="text-gray-500">Loading users...</div>
            ) : users.length > 0 ? (
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={recipientId}
                onChange={(e) => {
                  setRecipientId(e.target.value);
                  const selected = users.find(u => u._id === e.target.value);
                  setRecipientEmail(selected?.email || '');
                }}
                required
              >
                <option value="">Select recipient</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Enter recipient user ID"
                required
              />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="offchain">Off-Chain</option>
              <option value="onchain">On-Chain (Blockchain)</option>
            </select>
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
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

