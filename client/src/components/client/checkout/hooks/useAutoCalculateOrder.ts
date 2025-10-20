import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  selectCalculateOrderRequest,
  selectCalculationResult,
  selectShopOrders,
  selectAppliedPlatformVoucher,
  selectAppliedVouchers
} from '@/store/features/checkout/ordersSilde';
import { useCalculateOrder } from './useCalculateOrder';

export const useAutoCalculateOrder = () => {
  const calculateOrderRequest = useSelector(selectCalculateOrderRequest);
  const calculationResult = useSelector(selectCalculationResult);
  const shopOrders = useSelector(selectShopOrders);
  const appliedPlatformVoucher = useSelector(selectAppliedPlatformVoucher);
  const appliedVouchers = useSelector(selectAppliedVouchers);
  
  const { calculateOrder, loading, error, canCalculate } = useCalculateOrder();
  
  // Sử dụng ref để track request hash và tránh gọi API trùng lặp
  const lastCalculationHashRef = useRef<string>('');
  const isCalculatingRef = useRef(false);

  useEffect(() => {
    if (!canCalculate || isCalculatingRef.current) {
      return;
    }

    // Tạo hash từ các dữ liệu quan trọng bao gồm cả voucher của từng shop
    const calculationHash = JSON.stringify({
      shopOrders: shopOrders.map(order => ({
        shopId: order.shopId,
        cartItemIds: order.cartItemIds,
        shippingFee: order.shippingFee,
        discountCodes: order.discountCodes,
      })),
      platformVoucherCode: appliedPlatformVoucher?.code || null,
      appliedVouchers: Object.keys(appliedVouchers).reduce((acc, shopId) => {
        acc[shopId] = appliedVouchers[shopId]?.code || null;
        return acc;
      }, {} as Record<string, string | null>),
    });

    // Chỉ tính toán nếu có thay đổi thực sự
    if (calculationHash !== lastCalculationHashRef.current) {
      lastCalculationHashRef.current = calculationHash;
      isCalculatingRef.current = true;
      
      calculateOrder().finally(() => {
        isCalculatingRef.current = false;
      });
    }
  }, [
    canCalculate,
    calculateOrder,
    shopOrders,
    appliedPlatformVoucher?.code,
    appliedVouchers, // Thêm appliedVouchers để theo dõi thay đổi voucher shop
  ]);

  return {
    calculationResult,
    loading,
    error,
    canCalculate,
  };
};
