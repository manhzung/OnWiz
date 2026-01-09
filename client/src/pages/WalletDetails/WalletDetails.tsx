/**
 * Wallet Details page - Full wallet information and history
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import CourseCard from '../../components/common/CourseCard';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../config/routes';
import type { PurchasedCourse } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { MOCK_BALANCE, MOCK_ALL_COURSES, MOCK_ALL_TRANSACTIONS } from '../../utils';

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

export const WalletDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'transactions'>('courses');
  const [balance] = useState(MOCK_BALANCE);

  const purchasedCourses: PurchasedCourse[] = MOCK_ALL_COURSES;

  const allTransactions: Transaction[] = MOCK_ALL_TRANSACTIONS;

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
      <div className="max-w-8xl mx-auto px-6 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Wallet Details</h1>
              <p className="text-gray-600">Complete overview of your purchases and transactions</p>
            </div>
          </div>
        </div>

        {/* Balance Summary */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Balance</h2>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(balance)}
              </p>
              <p className="text-sm text-gray-600">Available for course purchases</p>
            </div>
            <Link to={ROUTES.DEPOSIT}>
              <Button variant="primary" size="lg">
                Top Up Balance
              </Button>
            </Link>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Purchased Courses ({purchasedCourses.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'transactions'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Transaction History ({allTransactions.length})
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Purchased Courses</h2>
              <span className="text-sm text-gray-600">
                Total spent: {formatCurrency(purchasedCourses.reduce((sum, course) => sum + course.price, 0))}
              </span>
            </div>

            {purchasedCourses.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No purchased courses</h3>
                <p className="text-gray-600 mb-4">Start learning by purchasing your first course</p>
                <Link to={ROUTES.COURSES}>
                  <Button variant="primary">Browse Courses</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedCourses.map((course) => (
                  <div key={course.id}>
                    <CourseCard
                      to={`${ROUTES.COURSE.replace(':id', course.id)}`}
                      title={course.title}
                      provider={(course as any).provider ?? course.instructor?.split?.(' ')?.[0]}
                      instructor={course.instructor}
                      rating={4.5}
                      students={course.students}
                      level={course.level}
                      duration={course.duration}
                      price={course.price}
                      progress={course.progress}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">
                  Total transactions: {allTransactions.length}
                </span>
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-green-600">
                  Income: {formatCurrency(allTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0))}
                </span>
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-red-600">
                  Expenses: {formatCurrency(Math.abs(allTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)))}
                </span>
              </div>
            </div>

            <Card>
              <div className="space-y-4">
                {allTransactions.map((transaction) => (
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

              {allTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">◉</span>
                  </div>
                  <p className="text-gray-600">No transactions yet</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
