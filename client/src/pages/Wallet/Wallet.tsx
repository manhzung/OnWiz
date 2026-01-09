/**
 * Wallet page - User wallet management
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../config/routes';
import { formatCurrency } from '../../utils/format';
import { MOCK_BALANCE, MOCK_RECENT_COURSES, MOCK_RECENT_TRANSACTIONS } from '../../utils';

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
}

// ============================================================================
// Component
// ============================================================================

export const Wallet = () => {
  const navigate = useNavigate();
  const [balance] = useState(MOCK_BALANCE);

  // Use consistent mock data
  const recentCourses = MOCK_RECENT_COURSES.map(course => ({
    id: course.id,
    title: course.title,
    instructor: course.instructor,
    purchaseDate: course.purchaseDate,
    price: course.price,
    progress: course.progress,
  }));

  const recentTransactions: Transaction[] = MOCK_RECENT_TRANSACTIONS;

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


  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage balance and view recent activity</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Balance</h2>
              <p className="text-3xl font-bold text-green-600 mb-4">
                {formatCurrency(balance)}
              </p>
              <p className="text-sm text-gray-600">Available for course purchases</p>
            </div>
            <div className="flex gap-3">
              <Link to={ROUTES.DEPOSIT}>
                <Button variant="primary" size="lg">
                  +
                </Button>
              </Link>
            </div>
          </div>
        </Card>


        {/* Recent Purchased Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Purchased Courses</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.WALLET_COURSES)}
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-400">
                      {course.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">by {course.instructor}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Purchased: {new Date(course.purchaseDate).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="font-semibold text-primary">{formatCurrency(course.price)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.WALLET_TRANSACTIONS)}
            >
              View All
            </Button>
          </div>

          <Card>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-700' :
                      transaction.type === 'purchase' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-600">{transaction.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status === 'completed' ? 'Done' :
                       transaction.status === 'pending' ? 'Processing' : 'Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {recentTransactions.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">◉</span>
                </div>
                <p className="text-gray-600">No recent transactions</p>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};
