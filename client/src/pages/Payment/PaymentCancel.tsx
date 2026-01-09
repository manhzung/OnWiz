/**
 * Payment Cancel page
 */

import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../config/routes';

export const PaymentCancel = () => {
  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-md mx-auto px-6 py-16">
        <Card className="text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment has been cancelled
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            The payment transaction has been cancelled. No fees have been charged from your account.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link to={ROUTES.DEPOSIT}>
              <Button variant="primary" fullWidth>
                Try Again
              </Button>
            </Link>

            <Link to={ROUTES.WALLET}>
              <Button variant="outline" fullWidth>
                Back to My Wallet
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If you encounter any issues, please contact support at support@onwiz.com
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
