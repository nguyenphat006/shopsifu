import BrandTableWrapper from "@/components/admin/brand/brand-Wrapper";
import { useTranslations } from "next-intl";

import { metadataConfig } from '@/lib/metadata'
import type { Metadata } from 'next'
export const metadata: Metadata = metadataConfig['/admin/brand']

export default function BrandPage() {
  const t = useTranslations()
  return (
    <div className="space-y-6 p-6 bg-white h-screen">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("admin.brand.title")}</h2>
        <p className="text-muted-foreground">
          {t("admin.brand.subtitle")}
        </p>
      </div>
      <BrandTableWrapper />
    </div>
  )
}
