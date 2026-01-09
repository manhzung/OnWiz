/**
 * Admin Dashboard page - Coursera style
 */

import { Card } from '../../../components/common/Card';

// ============================================================================
// Component
// ============================================================================

export const Dashboard = () => {
  // ==========================================================================
  // Data
  // ==========================================================================
  
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Total Groups', value: '56', change: '+5%' },
    { label: 'Revenue', value: '$125K', change: '+23%' },
    { label: 'Orders', value: '892', change: '+8%' },
  ];

  // ==========================================================================
  // Render
  // ==========================================================================
  
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="mb-0">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-600">{stat.label}</div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm font-semibold text-green-600">{stat.change}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
        <Card title="Recent Activity">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-gray-900 font-medium mb-1">New user registered</div>
                <div className="text-sm text-gray-600">2 minutes ago</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-gray-900 font-medium mb-1">New payment processed</div>
                <div className="text-sm text-gray-600">15 minutes ago</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-gray-900 font-medium mb-1">New course created</div>
                <div className="text-sm text-gray-600">1 hour ago</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Quick Stats">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div className="text-gray-600">Active Users</div>
              <div className="text-2xl font-bold text-gray-900">456</div>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div className="text-gray-600">Open Courses</div>
              <div className="text-2xl font-bold text-gray-900">23</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-gray-600">Pending Orders</div>
              <div className="text-2xl font-bold text-gray-900">12</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
