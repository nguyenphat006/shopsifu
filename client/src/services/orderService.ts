import { privateAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import {
  OrderGetAllParams,
  OrderGetAllResponse,
  OrderGetByIdResponse,
  OrderCreateRequest,
  OrderCreateResponse,
  OrderCancelResponse,
  OrderStatus,
  CreatePaymentVnPayUrl,
  CreatePaymentVnPayUrlResponse,
  CalculateOrderRequest,
  CalculateOrderResponse,
  ManageOrderGetAllParams,
  ManageOrderGetAllResponse,
  ManageOrderGetByIdResponse,
  UpdateStatusRequest
} from "@/types/order.interface";

export const orderService = {
  // ✅ Lấy tất cả đơn hàng (filter, sort, search, pagination)
  getAll: async (
    params?: OrderGetAllParams,
    signal?: AbortSignal
  ): Promise<OrderGetAllResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.ORDERS.GETALL, {
        params,
        signal,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Lấy đơn hàng theo status (PENDING_PAYMENT, DELIVERED, ...)
  getByStatus: async (
    status: OrderStatus,
    params?: Omit<OrderGetAllParams, "status">,
    signal?: AbortSignal
  ): Promise<OrderGetAllResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.ORDERS.GETALL, {
        params: { ...params, status },
        signal,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Lấy chi tiết đơn hàng
  getById: async (
    orderId: string,
    signal?: AbortSignal
  ): Promise<OrderGetByIdResponse> => {
    try {
      const url = API_ENDPOINTS.ORDERS.GET_BY_ID.replace(":orderId", orderId);
      const response = await privateAxios.get(url, { signal });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Tạo đơn hàng mới
  create: async (
    data: OrderCreateRequest,
    signal?: AbortSignal
  ): Promise<OrderCreateResponse> => {
    try {
      const response = await privateAxios.post(
        API_ENDPOINTS.ORDERS.CREATE,
        data,
        { signal }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Huỷ đơn hàng
  cancel: async (
    orderId: string,
    signal?: AbortSignal
  ): Promise<OrderCancelResponse> => {
    try {
      const url = API_ENDPOINTS.ORDERS.CANCEL.replace(":orderId", orderId);
      const response = await privateAxios.put(url, { signal });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Tính toán đơn hàng
  calculateOrder: async (
    data: CalculateOrderRequest,
    signal?: AbortSignal
  ): Promise<CalculateOrderResponse> => {
    try {
      const response = await privateAxios.post(
        API_ENDPOINTS.ORDERS.CALCULATE_ORDER,
        data,
        { signal }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createPaymentVnPayUrl: async (
    data: CreatePaymentVnPayUrl,
    signal?: AbortSignal
  ): Promise<CreatePaymentVnPayUrlResponse> => {
    try {
      const response = await privateAxios.post(
        API_ENDPOINTS.ORDERS.CREATE_PAYMENT_VNPAY_URL,
        data,
        { signal }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  verifyVNPayReturn: async (
    queryString: string,
    signal?: AbortSignal
  ): Promise<any> => {
    try {
      console.log('[VNPay API] Verifying payment with query:', queryString);
      const response = await privateAxios.get(
        `/payment/vnpay/verify-return?${queryString}`,
        { signal }
      );
      console.log('[VNPay API] Verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in verifyVNPayReturn:', error);
      throw error;
    }
  },
};

// ==================================================
// MANAGE ORDER SERVICE
// ==================================================
export const manageOrderService = {
  // ✅ Lấy tất cả đơn hàng manage (filter, sort, search, pagination)
  getAll: async (
    params?: ManageOrderGetAllParams,
    signal?: AbortSignal
  ): Promise<ManageOrderGetAllResponse> => {
    try {
      const response = await privateAxios.get(API_ENDPOINTS.MANAGE_ORDER.GETALL, {
        params,
        signal,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Lấy chi tiết đơn hàng manage theo ID
  getById: async (
    orderId: string,
    signal?: AbortSignal
  ): Promise<ManageOrderGetByIdResponse> => {
    try {
      const url = API_ENDPOINTS.MANAGE_ORDER.GET_BY_ID.replace(":orderId", orderId);
      const response = await privateAxios.get(url, { signal });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateStatus: async (
    orderId: string,
    data: UpdateStatusRequest,
    signal?: AbortSignal
  ): Promise<ManageOrderGetByIdResponse> => {
    try {
      const url = API_ENDPOINTS.MANAGE_ORDER.UPDATE_STATUS.replace(":orderId", orderId);
      const response = await privateAxios.put(url, data, { signal });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
