'use client'
import dynamic from "next/dynamic";
import { VoucherUseCase } from "@/components/admin/voucher/hook/voucher-config";

interface VoucherFormWrapperProps {
  useCase: VoucherUseCase;
  onCreateSuccess?: () => void;
}

const VoucherFormDynamic = dynamic(
  () => import("./new-Index").then(mod => ({ default: mod.VoucherNewIndex })),
  { ssr: false }
);

export default function VoucherFormWrapper({ useCase, onCreateSuccess }: VoucherFormWrapperProps) {
  return (
    <VoucherFormDynamic 
      useCase={useCase}
      onCreateSuccess={onCreateSuccess}
    />
  );
}
