import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderService } from '@/services/orderService';
import { 
  selectCalculateOrderRequest, 
  setCalculationResult,
  selectCalculationResult 
} from '@/store/features/checkout/ordersSilde';
import { CalculateOrderResponse } from '@/types/order.interface';

export const useCalculateOrder = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRequestRef = useRef<string>('');
  
  const calculateOrderRequest = useSelector(selectCalculateOrderRequest);
  const calculationResult = useSelector(selectCalculationResult);

  const calculateOrder = useCallback(async () => {
    if (!calculateOrderRequest) {
      setError('Thiếu thông tin để tính toán đơn hàng');
      return null;
    }

    // Tạo hash của request để tránh gọi API trùng lặp
    const requestHash = JSON.stringify(calculateOrderRequest);
    if (lastRequestRef.current === requestHash) {
      return calculationResult;
    }

    setLoading(true);
    setError(null);
    lastRequestRef.current = requestHash;

    try {
      console.log('[Calculate Order] Request:', JSON.stringify(calculateOrderRequest, null, 2));
      const response: CalculateOrderResponse = await orderService.calculateOrder(calculateOrderRequest);
      console.log('[Calculate Order] Response:', JSON.stringify(response, null, 2));
      
      // Lưu kết quả vào Redux state
      dispatch(setCalculationResult(response.data));
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Có lỗi xảy ra khi tính toán đơn hàng';
      setError(errorMessage);
      console.error('[Calculate Order] Error:', err);
      lastRequestRef.current = ''; // Reset để có thể thử lại
      return null;
    } finally {
      setLoading(false);
    }
  }, [calculateOrderRequest, dispatch, calculationResult]);

  return {
    calculateOrder,
    calculationResult,
    loading,
    error,
    canCalculate: !!calculateOrderRequest && calculateOrderRequest.shops.length > 0,
  };
};
