import DashboardIndex from "@/components/client/user/account/desktop/dashboard/dashboard-Index";
import { metadataConfig } from '@/lib/metadata';
import type { Metadata } from 'next'; 
export const metadata: Metadata = metadataConfig['/user/dashboard'];

export default function DashboardPage() {
  return <DashboardIndex />;
}
