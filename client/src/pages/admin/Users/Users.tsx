/**
 * Users Management page
 */

import { useState } from 'react';

import { Card } from '../../../components/common/Card';
import { Table } from '../../../components/common/Table';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { cn } from '../../../utils/cn';

// ============================================================================
// Types
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// ============================================================================
// Component
// ============================================================================

export const Users = () => {
  // ==========================================================================
  // State
  // ==========================================================================
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================================================
  // Data
  // ==========================================================================
  
  // Mock data
  const users: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'nguyenvana@example.com',
      role: 'student',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'tranthib@example.com',
      role: 'teacher',
      status: 'active',
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'levanc@example.com',
      role: 'admin',
      status: 'inactive',
      createdAt: '2024-02-01',
    },
  ];

  // ==========================================================================
  // Table Configuration
  // ==========================================================================
  
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {user.name[0]}
          </div>
          <span>{user.name}</span>
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <span className="px-3 py-1 bg-purple-50 text-primary text-xs font-semibold rounded-full">
          {user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Teacher' : 'Student'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => (
        <span className={cn(
          'px-3 py-1 text-xs font-semibold rounded-full',
          user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-600'
        )}>
          {user.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Created At' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_user: User) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // ==========================================================================
  // Filtered Data
  // ==========================================================================
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================================================
  // Render
  // ==========================================================================
  
  return (
    <div className="w-full flex flex-col gap-6">
      <Card>
        <div className="flex justify-between items-center gap-4 max-md:flex-col max-md:items-stretch">
          <div className="flex-1 max-w-md max-md:max-w-full">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="primary">Add User</Button>
        </div>
      </Card>

      <Card title="Users List">
        <Table columns={columns} data={filteredUsers} />
      </Card>
    </div>
  );
};

