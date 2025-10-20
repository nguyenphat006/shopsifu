import OrderHistory from "@/components/client/user/account/desktop/orders/orders-Index";

import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'  
export const metadata: Metadata = metadataConfig['/user/orders']
export default function HistoryOrdersPage() {
  return <OrderHistory />;
}
