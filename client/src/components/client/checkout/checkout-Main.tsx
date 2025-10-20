'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckoutHeader } from './checkout-Header';
import { CheckoutSteps } from './checkout-Steps';
import { InformationTabs } from './information-Tabs/information-Index';
import { PaymentTabs } from './payment-Tabs/payment-Index';
import { FooterSection } from './shared/footer-Section';
import { useCheckout } from './hooks/useCheckout';
import { CheckoutStep } from './checkout-Steps';
import { QrSepay } from './payment/qrSepay';
import { PaymentCod } from './payment/payment-cod';
import { useRouter } from 'next/navigation';
import { useShopsifuSocket } from '@/providers/ShopsifuSocketProvider';
import { orderService } from '@/services/orderService';
import { toast } from 'sonner';
import { OrderStatus } from '@/types/order.interface';
import Image from 'next/image';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { clearCheckoutState } from '@/store/features/checkout/ordersSilde';


interface CheckoutMainProps {
  cartItemIds?: string[];
}

export function CheckoutMain({ cartItemIds = [] }: CheckoutMainProps) {
  // 1. Lấy state và các hàm từ hook đã được cập nhật
  const { state, goToStep, handleCreateOrder, isSubmitting } = useCheckout();
  const router = useRouter();
  const dispatch = useDispatch();
  const { connect, disconnect, payments, isConnected } = useShopsifuSocket();
  
  // Debug log cartItemIds
  console.log('🛍️ CheckoutMain - Received cartItemIds:', {
    cartItemIds,
    count: cartItemIds.length,
    isValid: cartItemIds.length > 0
  });
  
  // 2. State để quản lý việc hiển thị QR Sepay, COD và loading states
  const [showQrSepay, setShowQrSepay] = useState(false);
  const [showCodPayment, setShowCodPayment] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectingTo, setRedirectingTo] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [activePaymentId, setActivePaymentId] = useState<number | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<{
    success: boolean;
    paymentMethod?: string;
    orderData?: { 
      [key: string]: any;
      orders?: any[];
      paymentId?: number;
    };
    paymentId?: number;
    orderId?: string;
    paymentUrl?: string;
    error?: string;
  } | null>(null);

  // 3. Hàm chuyển step
  const handleStepChange = (step: CheckoutStep) => {
    goToStep(step);
  };
 
  // 4. Hàm xử lý khi nhấn nút "Tiếp tục" hoặc "Hoàn tất"
  const handleNext = async () => {
    if (state.step === 'information') {
      // Kích hoạt validation của form thông tin
      const form = document.getElementById('checkout-form') as HTMLFormElement;
      if (form) {
        // Form's onSubmit sẽ xử lý việc chuyển sang bước tiếp theo nếu hợp lệ
        form.requestSubmit();
      }
    } else if (state.step === 'payment') {
      // Ở bước thanh toán, hành động tiếp theo là tạo đơn hàng và truyền totalAmount từ state
      const result = await handleCreateOrder(totalAmount);
      
      // Xử lý kết quả tạo đơn hàng
      if (result && result.success) {
        // Lưu kết quả để sử dụng sau này
        setOrderResult(result);
        
        // Xử lý theo từng phương thức thanh toán
        if (result.paymentMethod === 'sepay') {
          // Hiển thị QR Sepay cho thanh toán chuyển khoản
          setShowQrSepay(true);
        } else if (result.paymentMethod === 'vnpay' && result.paymentUrl && result.orderId) {
          // Hiển thị loading và chuẩn bị chuyển hướng đến VNPay
          setIsRedirecting(true);
          setRedirectingTo('vnpay');
          
          // Lưu paymentId và orderId để socket có thể theo dõi trạng thái
          if (result.paymentId) {
            setActivePaymentId(result.paymentId);
            setActiveOrderId(result.orderId || '');
            console.log(`[VNPay] Connecting to socket with paymentId: ${result.paymentId}`);
            connect(result.paymentId.toString()); // Convert to string for connect function
          }
          
          // Lưu thông tin về đơn hàng để xử lý sau khi redirect về
          sessionStorage.setItem('lastOrderId', result.orderId || '');
          sessionStorage.setItem('orderAmount', totalAmount.toString());
          
          // Sau 1.5 giây, chuyển hướng đến VNPay
          setTimeout(() => {
            // Chuyển hướng đến trang thanh toán VNPay
            window.location.href = result.paymentUrl as string;
          }, 1500);
        } else if (result.paymentMethod === 'COD' && result.orderId) {
          // Thanh toán COD - hiển thị component COD
          setShowCodPayment(true);
        } else if (result.orderId) {
          // Các phương thức khác
          router.push(`/checkout/payment-success?orderId=${result.orderId}&status=success&totalAmount=${totalAmount}`);
        }
      } else {
        console.error('❌ Order creation failed:', result);
      }
    }
  };

  const handlePrevious = () => {
    if (state.step === 'payment') {
      handleStepChange('information');
    }
  };
  
  // Socket event listener for VNPay payment status
  useEffect(() => {
    if (!payments.length || !activeOrderId || !activePaymentId) return;

    console.log(`[WebSocket] Checking for payment events. Total events: ${payments.length}`);
    
    const latestPayment = payments[payments.length - 1];
    
    // Check if the latest payment is a success for the current order
    if (
      latestPayment &&
      latestPayment.orderId === activeOrderId &&
      latestPayment.status === 'success' &&
      latestPayment.gateway === 'vnpay'
    ) {
      console.log('✅ VNPay payment success event received via WebSocket for order:', activeOrderId);
      toast.success('Thanh toán thành công!');
      
      // Redirect to success page
      router.push(`/checkout/payment-success?orderId=${activeOrderId}&totalAmount=${totalAmount}`);
      
      // Disconnect socket after successful payment
      disconnect();
    }
  }, [payments, activeOrderId, activePaymentId, router, totalAmount, disconnect]);
  
  // Fallback polling mechanism for VNPay payment status
  useEffect(() => {
    if (!activeOrderId || !activePaymentId || !isRedirecting || redirectingTo !== 'vnpay') return;
    
    let intervalId: NodeJS.Timeout;
    
    const checkVNPayPaymentStatus = async () => {
      console.log(`[Polling] Checking VNPay payment status for orderId: ${activeOrderId}...`);
      try {
        const order = await orderService.getById(activeOrderId);
        if (order && order.data.status === OrderStatus.PICKUPED) {
          clearInterval(intervalId);
          toast.success('Thanh toán VNPay thành công!');
          router.push(`/checkout/payment-success?orderId=${activeOrderId}&totalAmount=${totalAmount}`);
          
          // Disconnect socket after successful payment
          disconnect();
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái thanh toán VNPay:', error);
      }
    };
    
    // Check every 5 seconds
    intervalId = setInterval(checkVNPayPaymentStatus, 5000);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
    };
  }, [activeOrderId, activePaymentId, isRedirecting, redirectingTo, router, totalAmount, disconnect]);
  
  // Cleanup effect to disconnect socket when component unmounts
  useEffect(() => {
    return () => {
      if (activePaymentId) {
        console.log(`[Cleanup] Disconnecting socket for paymentId: ${activePaymentId}`);
        disconnect();
      }
    };
  }, [activePaymentId, disconnect]);
  
  // 5. Xử lý khi user xác nhận đã chuyển tiền (QR Sepay)
  const handlePaymentConfirm = () => {
    // If we have order ID, redirect to order success page, otherwise go to dashboard
    if (orderResult?.orderId) {
      router.push(`/checkout/payment-success?orderId=${orderResult.orderId}&totalAmount=${totalAmount}`);
    } else {
      router.push('/user/dashboard');
    }
  };
  
  // 6. Xử lý khi user hủy thanh toán (QR Sepay)
  const handlePaymentCancel = () => {
    setShowQrSepay(false);
    setOrderResult(null);
    // Quay lại bước thanh toán
  };

  // Helper function to get footer step type
  const getFooterStep = (step: CheckoutStep): 'information' | 'payment' => {
    return step === 'cart' ? 'information' : step;
  };

  // Nếu đang hiển thị COD Payment, render component COD
  if (showCodPayment && orderResult && orderResult.orderId) {
    return (
      <PaymentCod
        orderId={orderResult.orderId}
        totalAmount={totalAmount}
        paymentId={orderResult.paymentId}
        orderData={orderResult.orderData}
      />
    );
  }
  
  // Nếu đang hiển thị QR Sepay, render component QR
  if (showQrSepay && orderResult && orderResult.paymentId && orderResult.orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <QrSepay
          paymentId={orderResult.paymentId.toString()}
          orderId={orderResult.orderId}
          onPaymentConfirm={handlePaymentConfirm}
          onPaymentCancel={handlePaymentCancel}
        />
      </div>
    );
  }
  
  // Nếu đang chuyển hướng đến VNPay, hiển thị màn hình loading
  if (isRedirecting && redirectingTo === 'vnpay' && orderResult && orderResult.paymentUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md mx-auto border-blue-200 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-b from-blue-50 to-white rounded-t-lg">
            <div className="flex justify-center mb-4">
              <Image 
                src="/payment-icons/vnpay.svg" 
                alt="VNPay Logo" 
                width={120} 
                height={40} 
                className="object-contain"
                onError={(e) => {
                  // Fallback nếu không tìm thấy hình ảnh
                  const target = e.target as HTMLImageElement;
                  target.src = "/payment-logos/vnpay.png";
                }}
              />
            </div>
            <CardTitle className="text-blue-700 text-xl font-bold">Đang chuyển hướng đến VNPay</CardTitle>
            <CardDescription className="text-gray-600">
              Vui lòng chờ trong giây lát...
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {/* Loading indicator */}
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Hệ thống đang kết nối với cổng thanh toán VNPay</p>
              <p>Vui lòng không đóng trang này</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {/* <CheckoutHeader /> */}
      
      {/* Main Content */}
      <div className="flex-1 max-w-[1920px] w-full mx-auto px-3 sm:px-4 lg:px-8 2xl:px-12 py-3 lg:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-12">
          {/* Main Form Section */}
          <div className="flex-1 order-1 lg:order-1 min-w-0 lg:max-w-[calc(100%-520px)] xl:max-w-[calc(100%-580px)]">
            {/* Steps */}
            <div className="sticky top-0 z-10 -mx-3 px-3 sm:-mx-4 sm:px-4 lg:static lg:mx-0 lg:px-0 py-2">
              <CheckoutSteps activeStep={state.step} onStepChange={handleStepChange} />
            </div>
            
            {/* Form Content */}
            <div className="mt-3 lg:mt-4 space-y-4">
              {state.step === 'information' ? (
                <InformationTabs onNext={() => goToStep('payment')} />
              ) : (
                <PaymentTabs onPrevious={() => goToStep('information')} />
              )}
            </div>
          </div>
          
          {/* Order Summary - Desktop */}
          <div className="hidden lg:block w-full lg:w-[500px] xl:w-[560px] order-2 lg:mt-[72px] flex-shrink-0">
            <div className="sticky top-6">
              <FooterSection
                step={getFooterStep(state.step)}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
                onTotalChange={setTotalAmount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary - Mobile */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="p-3">
          <FooterSection
            variant="mobile"
            step={getFooterStep(state.step)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isSubmitting={isSubmitting}
            onTotalChange={setTotalAmount}
          />
        </div>
      </div>
    </div>
  );
}

// Add cleanup effect to clear checkout state when component unmounts
export function CheckoutMainWithCleanup({ cartItemIds = [] }: CheckoutMainProps) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Cleanup function - clear state when leaving checkout page
    return () => {
      console.log('🧹 Clearing checkout state on page exit');
      dispatch(clearCheckoutState());
    };
  }, [dispatch]);
  
  return <CheckoutMain cartItemIds={cartItemIds} />;
}
