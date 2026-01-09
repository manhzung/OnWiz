/**
 * Wallet Courses page - Full list of purchased courses
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../config/routes';
import { PurchasedCourse } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { MOCK_ALL_COURSES } from '../../utils';

// ============================================================================
// Component
// ============================================================================

export const WalletCourses = () => {
  const navigate = useNavigate();

  const purchasedCourses: PurchasedCourse[] = MOCK_ALL_COURSES;


  const totalSpent = purchasedCourses.reduce((sum, course) => sum + course.price, 0);
  const completedCourses = purchasedCourses.filter(course => course.progress === 100).length;
  const inProgressCourses = purchasedCourses.filter(course => course.progress > 0 && course.progress < 100).length;

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
              <h1 className="text-3xl font-bold text-gray-900">My Purchased Courses</h1>
              <p className="text-gray-600">All courses you have purchased and enrolled in</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center bg-blue-50 border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{purchasedCourses.length}</div>
            <div className="text-sm text-blue-700">Total Courses</div>
          </Card>

          <Card className="text-center bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{completedCourses}</div>
            <div className="text-sm text-green-700">Completed</div>
          </Card>

          <Card className="text-center bg-yellow-50 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{inProgressCourses}</div>
            <div className="text-sm text-yellow-700">In Progress</div>
          </Card>

          <Card className="text-center bg-purple-50 border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">{formatCurrency(totalSpent)}</div>
            <div className="text-sm text-purple-700">Total Spent</div>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Courses</h2>

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
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="h-[160px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-400">
                        {course.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.progress === 100 ? 'bg-green-100 text-green-700' :
                        course.progress > 50 ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {course.progress === 100 ? 'Completed' :
                         course.progress > 0 ? 'In Progress' : 'Not Started'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>

                    {course.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Purchased: {formatDate(course.purchaseDate)}</span>
                      <span className="font-semibold text-primary">{formatCurrency(course.price)}</span>
                    </div>

                    <div className="mt-3">
                      <Link to={`/learn/${course.id}`}>
                        <Button variant="outline" size="sm" fullWidth>
                          {course.progress === 100 ? 'Review Course' :
                           course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-50 border-gray-200">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Need to see transactions too?</h3>
            <p className="text-gray-600 mb-4">View your complete transaction history</p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.WALLET_TRANSACTIONS)}
            >
              View Transactions
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
