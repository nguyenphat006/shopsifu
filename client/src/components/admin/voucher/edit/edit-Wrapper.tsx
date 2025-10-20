'use client'
import dynamic from "next/dynamic";
import { Discount } from '@/types/discount.interface';

interface VoucherEditWrapperProps {
  voucher: Discount;
  userData: any;
  onEditSuccess?: () => void;
}

const VoucherEditDynamic = dynamic(
  () => import("./edit-Index").then(mod => ({ default: mod.VoucherEditIndex })),
  { ssr: false }
);

export default function VoucherEditWrapper({ voucher, userData, onEditSuccess }: VoucherEditWrapperProps) {
  return (
    <VoucherEditDynamic 
      voucher={voucher}
      userData={userData}
      onEditSuccess={onEditSuccess}
    />
  );
}

