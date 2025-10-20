'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, QrCode, Loader2, ShieldCheck, Clock, User, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useRetryCheckout } from '@/components/client/user/account/desktop/orders/useRetryCheckout';
import { QrSepay } from '@/components/client/checkout/payment/qrSepay';

interface RetryPaymentPageProps {
  orderId: string;
}

export default function RetryPaymentPage({ orderId }: RetryPaymentPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'select' | 'payment'>('select');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const {
    isLoading,
    order,
    selectedPaymentMethod,
    loadOrderForRetry,
    handleRetryPayment,
    updatePaymentMethod,
    navigateToResult,
    resetRetryState
  } = useRetryCheckout();

  // Load order on mount
  useEffect(() => {
    if (orderId) {
      loadOrderForRetry(orderId);
    }
    
    return () => {
      resetRetryState();
    };
  }, [orderId, loadOrderForRetry, resetRetryState]);

  // Handle payment method selection
  const handlePaymentMethodSelect = async (method: string) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
    updatePaymentMethod(method);
    
    const result = await handleRetryPayment(orderId, method);
    
    if (result?.success) {
      if (method === 'vnpay' && result.paymentUrl) {
        // Redirect to VNPay
        window.location.href = result.paymentUrl;
      } else if (method === 'sepay') {
        // Show QR payment
        setCurrentStep('payment');
      }
    }
    setSelectedMethod(null);
  };

  // Handle back to selection
  const handleBackToSelect = () => {
    setCurrentStep('select');
    setPaymentMethod('');
    setSelectedMethod(null);
    updatePaymentMethod('');
  };

  const handleGoBack = () => {
    router.push(`/user/orders/${orderId}`);
  };

  // Loading state
  if (isLoading && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải thông tin</h2>
            <p className="text-gray-600 text-center">Vui lòng đợi trong giây lát...</p>
          </div>
        </div>
      </div>
    );
  }

  // Order not found or invalid
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Không tìm thấy đơn hàng</h2>
            <p className="text-gray-600">
              Đơn hàng không tồn tại hoặc không thể thanh toán lại
            </p>
          </div>
          <button
            onClick={handleGoBack}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  // Show QR payment
  if (currentStep === 'payment' && paymentMethod === 'sepay') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBackToSelect}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 shadow-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Chọn lại phương thức
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán lại đơn hàng</h1>
              <p className="text-gray-600 text-lg">Đơn hàng #{order.paymentId}</p>
            </div>
          </div>

          {/* QR Payment */}
          <QrSepay
            paymentId={order.paymentId.toString()}
            orderId={orderId}
            totalAmount={order.totalPayment}
            onPaymentConfirm={() => {
              navigateToResult(orderId, order.totalPayment, 'pending');
            }}
            onPaymentCancel={() => {
              setCurrentStep('select');
            }}
          />
        </div>
      </div>
    );
  }

  // Payment method selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 max-w-2xl py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 shadow-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại chi tiết
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán lại đơn hàng</h1>
            <p className="text-gray-600 text-lg">Chọn phương thức thanh toán phù hợp</p>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Thông tin đơn hàng</h2>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Chờ thanh toán</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">#</span>
                  </div>
                  <span className="text-gray-600 font-medium">Mã đơn hàng</span>
                </div>
                <span className="font-semibold text-gray-900">#{order.paymentId}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-lg">₫</span>
                  </div>
                  <span className="text-gray-600 font-medium">Tổng tiền</span>
                </div>
                <span className="font-bold text-2xl text-red-600">
                  {order.totalPayment.toLocaleString()}đ
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Người nhận</span>
                </div>
                <span className="font-semibold text-gray-900">{order.receiver?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Chọn phương thức thanh toán</h2>
            <p className="text-gray-600">Vui lòng chọn một phương thức thanh toán để tiếp tục</p>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Sepay QR Payment */}
            <button
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                selectedMethod === 'sepay' 
                  ? 'border-red-500 bg-red-50 shadow-lg opacity-50' 
                  : 'border-gray-200 bg-white hover:border-red-300'
              }`}
              onClick={() => handlePaymentMethodSelect('sepay')}
              disabled={isLoading}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl transition-colors duration-300 ${
                  selectedMethod === 'sepay' ? 'bg-red-500' : 'bg-red-100'
                }`}>
                  {selectedMethod === 'sepay' ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <QrCode className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-lg text-gray-900 mb-1">Chuyển khoản QR</div>
                  <div className="text-gray-600 mb-2">
                    Quét mã QR để thanh toán qua ngân hàng
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Bảo mật cao</span>
                  </div>
                </div>
              </div>
              {selectedMethod === 'sepay' && (
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-red-600 font-medium">Đang xử lý...</span>
                </div>
              )}
            </button>

            {/* VNPay Payment */}
            <button
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                selectedMethod === 'vnpay' 
                  ? 'border-blue-500 bg-blue-50 shadow-lg opacity-50' 
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
              onClick={() => handlePaymentMethodSelect('vnpay')}
              disabled={isLoading}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl transition-colors duration-300 ${
                  selectedMethod === 'vnpay' ? 'bg-blue-500' : 'bg-blue-100'
                }`}>
                  {selectedMethod === 'vnpay' ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-lg text-gray-900 mb-1">VNPay</div>
                  <div className="text-gray-600 mb-2">
                    Thanh toán qua thẻ ATM, Visa, MasterCard
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Được bảo vệ bởi VNPay</span>
                  </div>
                </div>
              </div>
              {selectedMethod === 'vnpay' && (
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-blue-600 font-medium">Đang chuyển hướng...</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Thanh toán an toàn</h3>
              <p className="text-sm text-green-700">
                Thông tin thanh toán của bạn được bảo vệ bằng công nghệ mã hóa SSL 256-bit. 
                Chúng tôi không lưu trữ thông tin thẻ của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
