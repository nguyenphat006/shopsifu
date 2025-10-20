import { useCallback, useState } from "react";
// Update the import path if alias '@' is not configured
import { GetOrderInfoResponse } from "@/types/shipping.interface";
import shippingService from "@/services/shippingService";

export function useOrderInfo() {
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState<GetOrderInfoResponse["data"] | null>(null);

  const fetchOrderInfo = useCallback(async (orderCode: string) => {
    if (!orderCode) return null;
    try {
      setLoading(true);
      const res = await shippingService.getOrderInfo({ orderCode });
      setOrderInfo(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching GHN order info:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { orderInfo, fetchOrderInfo, loading };
}
