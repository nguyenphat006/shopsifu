import CheckoutMainWrapper from "@/components/client/checkout/checkout-Wrapper";

interface CheckoutPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  // Await params để tương thích với Next.js 15
  const { slug } = await params;
  
  // Parse cartItemIds từ URL param
  const cartItemIds = slug ? slug.split(',').filter(Boolean) : [];
  
  console.log('🛒 Checkout Page - CartItemIds from URL:', {
    rawSlug: slug,
    cartItemIds,
    count: cartItemIds.length
  });
  
  return (
    <CheckoutMainWrapper cartItemIds={cartItemIds} />
  );
}