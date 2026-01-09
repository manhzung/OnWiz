/**
 * Notifications page - View all notifications
 */

import React, { useState } from 'react';

// ============================================================================
// Types
// ============================================================================

interface Notification {
  id: string;
  type: 'enrollment' | 'quiz_completed' | 'course_completed' | 'payment' | 'system' | 'social';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  sender?: {
    name: string;
    avatar: string;
  };
}

// ============================================================================
// Component
// ============================================================================

export const Notifications = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'enrollment',
      title: 'New Student Enrolled',
      message: 'Sarah Johnson has enrolled in your course "Web Development from A to Z"',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z',
      actionUrl: '/creator',
      sender: { name: 'Sarah Johnson', avatar: 'S' }
    },
    {
      id: '2',
      type: 'quiz_completed',
      title: 'Quiz Completed',
      message: 'Mike Davis completed your quiz "Math Quiz - Algebra Basics" with score 85%',
      isRead: false,
      createdAt: '2024-01-15T09:15:00Z',
      actionUrl: '/creator',
      sender: { name: 'Mike Davis', avatar: 'M' }
    },
    {
      id: '3',
      type: 'course_completed',
      title: 'Course Completed',
      message: 'Congratulations! John Smith has completed your course "Advanced Mathematics - Calculus"',
      isRead: true,
      createdAt: '2024-01-14T16:45:00Z',
      actionUrl: '/creator',
      sender: { name: 'John Smith', avatar: 'J' }
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $25.00 from course enrollment: "English Communication"',
      isRead: true,
      createdAt: '2024-01-14T14:20:00Z',
      actionUrl: '/wallet'
    },
    {
      id: '5',
      type: 'social',
      title: 'New Follower',
      message: 'Emily Wilson started following you',
      isRead: true,
      createdAt: '2024-01-13T11:00:00Z',
      sender: { name: 'Emily Wilson', avatar: 'E' }
    },
    {
      id: '6',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST',
      isRead: true,
      createdAt: '2024-01-12T08:30:00Z'
    },
    {
      id: '7',
      type: 'enrollment',
      title: 'New Student Enrolled',
      message: 'David Brown has enrolled in your course "Advanced Mathematics - Calculus"',
      isRead: true,
      createdAt: '2024-01-11T13:45:00Z',
      actionUrl: '/creator',
      sender: { name: 'David Brown', avatar: 'D' }
    },
    {
      id: '8',
      type: 'quiz_completed',
      title: 'Quiz Completed',
      message: 'Alex Chen completed your quiz "Programming Quiz - JavaScript Basics" with score 92%',
      isRead: true,
      createdAt: '2024-01-10T15:30:00Z',
      actionUrl: '/creator',
      sender: { name: 'Alex Chen', avatar: 'A' }
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return 'EN';
      case 'quiz_completed': return 'QC';
      case 'course_completed': return 'CC';
      case 'payment': return '$$';
      case 'social': return 'SO';
      case 'system': return 'SY';
      default: return 'NT';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'bg-blue-100 text-blue-800';
      case 'quiz_completed': return 'bg-green-100 text-green-800';
      case 'course_completed': return 'bg-purple-100 text-purple-800';
      case 'payment': return 'bg-yellow-100 text-yellow-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'bg-blue-100';
      case 'quiz_completed': return 'bg-green-100';
      case 'course_completed': return 'bg-purple-100';
      case 'payment': return 'bg-yellow-100';
      case 'social': return 'bg-pink-100';
      case 'system': return 'bg-gray-100';
      default: return 'bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'Stay updated with your latest activities'
              }
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'read'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Read ({notifications.filter(n => n.isRead).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold">NT</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread'
                  ? 'All caught up! Check back later for new updates.'
                  : 'Notifications will appear here when you have new activities.'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const isExpanded = expandedId === notification.id;

              return (
                <div
                  key={notification.id}
                  className={`bg-white border border-gray-200 rounded-lg transition-all duration-200 ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                  } ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}`}
                >
                  {/* Compact Header - Always Visible */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setExpandedId(isExpanded ? null : notification.id);
                      // Mark as read when expanding (only if unread and not already expanded)
                      if (!notification.isRead && !isExpanded) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${getIconBgColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Compact Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className={`font-medium text-sm truncate flex-1 ${
                            notification.isRead ? 'text-gray-900' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>

                          {/* Mobile: Show only essential info */}
                          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                              {notification.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>

                          {/* Mobile: Show minimal info */}
                          <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>

                          {/* Expand Icon */}
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {/* Mobile: Show type badge below */}
                        <div className="sm:hidden mt-1">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-3">
                        {/* Full Message */}
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        {/* Additional Info */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            {notification.sender && (
                              <span>From: <span className="font-medium">{notification.sender.name}</span></span>
                            )}
                            <span>{formatDate(notification.createdAt)}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Navigate to:', notification.actionUrl);
                                }}
                                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                View Details
                              </button>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="px-3 py-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
