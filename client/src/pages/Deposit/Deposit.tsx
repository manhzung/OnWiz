/**
 * Deposit page - Add money to wallet
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ROUTES } from '../../config/routes';
import { formatCurrency } from '../../utils/format';

// ============================================================================
// Types
// ============================================================================

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  fee: number;
  processingTime: string;
}

// ============================================================================
// Component
// ============================================================================

export const Deposit = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'momo',
      name: 'MoMo Wallet',
      icon: 'M',
      description: 'Fast payment via MoMo e-wallet',
      fee: 0,
      processingTime: 'Instant'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: 'Z',
      description: 'Convenient payment via ZaloPay',
      fee: 0,
      processingTime: 'Instant'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'B',
      description: 'Direct bank transfer',
      fee: 0,
      processingTime: '5-15 minutes'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'C',
      description: 'Payment with Visa, Mastercard',
      fee: 0,
      processingTime: 'Instant'
    }
  ];

  const quickAmounts = [50000, 100000, 200000, 500000];

  const handleDeposit = async () => {
    if (!selectedMethod || !amount) return;

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to success page
      navigate(ROUTES.PAYMENT_SUCCESS);
    }, 2000);
  };


  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Up Wallet</h1>
          <p className="text-gray-600">Choose payment method and amount to top up</p>
        </div>

        {/* Amount Selection */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Amount</h2>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className={`p-3 border-2 rounded-lg text-center hover:border-primary transition-colors ${
                  amount === quickAmount.toString()
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{formatCurrency(quickAmount)}</div>
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount
            </label>
            <Input
              type="number"
              placeholder="Enter amount (VND)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
          </div>

          {amount && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Top up amount:</strong> {formatCurrency(Number(amount))}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                This amount will be added to your wallet immediately after successful payment.
              </p>
            </div>
          )}
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Payment Method</h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <div className="ml-4 flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        Fee: {method.fee === 0 ? 'Free' : formatCurrency(method.fee)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Time: {method.processingTime}
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Summary & Confirm */}
        {selectedMethod && amount && (
          <Card className="border-green-200 bg-green-50">
            <h3 className="font-semibold text-gray-900 mb-3">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Top up amount:</span>
                <span className="font-medium">{formatCurrency(Number(amount))}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction fee:</span>
                <span className="font-medium">
                  {paymentMethods.find(m => m.id === selectedMethod)?.fee === 0
                    ? 'Free'
                    : formatCurrency(paymentMethods.find(m => m.id === selectedMethod)?.fee || 0)}
                </span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-green-600">
                  {formatCurrency(Number(amount) + (paymentMethods.find(m => m.id === selectedMethod)?.fee || 0))}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleDeposit}
              disabled={isProcessing}
              className="mt-6"
            >
              {isProcessing ? 'Processing...' : 'Confirm Top Up'}
            </Button>
          </Card>
        )}

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            💡 <strong>Note:</strong> Money will be added to your wallet immediately after successful payment.
            You can use wallet funds to purchase any course on the platform.
          </p>
        </div>
      </div>
    </div>
  );
};
