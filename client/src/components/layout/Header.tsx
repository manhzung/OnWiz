/**
 * Header component - Coursera style
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../hooks';
import { useSearch } from '../../contexts/SearchContext';
import { Button } from '../common/Button';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const location = useLocation();

  // Mock notifications count
  const unreadNotifications = 3;

  // Refs for dropdowns
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPlaceholder = () => {
    if (location.pathname.startsWith(ROUTES.COURSES)) {
      return "What do you want to learn?";
    }
    if (location.pathname.startsWith(ROUTES.DEGREES)) {
      return "Search degrees...";
    }
    if (location.pathname.startsWith(ROUTES.CLASSROOM)) {
      return "Search classrooms...";
    }
    if (location.pathname.startsWith(ROUTES.MY_LEARNING)) {
      return "Search your courses...";
    }
    return "Search...";
  };

  return (
    <>
      {/* Top Bar - For different user types */}
      <div className="w-full bg-primary-dark text-white py-2 text-sm">
        <div className="max-w-8xl mx-auto px-6 lg:px-24 xl:px-48 flex justify-center gap-8">
          <Link to={ROUTES.HOME} className="text-white/90 hover:text-white transition-colors duration-250">
            For Individuals
          </Link>
          <Link to={ROUTES.HOME} className="text-white/90 hover:text-white transition-colors duration-250">
            For Businesses
          </Link>
          <Link to={ROUTES.HOME} className="text-white/90 hover:text-white transition-colors duration-250">
            For Universities
          </Link>
          <Link to={ROUTES.HOME} className="text-white/90 hover:text-white transition-colors duration-250">
            For Governments
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-primary sticky top-0 z-[100] shadow-sm">
        <div className="max-w-8xl mx-auto px-6 lg:px-24 xl:px-48 py-4 flex items-center gap-6">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="text-white text-2xl font-bold no-underline flex-shrink-0">
          OnWiz
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 flex-shrink-0 max-lg:hidden">
          <Link
            to={ROUTES.COURSES}
            className="text-white/90 hover:text-white font-medium text-sm transition-colors duration-250 flex items-center gap-1 no-underline"
          >
            Explore
          </Link>
          <Link
            to={ROUTES.CLASSROOM}
            className="text-white/90 hover:text-white font-medium text-sm transition-colors duration-250 no-underline"
          >
            Classroom
          </Link>
          <Link
            to={ROUTES.MY_LEARNING}
            className="text-white/90 hover:text-white font-medium text-sm transition-colors duration-250 no-underline"
          >
            My Learning
          </Link>
          <Link
            to={ROUTES.CREATOR}
            className="text-white/90 hover:text-white font-medium text-sm transition-colors duration-250 no-underline"
          >
            Creator
          </Link>
          <Link
            to={ROUTES.DEGREES}
            className="text-white/90 hover:text-white font-medium text-sm transition-colors duration-250 no-underline"
          >
            Degrees
          </Link>
        </nav>

        {/* Search Bar - Centered */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-14 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button className="absolute right-2 w-9 h-9 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Globe Icon */}
          <button className="text-white/90 hover:text-white transition-colors duration-250 p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-white/90 hover:text-white transition-colors duration-250 p-2 relative"
            >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
          </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-[calc(100%+0.5rem)] right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[350px] max-h-[400px] overflow-y-auto z-[1000]">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <Link
                      to={ROUTES.NOTIFICATIONS}
                      className="text-primary hover:text-primary-hover text-sm font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all
                    </Link>
                  </div>
                </div>

                <div className="py-2">
                  {/* Mock notifications */}
                  <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">
                        EN
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">New student enrolled</p>
                        <p className="text-xs text-gray-600">Sarah Johnson enrolled in your course</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold">
                        QC
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">Quiz completed</p>
                        <p className="text-xs text-gray-600">Mike Davis completed your quiz with 85%</p>
                        <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold">
                        $$
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">Payment received</p>
                        <p className="text-xs text-gray-600">You received $25.00 from course enrollment</p>
                        <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-semibold text-sm cursor-pointer transition-colors border border-white/30"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.name?.[0]?.toUpperCase() || 'M'}
              </button>
              {showUserMenu && (
                <div className="absolute top-[calc(100%+0.5rem)] right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] overflow-hidden z-[1000]">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-900 text-sm">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-600">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Link
                    to={ROUTES.MY_LEARNING}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary text-sm transition-colors duration-250 no-underline"
                    onClick={() => setShowUserMenu(false)}
                  >
                    My Learning
                  </Link>
                  <Link
                    to={ROUTES.NOTIFICATIONS}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary text-sm transition-colors duration-250 no-underline"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Notifications
                  </Link>
                  <Link
                    to={ROUTES.WALLET}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary text-sm transition-colors duration-250 no-underline"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Wallet
                  </Link>
                  <Link
                    to={ROUTES.PROFILE}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary text-sm transition-colors duration-250 no-underline"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary text-sm transition-colors duration-250 border-none bg-transparent cursor-pointer"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={ROUTES.LOGIN} className="text-white/90 hover:text-white font-medium text-sm no-underline transition-colors">
                Log In
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="sm" className="bg-white text-primary hover:bg-gray-100">
                  Join for Free
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
    </>
  );
};

