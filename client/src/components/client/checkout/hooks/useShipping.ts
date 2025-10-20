import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shippingService } from '@/services/shippingService';
import { selectShippingInfo, selectShopOrders } from '@/store/features/checkout/ordersSilde';
import { SHIPPING_CONFIG } from '@/constants/shipping';
import { 
  ShippingServiceResponse, 
  CalculateShippingFeeRequest,
  CalculateShippingFeeResponse,
  DeliveryTimeRequest,
  DeliveryTimeResponse,
  ShippingMethod
} from '@/types/shipping.interface';


export const useShipping = (shopId?: string) => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get shipping info from Redux
  const shippingInfo = useSelector(selectShippingInfo);
  const shopOrders = useSelector(selectShopOrders);
  
  
  // Get first shop ID if not provided
  const effectiveShopId = shopId || (shopOrders.length > 0 ? shopOrders[0].shopId : '');
  
  const fetchShippingServices = async () => {
    if (!shippingInfo?.districtId || !shippingInfo?.wardCode) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get current shop order to get cartItemIds
      const shopOrder = shopOrders.find(o => o.shopId === effectiveShopId);
      if (!shopOrder || !shopOrder.cartItemIds.length) {
        setShippingMethods([]);
        return;
      }

      // Fetch services for each cartItemId
      const allShippingMethods: ShippingMethod[] = [];
      
      for (const cartItemId of shopOrder.cartItemIds) {
        try {
          const servicesResponse = await shippingService.getServices({
            cartItemId
          });

          if (servicesResponse.data) {
            const services = Array.isArray(servicesResponse.data) ? servicesResponse.data : [servicesResponse.data];
            
            // Process each service for this cartItemId
            for (const service of services) {
              try {
                let feeResponse, timeResponse;
                let fallbackPrice = 30000; // Giá fallback 30k VND
                let fallbackTime = 'Nhận hàng dự kiến 3-5 ngày làm việc';

                try {
                  [feeResponse, timeResponse] = await Promise.all([
                    shippingService.calculateShippingFee({
                      height: 10,
                      weight: 500,
                      length: 15,
                      width: 10,
                      service_id: service.service_id,
                      cartItemId: cartItemId,
                    }),
                    shippingService.calculateDeliveryTime({
                      service_id: service.service_id,
                      cartItemId: cartItemId,
                    }),
                  ]);

                  const expectedDeliveryDate = new Date(timeResponse.data.expected_delivery_time);
                  fallbackTime = `Nhận hàng dự kiến ${expectedDeliveryDate.toLocaleDateString('vi-VN', {
                    weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric',
                    timeZone: 'Asia/Ho_Chi_Minh',
                  })}`;
                } catch (apiError) {
                  console.warn(`API failed for service ${service.service_id}, using fallback values:`, apiError);
                  // Sử dụng giá trị fallback khi API lỗi
                }

                const finalPrice = feeResponse?.data?.total || fallbackPrice;
                const finalTime = fallbackTime;

                // Check if this service already exists (from other cartItems)
                const existingMethodIndex = allShippingMethods.findIndex(m => m.service_id === service.service_id);
                
                if (existingMethodIndex >= 0) {
                  // Update existing method with combined price
                  allShippingMethods[existingMethodIndex].price += finalPrice;
                } else {
                  // Add new method
                  allShippingMethods.push({
                    ...service,
                    id: String(service.service_id),
                    name: service.short_name,
                    price: finalPrice,
                    estimatedTime: finalTime,
                    description: feeResponse?.data?.total ? 'Giao hàng tiêu chuẩn' : 'Giao hàng tiêu chuẩn (giá tạm tính)',
                    features: ['Giao giờ hành chính'],
                    icon: service.service_type_id === 5 ? 'package' : 'truck',
                  } as ShippingMethod);
                }
              } catch (error) {
                console.error(`Failed to process service ${service.service_id} for cartItem ${cartItemId}:`, error);
                // Thêm service với giá fallback ngay cả khi có lỗi
                const existingMethodIndex = allShippingMethods.findIndex(m => m.service_id === service.service_id);
                
                if (existingMethodIndex < 0) {
                  allShippingMethods.push({
                    ...service,
                    id: String(service.service_id),
                    name: service.short_name || 'Giao hàng tiêu chuẩn',
                    price: 30000, // Giá fallback 30k VND
                    estimatedTime: 'Nhận hàng dự kiến 3-5 ngày làm việc',
                    description: 'Giao hàng tiêu chuẩn (giá tạm tính)',
                    features: ['Giao giờ hành chính'],
                    icon: service.service_type_id === 5 ? 'package' : 'truck',
                  } as ShippingMethod);
                }
              }
            }
          }
        } catch (error) {
          console.error(`Failed to fetch services for cartItem ${cartItemId}:`, error);
        }
      }
      
      setShippingMethods(allShippingMethods);
    } catch (err: any) {
      console.error('Error fetching shipping services:', err);
      setError('Không thể tải danh sách dịch vụ vận chuyển.');
    } finally {
      setLoading(false);
    }
  };
  
  // Auto fetch when shipping info changes
  useEffect(() => {
    if (shippingInfo?.districtId && shippingInfo?.wardCode) {
      fetchShippingServices();
    }
  }, [shippingInfo?.districtId, shippingInfo?.wardCode, effectiveShopId, shopOrders]);
  
  return {
    shippingMethods,
    loading,
    error,
    refetch: fetchShippingServices,
  };
};
