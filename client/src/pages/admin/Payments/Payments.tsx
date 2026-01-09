/**
 * Payments Management page
 */

import { useState } from 'react';

import { Card } from '../../../components/common/Card';
import { Table } from '../../../components/common/Table';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { cn } from '../../../utils/cn';
import { formatCurrency } from '../../../utils/format';

// ============================================================================
// Types
// ============================================================================

interface Payment {
  id: string;
  user: string;
  amount: number;
  method: string;
  status: string;
  date: string;
  transactionId: string;
}

// ============================================================================
// Component
// ============================================================================

export const Payments = () => {
  // ==========================================================================
  // State
  // ==========================================================================
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================================================
  // Data
  // ==========================================================================
  
  // Mock data
  const payments: Payment[] = [
    {
      id: '1',
      user: 'John Smith',
      amount: 500000,
      method: 'Bank Transfer',
      status: 'completed',
      date: '2024-03-15',
      transactionId: 'TXN-001',
    },
    {
      id: '2',
      user: 'Sarah Johnson',
      amount: 750000,
      method: 'Credit Card',
      status: 'pending',
      date: '2024-03-16',
      transactionId: 'TXN-002',
    },
    {
      id: '3',
      user: 'Mike Davis',
      amount: 300000,
      method: 'E-Wallet',
      status: 'failed',
      date: '2024-03-17',
      transactionId: 'TXN-003',
    },
  ];

  // ==========================================================================
  // Utilities
  // ==========================================================================
  

  // ==========================================================================
  // Table Configuration
  // ==========================================================================
  
  const columns = [
    { key: 'transactionId', header: 'Transaction ID' },
    { key: 'user', header: 'User' },
    {
      key: 'amount',
      header: 'Amount',
      render: (payment: Payment) => (
        <span className="text-lg font-bold text-primary">{formatCurrency(payment.amount)}</span>
      ),
    },
    { key: 'method', header: 'Method' },
    {
      key: 'status',
      header: 'Status',
      render: (payment: Payment) => (
        <span className={cn(
          'px-3 py-1 text-xs font-semibold rounded-full',
          payment.status === 'completed' ? 'bg-green-50 text-green-600' :
          payment.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
          'bg-red-50 text-red-600'
        )}>
          {payment.status === 'completed'
            ? 'Completed'
            : payment.status === 'pending'
            ? 'Pending'
            : 'Failed'}
        </span>
      ),
    },
    { key: 'date', header: 'Date' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_payment: Payment) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Details
          </Button>
        </div>
      ),
    },
  ];

  // ==========================================================================
  // Computed Values
  // ==========================================================================
  
  const filteredPayments = payments.filter(
    (payment) =>
      payment.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  // ==========================================================================
  // Render
  // ==========================================================================
  
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
        <Card className="mb-0">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
          </div>
        </Card>
        <Card className="mb-0">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Successful Transactions</div>
            <div className="text-3xl font-bold text-gray-900">
              {payments.filter((p) => p.status === 'completed').length}
            </div>
          </div>
        </Card>
        <Card className="mb-0">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-gray-900">
              {payments.filter((p) => p.status === 'pending').length}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center gap-4 max-md:flex-col max-md:items-stretch">
          <div className="flex-1 max-w-md max-md:max-w-full">
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card title="Payments List">
        <Table columns={columns} data={filteredPayments} />
      </Card>
    </div>
  );
};

