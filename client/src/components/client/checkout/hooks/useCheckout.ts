'use client';

import { useContext, useState } from 'react';
import { CheckoutContext } from '@/providers/CheckoutContext';
import { orderService } from '@/services/orderService';
import { useSelector, useDispatch } from 'react-redux';
import { selectShopOrders, selectShopProducts, selectAppliedVouchers, selectAppliedPlatformVoucher, selectCommonOrderInfo, clearCheckoutState } from '@/store/features/checkout/ordersSilde';
import { SHIPPING_CONFIG } from '@/constants/shipping';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { OrderCreateRequest, OrderHandlerResult } from '@/types/order.interface';
import { CheckoutStep } from '@/providers/CheckoutContext';

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  const router = useRouter();
  const dispatch = useDispatch();
  
  // 1. Get data from Redux
  const shopOrders = useSelector(selectShopOrders);
  const shopProducts = useSelector(selectShopProducts);
  const appliedVouchers = useSelector(selectAppliedVouchers);
  const appliedPlatformVoucher = useSelector(selectAppliedPlatformVoucher);
  const commonInfo = useSelector(selectCommonOrderInfo);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }

  // Helper functions for components
  const goToStep = (step: CheckoutStep) => {
    context.goToStep(step);
  };

  const updateReceiverInfo = (info: any) => {
    context.updateReceiverInfo(info);
  };

  const updatePaymentMethod = (method: any) => {
    context.updatePaymentMethod(method);
  };

  const updateShippingAddress = (address: any) => {
    context.updateShippingAddress(address);
  };

  const updateShippingMethod = (method: any) => {
    context.updateShippingMethod(method);
  };

