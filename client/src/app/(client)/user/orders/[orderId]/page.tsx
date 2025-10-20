import OrderDetail from "@/components/client/user/account/desktop/orders/orders-Detail";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <OrderDetail orderId={orderId} />;
}
