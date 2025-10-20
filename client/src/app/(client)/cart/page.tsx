import { CartMain } from "@/components/client/cart/cart-Main";

import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
export const metadata: Metadata = metadataConfig['/cart']
export default function CartPage() {
  return <CartMain />;
}