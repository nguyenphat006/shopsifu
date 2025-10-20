"use client";

import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { OrderTabs } from "./orders-Tabs";
import { OrderDateFilter } from "./orders-DateFilter";
import { OrderTabContent } from "./orders-TabsContents";
import { useOrder } from "./useOrder";
import { OrderStatus } from "@/types/order.interface";

export default function OrderHistory() {
  const { fetchAllOrders, fetchOrdersByStatus } = useOrder();

  const [currentTab, setCurrentTab] = useState("all");
  const [counts, setCounts] = useState({
    all: 0,
    pendingPayment: 0,
    pendingPackaging: 0,
    pickuped: 0,
    pendingDelivery: 0,
    delivered: 0,
    returned: 0,
    cancelled: 0,
  });

  // 👇 Đặt useEffect ở đây
  useEffect(() => {
    const fetchCounts = async () => {
      const [
        allRes,
        pendingPaymentRes,
        pendingPackagingRes,
        pickupedRes,
        pendingDeliveryRes,
        deliveredRes,
        returnedRes,
        cancelledRes,
      ] = await Promise.all([
        fetchAllOrders(1, 1),
        fetchOrdersByStatus(OrderStatus.PENDING_PAYMENT, 1, 1),
        fetchOrdersByStatus(OrderStatus.PENDING_PACKAGING, 1, 1),
        fetchOrdersByStatus(OrderStatus.PICKUPED, 1, 1),
        fetchOrdersByStatus(OrderStatus.PENDING_DELIVERY, 1, 1),
        fetchOrdersByStatus(OrderStatus.DELIVERED, 1, 1),
        fetchOrdersByStatus(OrderStatus.RETURNED, 1, 1),
        fetchOrdersByStatus(OrderStatus.CANCELLED, 1, 1),
      ]);

      setCounts({
        all: allRes?.metadata?.totalItems ?? 0,
        pendingPayment: pendingPaymentRes?.metadata?.totalItems ?? 0,
        pendingPackaging: pendingPackagingRes?.metadata?.totalItems ?? 0,
        pickuped: pickupedRes?.metadata?.totalItems ?? 0,
        pendingDelivery: pendingDeliveryRes?.metadata?.totalItems ?? 0,
        delivered: deliveredRes?.metadata?.totalItems ?? 0,
        returned: returnedRes?.metadata?.totalItems ?? 0,
        cancelled: cancelledRes?.metadata?.totalItems ?? 0,
      });
    };

    fetchCounts();
  }, [fetchAllOrders, fetchOrdersByStatus]);

  console.log("Counts:", counts);

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      className="w-full bg-white min-h-[70vh] rounded-none shadow-none md:min-h-[85vh] md:rounded-xl md:shadow-sm"
    >
      {/* Tabs list */}
      <OrderTabs counts={counts} />

      {/* Bộ lọc ngày */}
      <OrderDateFilter />

      {/* Nội dung tab */}
      <OrderTabContent currentTab={currentTab} onTabChange={setCurrentTab} />
    </Tabs>
  );
}
