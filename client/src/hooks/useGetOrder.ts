import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { orderService } from "@/services/orderService";
import {
  OrderGetAllParams,
  OrderGetAllResponse,
} from "@/types/order.interface";

export const useGetOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderGetAllResponse | null>(null);

  const fetchOrders = useCallback(
    async (
      params?: OrderGetAllParams,
      signal?: AbortSignal
    ): Promise<OrderGetAllResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderService.getAll(params, signal);

        if (!response?.data) {
          throw new Error("Không có dữ liệu đơn hàng");
        }

        setOrders(response);
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Không thể lấy danh sách đơn hàng";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchOrders,
    loading,
    error,
    orders,
  };
};
