import PermissionsTableWrapper from "@/components/admin/permissions/permissions-Wrapper";
import { useTranslations } from "next-intl";

import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
export const metadata: Metadata = metadataConfig['/admin/permissions']

export default function PermissionsPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6 p-6 bg-white h-screen">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.permissions.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.permissions.subtitle")}
        </p>
      </div>
      <PermissionsTableWrapper />
    </div>
  )
}