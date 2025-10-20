'use client'
import dynamic from "next/dynamic";
const OrdersDynamic = dynamic(() => import("./orders-Table").then(mod => mod.OrdersTable), { ssr: false });
export default function OrdersWrapper() {
  return <OrdersDynamic />;
}