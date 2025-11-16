export default function TransactionHistory({ transactions, loading }) {
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading transactions...
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No transactions found
      </div>
    );
  }

  const getTypeColor = (type, isReceived) => {
    if (isReceived) return 'text-green-600';
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'withdraw':
        return 'text-red-600';
      case 'transfer':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeLabel = (type, isReceived) => {
    if (isReceived) return 'Received';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700';
      case 'pending': return 'text-yellow-700';
      case 'processing': return 'text-blue-700';
      case 'failed': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((t) => {
            const isReceived = t.isReceived;
            const amount = `${isReceived ? '+' : '-'}$${t.amount.toFixed(2)}`;

            return (
              <tr key={t._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`${getTypeColor(t.type, isReceived)} font-medium`}>
                    {getTypeLabel(t.type, isReceived)}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={isReceived ? 'text-green-600' : 'text-red-600'}>
                    {amount}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={getStatusColor(t.status)}>
                    {t.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={t.source === 'onchain' ? 'text-green-600' : 'text-blue-600'}>
                    {t.source === 'onchain' ? 'On-Chain' : 'Off-Chain'}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(t.createdAt).toLocaleString()}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {isReceived && t.userId ? (
                    <div>From: {t.userId.email || 'N/A'}</div>
                  ) : t.recipientId ? (
                    <div>To: {t.recipientId.email || 'N/A'}</div>
                  ) : null}

                  {t.txHash && (
                    <div className="text-xs font-mono">
                      TX: {t.txHash.substring(0, 10)}...
                    </div>
                  )}

                  {t.error && (
                    <div className="text-xs text-red-700">
                      Error: {t.error}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