const handleCreateOrder = async (totalAmount?: number): Promise<OrderHandlerResult | undefined> => {
  if (isSubmitting) return;

  // Validate receiver info from commonInfo
  if (!commonInfo.receiver?.name || !commonInfo.receiver?.phone || !commonInfo.receiver?.address) {
    toast.error('Vui lòng điền đầy đủ thông tin người nhận.');
    return;
  }

  // Validate payment method
  if (!context.state.paymentMethod) {
    toast.error('Vui lòng chọn phương thức thanh toán.');
    return;
  }

  // Check if we have orders from Redux
  if (!shopOrders || shopOrders.length === 0) {
    toast.error('Không có sản phẩm nào để đặt hàng.');
    return;
  }    // Get the correct payment gateway ID from the selected payment method
    const getPaymentGatewayId = (paymentMethod: string): string => {
      // Map payment method IDs to the correct gateway format
      const paymentGatewayMap: { [key: string]: string } = {
        'cod': 'COD',
        'sepay': 'sepay',
        'vnpay': 'vnpay'
      };
      return paymentGatewayMap[paymentMethod] || paymentMethod.toUpperCase();
    };

    const selectedPaymentGateway = getPaymentGatewayId(context.state.paymentMethod);
    const isCodPayment = context.state.paymentMethod === 'cod';

    setIsSubmitting(true);
    try {
      // Create order payload with new structure
      const platformDiscountCodes: string[] = [];

      // Collect platform voucher codes
      if (appliedPlatformVoucher && appliedPlatformVoucher.code) {
        platformDiscountCodes.push(appliedPlatformVoucher.code);
      }

      const orderPayload = {
        shops: shopOrders.map(order => {
          // Get shop-specific voucher codes for this shop only
          const shopDiscountCodes: string[] = [];
          const shopVoucher = appliedVouchers[order.shopId];
          if (shopVoucher && shopVoucher.code) {
            shopDiscountCodes.push(shopVoucher.code);
          }

          return {
            shopId: order.shopId,
            receiver: {
              name: commonInfo.receiver!.name,
              phone: commonInfo.receiver!.phone,
              address: commonInfo.receiver!.address,
              provinceId: commonInfo.receiver!.provinceId,
              districtId: commonInfo.receiver!.districtId,
              wardCode: commonInfo.receiver!.wardCode
            },
            cartItemIds: order.cartItemIds,
            discountCodes: shopDiscountCodes, // Riêng biệt cho từng shop
            shippingInfo: {
              length: SHIPPING_CONFIG.DEFAULT_PACKAGE.length,
              weight: SHIPPING_CONFIG.DEFAULT_PACKAGE.weight,
              width: SHIPPING_CONFIG.DEFAULT_PACKAGE.width,
              height: SHIPPING_CONFIG.DEFAULT_PACKAGE.height,
              service_id: order.selectedShippingMethod?.service_id || 53321,
              service_type_id: order.selectedShippingMethod?.service_type_id || 2,
              shippingFee: order.shippingFee || 0
            },
            isCod: isCodPayment
          };
        }),
        platformDiscountCodes: platformDiscountCodes
      };

      // Console log để kiểm tra data trước khi gọi API
      console.log('📦 Order Payload Data:', {
        paymentMethod: context.state.paymentMethod,
        paymentGateway: selectedPaymentGateway,
        isCod: isCodPayment,
        receiverInfo: commonInfo.receiver,
        shopOrders: shopOrders,
        finalPayload: orderPayload
      });

      // Call the order service
      const response = await orderService.create(orderPayload);
      const orderData = response.data;

      // Handle different payment methods
      if (selectedPaymentGateway === 'sepay') {
        toast.success('Đơn hàng đã được tạo! Vui lòng quét mã QR để thanh toán.');
        
        const orderId = orderData.orders && orderData.orders.length > 0 
          ? orderData.orders[0].id 
          : undefined;
        const result = {
          success: true,
          paymentMethod: 'sepay',
          orderData: orderData,
          orderId: orderId,
          paymentId: orderData.paymentId
        };
        return result;
      } else if (selectedPaymentGateway === 'vnpay') {
        try {
          const vnPayResponse = await orderService.createPaymentVnPayUrl({
            amount: commonInfo.amount, // Lấy amount từ Redux state
            orderInfo: `DH${orderData.paymentId}`,
            orderId: orderData.paymentId.toString(),
            locale: 'vn'
          });
          
          toast.success('Đang chuyển hướng đến cổng thanh toán VNPay...');
          const orderId = orderData.orders && orderData.orders.length > 0 
            ? orderData.orders[0].id 
            : undefined;
            
          const result = {
            success: true,
            paymentMethod: 'vnpay',
            orderData: {
              ...orderData,
              finalTotal: commonInfo.amount // Lấy amount từ Redux state
            },
            orderId: orderId,
            paymentId: orderData.paymentId,
            paymentUrl: vnPayResponse.data.paymentUrl
          };
          return result;
        } catch (vnPayError: any) {
          console.error('Failed to generate VNPay URL:', vnPayError);
          toast.error('Không thể tạo URL thanh toán VNPay. Vui lòng thử lại.');
          const orderId = orderData.orders && orderData.orders.length > 0 
            ? orderData.orders[0].id 
            : undefined;
            
          return {
            success: false,
            paymentMethod: 'vnpay',
            orderData: orderData,
            orderId: orderId,
            error: vnPayError.message
          };
        }
      } else if (selectedPaymentGateway === 'COD' || isCodPayment) {
        // Thanh toán khi nhận hàng (COD)
        toast.success('Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.');
        
        // Clear checkout state sau khi đặt hàng thành công
        dispatch(clearCheckoutState());
        
        const orderId = orderData.orders && orderData.orders.length > 0 
          ? orderData.orders[0].id 
          : undefined;
          
        const result = {
          success: true,
          paymentMethod: 'COD',
          orderData: orderData,
          orderId: orderId,
          paymentId: orderData.paymentId
        };
        
        console.log('✅ COD Payment Result:', result);
        return result;
      } else {
        // Các phương thức thanh toán khác
        toast.success('Đặt hàng thành công!');
        router.push(`/checkout/success?orderId=${orderData.orders[0].id}`); // Navigate to success page with the first order's ID if available
        const orderId = orderData.orders && orderData.orders.length > 0 
          ? orderData.orders[0].id 
          : undefined;
          
        const result = {
          success: true,
          paymentMethod: selectedPaymentGateway,
          orderData: orderData,
          orderId: orderId,
          paymentId: orderData.paymentId
        };
        
        console.log('✅ Other Payment Result:', result);
        return result;
      }

    } catch (error: any) {
      console.error('Failed to create order:', error);
      toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng.');
      return {
        success: false,
        error: error.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng.'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: context.state,
    goToStep,
    updateReceiverInfo,
    updatePaymentMethod,
    updateShippingAddress,
    updateShippingMethod,
    isSubmitting,
    handleCreateOrder,
  };
};
