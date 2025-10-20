// src/app/admin/voucher/VoucherPageClient.tsx
"use client";

import VoucherDynamic from "@/components/admin/voucher/voucher-Wrapper";
import { useTranslations } from "next-intl";

export default function VoucherPageClient() {
  const t = useTranslations();

  return (
    <div className="space-y-6 p-6 bg-white h-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t("admin.ModuleVouchers.title")}
        </h2>
        <p className="text-muted-foreground">
          {t("admin.ModuleVouchers.subtitle")}
        </p>
      </div>
      <VoucherDynamic />
    </div>
  );
}
