import { ProfileMain } from "@/components/client/user/account/profile/profile-Main";

import { metadataConfig } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = metadataConfig['/user/profile'];
export default function ProfilePage() {
  return (
    <ProfileMain />
  );
}
