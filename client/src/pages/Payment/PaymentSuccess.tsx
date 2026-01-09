/**
 * Payment Success page
 */

import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ROUTES } from '../../config/routes';

export const PaymentSuccess = () => {
  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-md mx-auto px-6 py-16">
        <Card className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Thanh toán thành công!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            Số tiền đã được cộng vào ví của bạn. Bạn có thể sử dụng ngay để mua khóa học hoặc các nội dung khác.
          </p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Mã giao dịch:</span>
              <span className="text-sm font-medium">#TXN20240105001</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Số tiền:</span>
              <span className="text-sm font-medium">200,000 VNĐ</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Phương thức:</span>
              <span className="text-sm font-medium">Ví MoMo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Thời gian:</span>
              <span className="text-sm font-medium">05/01/2024 14:30</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to={ROUTES.WALLET}>
              <Button variant="primary" fullWidth>
                Xem ví của tôi
              </Button>
            </Link>

            <Link to={ROUTES.COURSES}>
              <Button variant="outline" fullWidth>
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Cần hỗ trợ? Liên hệ với chúng tôi qua email support@onwiz.com
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
