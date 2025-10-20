import RolesTableWrapper from "@/components/admin/roles/roles-Wrapper"
import { useTranslations } from "next-intl";

import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
export const metadata: Metadata = metadataConfig['/admin/roles']

export default function RolesPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6 p-6 bg-white h-screen">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.roles.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.roles.subtitle")}
        </p>
      </div>
      <RolesTableWrapper />
      {/* <RolesTable /> */}
    </div>
  )
}