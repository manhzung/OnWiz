/**
 * Groups Management page
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

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  createdAt: string;
  status: string;
}

// ============================================================================
// Component
// ============================================================================

export const Groups = () => {
  // ==========================================================================
  // State
  // ==========================================================================
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================================================
  // Data
  // ==========================================================================
  
  // Mock data
  const groups: Group[] = [
    {
      id: '1',
      name: 'Mathematics Study Group',
      description: 'Mathematics study group',
      members: 25,
      createdAt: '2024-01-10',
      status: 'active',
    },
    {
      id: '2',
      name: 'Programming Study Group',
      description: 'Web programming study group',
      members: 18,
      createdAt: '2024-01-15',
      status: 'active',
    },
    {
      id: '3',
      name: 'English Study Group',
      description: 'English learning group',
      members: 32,
      createdAt: '2024-02-01',
      status: 'inactive',
    },
  ];

  // ==========================================================================
  // Table Configuration
  // ==========================================================================
  
  const columns = [
    { key: 'name', header: 'Group Name' },
    { key: 'description', header: 'Description' },
    {
      key: 'members',
      header: 'Members',
      render: (group: Group) => <span className="font-semibold">{group.members} members</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (group: Group) => (
        <span className={cn(
          'px-3 py-1 text-xs font-semibold rounded-full',
          group.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-600'
        )}>
          {group.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    { key: 'createdAt', header: 'Created At' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_group: Group) => (
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
  
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="primary">Add Group</Button>
        </div>
      </Card>

      <Card title="Groups List">
        <Table columns={columns} data={filteredGroups} />
      </Card>
    </div>
  );
};

