import RetryPaymentPage from './RetryPaymentPage';

interface RetryPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function Page({ params }: RetryPageProps) {
  const { orderId } = await params;
  return <RetryPaymentPage orderId={orderId} />;
}
