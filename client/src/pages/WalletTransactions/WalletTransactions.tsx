/**
 * Wallet Transactions page - Full transaction history
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../config/routes';
import { formatCurrency, formatDate } from '../../utils/format';
import { MOCK_ALL_TRANSACTIONS } from '../../utils';

// ============================================================================
// Types
// ============================================================================

interface Transaction {
  id: string;
  type: 'deposit' | 'purchase' | 'refund' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  courseId?: string;
}

// ============================================================================
// Component
// ============================================================================

export const WalletTransactions = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'deposits' | 'purchases' | 'refunds'>('all');

  const allTransactions: Transaction[] = MOCK_ALL_TRANSACTIONS;

  const filteredTransactions = allTransactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'deposits') return transaction.type === 'deposit';
    if (filter === 'purchases') return transaction.type === 'purchase';
    if (filter === 'refunds') return transaction.type === 'refund';
    return true;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return '+';
      case 'purchase': return '-';
      case 'refund': return '↩';
      case 'withdrawal': return '↓';
      default: return '•';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };


  const totalIncome = allTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(allTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(ROUTES.WALLET)}
              className="text-gray-400 hover:text-gray-600"
            >
              ← Back to Wallet
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-gray-600">Complete record of all your wallet transactions</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(totalIncome)}</div>
            <div className="text-sm text-green-700">Total Income</div>
          </Card>

          <Card className="text-center bg-red-50 border-red-200">
            <div className="text-2xl font-bold text-red-600 mb-1">{formatCurrency(totalExpenses)}</div>
            <div className="text-sm text-red-700">Total Expenses</div>
          </Card>

          <Card className="text-center bg-blue-50 border-blue-200">
            <div className={`text-2xl font-bold mb-1 ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </div>
            <div className="text-sm text-blue-700">Net Balance</div>
          </Card>

          <Card className="text-center bg-purple-50 border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">{allTransactions.length}</div>
            <div className="text-sm text-purple-700">Total Transactions</div>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Transactions
            </Button>
            <Button
              variant={filter === 'deposits' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('deposits')}
            >
              Deposits
            </Button>
            <Button
              variant={filter === 'purchases' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('purchases')}
            >
              Purchases
            </Button>
            <Button
              variant={filter === 'refunds' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('refunds')}
            >
              Refunds
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {filter === 'all' ? 'All Transactions' :
             filter === 'deposits' ? 'Deposit History' :
             filter === 'purchases' ? 'Purchase History' : 'Refund History'}
            ({filteredTransactions.length})
          </h2>

          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${
                    transaction.type === 'deposit' ? 'bg-green-100 text-green-700' :
                    transaction.type === 'purchase' ? 'bg-red-100 text-red-700' :
                    transaction.type === 'refund' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.courseId && (
                        <>
                          <span>•</span>
                          <span className="text-primary">Course #{transaction.courseId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-semibold text-lg ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status === 'completed' ? 'Completed' :
                     transaction.status === 'pending' ? 'Processing' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">◉</span>
              </div>
              <p className="text-gray-600">
                {filter === 'all' ? 'No transactions yet' :
                 `No ${filter.slice(0, -1)}${filter === 'refunds' ? '' : 's'} found`}
              </p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8 bg-gray-50 border-gray-200">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Want to see your courses too?</h3>
            <p className="text-gray-600 mb-4">View all your purchased courses</p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.WALLET_COURSES)}
            >
              View Courses
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
