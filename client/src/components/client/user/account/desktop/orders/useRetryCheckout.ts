'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/order.interface';
import { toast } from 'sonner';

export interface RetryPaymentResult {
  success: boolean;
  paymentMethod: string;
  orderData?: any;
  orderId?: string;
  paymentId?: string;
  paymentUrl?: string;
  error?: string;
}

export const useRetryCheckout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  // Load order data for retry
  const loadOrderForRetry = useCallback(async (orderId: string) => {
    if (!orderId) return null;
    
    setIsLoading(true);
    try {
      const response = await orderService.getById(orderId);
      const orderData = response.data;
      
      // Validate order can be retried
      if (orderData.status !== 'PENDING_PAYMENT') {
        toast.error('Đơn hàng này không thể thanh toán lại');
        return null;
      }
      
      setOrder(orderData);
      return orderData;
    } catch (error: any) {
      console.error('Error loading order for retry:', error);
      toast.error('Không thể tải thông tin đơn hàng');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle retry payment based on selected method
  const handleRetryPayment = useCallback(async (
    orderId: string, 
    paymentMethod: string
  ): Promise<RetryPaymentResult | null> => {
    if (!order) {
      toast.error('Không tìm thấy thông tin đơn hàng');
      return null;
    }

    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return null;
    }

    setIsLoading(true);
    try {
      if (paymentMethod === 'sepay') {
        return await handleSepayRetry(orderId);
      } else if (paymentMethod === 'vnpay') {
        return await handleVNPayRetry(orderId);
      } else {
        toast.error('Phương thức thanh toán không được hỗ trợ');
        return null;
      }
    } catch (error: any) {
      console.error('Retry payment error:', error);
      toast.error('Có lỗi xảy ra khi xử lý thanh toán');
      return {
        success: false,
        paymentMethod,
        error: error.message || 'Có lỗi xảy ra'
      };
    } finally {
      setIsLoading(false);
    }
  }, [order]);

  // Handle Sepay retry payment
  const handleSepayRetry = useCallback(async (orderId: string): Promise<RetryPaymentResult> => {
    if (!order) {
      throw new Error('Order data not found');
    }

    toast.success('Đang chuẩn bị mã QR thanh toán...');
    
    return {
      success: true,
      paymentMethod: 'sepay',
      orderData: order,
      orderId: orderId,
      paymentId: order.paymentId.toString()
    };
  }, [order]);

  // Handle VNPay retry payment
  const handleVNPayRetry = useCallback(async (orderId: string): Promise<RetryPaymentResult> => {
    if (!order) {
      throw new Error('Order data not found');
    }

    try {
      // Create VNPay payment URL for retry
      const vnPayResponse = await orderService.createPaymentVnPayUrl({
        amount: order.totalPayment,
        orderInfo: `DH${order.paymentId}`,
        orderId: order.paymentId.toString(),
        locale: 'vn'
      });

      toast.success('Đang chuyển hướng đến cổng thanh toán VNPay...');
      
      return {
        success: true,
        paymentMethod: 'vnpay',
        orderData: {
          ...order,
          finalTotal: order.totalPayment
        },
        orderId: orderId,
        paymentId: order.paymentId.toString(),
        paymentUrl: vnPayResponse.data.paymentUrl
      };
    } catch (error: any) {
      console.error('Failed to generate VNPay URL for retry:', error);
      toast.error('Không thể tạo URL thanh toán VNPay. Vui lòng thử lại.');
      
      return {
        success: false,
        paymentMethod: 'vnpay',
        orderData: order,
        orderId: orderId,
        error: error.message || 'VNPay URL generation failed'
      };
    }
  }, [order]);

  // Update payment method selection
  const updatePaymentMethod = useCallback((method: string) => {
    setSelectedPaymentMethod(method);
  }, []);

  // Navigate to payment success/failure
  const navigateToResult = useCallback((
    orderId: string, 
    totalAmount: number, 
    status: 'success' | 'failed' | 'pending' = 'pending'
  ) => {
    const params = new URLSearchParams({
      orderId,
      totalAmount: totalAmount.toString(),
      status,
      retry: 'true'
    });
    
    router.push(`/checkout/payment-success?${params.toString()}`);
  }, [router]);

  // Reset retry state
  const resetRetryState = useCallback(() => {
    setOrder(null);
    setSelectedPaymentMethod('');
    setIsLoading(false);
  }, []);

  return {
    // State
    isLoading,
    order,
    selectedPaymentMethod,
    
    // Actions
    loadOrderForRetry,
    handleRetryPayment,
    updatePaymentMethod,
    navigateToResult,
    resetRetryState,
    
    // Payment method handlers
    handleSepayRetry,
    handleVNPayRetry
  };
};
