import { privateAxios, publicAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import {
  GetProvincesResponse,
  GetDistrictsParams,
  GetDistrictsResponse,
  GetWardsParams,
  GetWardsResponse,
  CalculateShippingFeeRequest,
  CalculateShippingFeeResponse,
  DeliveryTimeRequest,
  DeliveryTimeResponse,
  ShippingServiceResponse,
  GetOrderInfoParams,
  GetOrderInfoResponse,
} from "@/types/shipping.interface";

export const shippingService = {
  // 1. Get All Provinces
  getProvinces: async (signal?: AbortSignal): Promise<GetProvincesResponse> => {
    const response = await publicAxios.get(
      API_ENDPOINTS.ADDRESS.GET_PROVINCES,
      {
        signal,
      }
    );
    return response.data;
  },

  // 2. Get Districts by Province ID
  getDistricts: async (
    params: GetDistrictsParams,
    signal?: AbortSignal
  ): Promise<GetDistrictsResponse> => {
    const response = await publicAxios.get(
      API_ENDPOINTS.ADDRESS.GET_DISTRICTS,
      {
        params,
        signal,
      }
    );
    return response.data;
  },

  // 3. Get Wards by District ID
  getWards: async (
    params: GetWardsParams,
    signal?: AbortSignal
  ): Promise<GetWardsResponse> => {
    const response = await publicAxios.get(API_ENDPOINTS.ADDRESS.GET_WARDS, {
      params,
      signal,
    });
    return response.data;
  },

  // 4. Calculate Shipping Fee (for future use)
  calculateShippingFee: async (
    data: CalculateShippingFeeRequest,
    signal?: AbortSignal
  ): Promise<CalculateShippingFeeResponse> => {
    const response = await privateAxios.post(
      API_ENDPOINTS.SHIPPING.CALCULATE_FEE,
      data,
      { signal }
    );
    return response.data;
  },

  // 5. Calculate Delivery Time
  calculateDeliveryTime: async (
    data: DeliveryTimeRequest,
    signal?: AbortSignal
  ): Promise<DeliveryTimeResponse> => {
    const response = await privateAxios.post(
      API_ENDPOINTS.SHIPPING.DELIVERY_TIME,
      data,
      { signal }
    );
    return response.data;
  },

  // 6. Get Shipping Services
  getServices: async (
    params: { cartItemId: string },
    signal?: AbortSignal
  ): Promise<ShippingServiceResponse> => {
    const response = await privateAxios.get(API_ENDPOINTS.SHIPPING.SERVICE, {
      params,
      signal,
    });
    return response.data;
  },

  // 7. Get Order Info by orderCode
  getOrderInfo: async (
    params: GetOrderInfoParams,
    signal?: AbortSignal
  ): Promise<GetOrderInfoResponse> => {
    const response = await privateAxios.get(API_ENDPOINTS.SHIPPING.ORDER_INFO, {
      params,
      signal,
    });
    return response.data;
  },
};

export default shippingService;
