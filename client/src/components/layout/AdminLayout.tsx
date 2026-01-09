/**
 * Admin Layout component
 * Layout for admin dashboard with sidebar
 */

import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../config/routes';
import { cn } from '../../utils/cn';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/users', label: 'Quản lý người dùng' },
    { path: '/admin/groups', label: 'Quản lý nhóm' },
    { path: '/admin/payments', label: 'Quản lý thanh toán' },
    { path: '/admin/courses', label: 'Quản lý khóa học' },
    { path: '/admin/orders', label: 'Quản lý đơn hàng' },
    { path: '/admin/settings', label: 'Cài đặt' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col shadow-md fixed h-screen z-[100] max-md:transform max-md:-translate-x-full max-md:translate-x-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent m-0">
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-4 py-4 rounded-lg text-gray-600 no-underline transition-all duration-250 mb-1',
                  'hover:bg-gray-100 hover:text-primary hover:translate-x-1',
                  isActive && 'bg-gray-100 text-gray-900 font-semibold'
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-4 mb-4 px-4 py-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {user?.name || 'Admin'}
              </div>
              <div className="text-xs text-gray-600 capitalize">{user?.role || 'Administrator'}</div>
            </div>
          </div>
          <button
            className="w-full px-4 py-4 bg-error text-white border-none rounded-lg cursor-pointer font-medium flex items-center justify-center transition-all duration-250 hover:bg-[#dc2626] hover:-translate-y-0.5 hover:shadow-md"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-[280px] max-md:ml-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-6 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div>
            <h1 className="text-[1.75rem] font-bold bg-gradient-primary bg-clip-text text-transparent m-0">
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-900">
              {user?.name || 'Admin'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50 [&>*]:w-full [&>*]:max-w-full">{children}</main>
      </div>
    </div>
  );
};

