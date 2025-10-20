// src/app/admin/voucher/page.tsx
import { metadataConfig } from "@/lib/metadata";
import type { Metadata } from "next";
import VoucherPageClient from "./VoucherPageClient";

export const metadata: Metadata = metadataConfig["/admin/voucher"];

export default function VoucherPage() {
  return <VoucherPageClient />;
}
