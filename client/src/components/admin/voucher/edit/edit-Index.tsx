"use client";

import { useEditVoucher } from '../hook/useEditVoucher';
import { Discount } from '@/types/discount.interface';
import VoucherBasicInfo from '../new/new-BasicInfo';
import VoucherDiscountSettings from '../new/new-SettingsVoucher';
import VoucherShowSettings from '../new/new-ShowVoucher';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VoucherEditIndexProps {
  voucher: Discount;
  userData: any;
  onEditSuccess?: () => void;
}

export function VoucherEditIndex({ voucher, userData, onEditSuccess }: VoucherEditIndexProps) {
  const router = useRouter();

  const { 
    formData, 
    updateFormData, 
    errors, 
    voucherType, 
    useCase,
    isEdit,
    submitVoucher, 
    resetForm, 
    isLoading 
  } = useEditVoucher({ 
    voucher,
    userData,
    onEditSuccess: onEditSuccess || (() => {
      // Redirect về trang danh sách voucher sau khi cập nhật thành công
      router.push('/admin/voucher');
    })
  });

  const handleCancel = () => {
    resetForm();
    router.push('/admin/voucher');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Form Content */}
      <div className="flex-grow space-y-6">
        <VoucherBasicInfo 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={errors} 
          useCase={useCase}
          isEdit={isEdit}
        />
        <VoucherDiscountSettings 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={errors} 
          useCase={useCase} 
          voucherType={voucherType}
          isEdit={isEdit}
        />
        <VoucherShowSettings 
          formData={formData} 
          updateFormData={updateFormData} 
          errors={errors} 
          useCase={useCase} 
          voucherType={voucherType}
          isEdit={isEdit}
        />
      </div>

      {/* Sticky Footer */}
      <div className="rounded-sm sticky bottom-0 mt-6 bg-white/95 backdrop-blur-lg border shadow-lg border-gray-200 p-4 z-10">
        <div className="flex justify-end items-center gap-4">
          <Button variant="outline" size="lg" onClick={handleCancel} disabled={isLoading} className="h-11">
            Hủy
          </Button>
          <Button size="lg" onClick={submitVoucher} disabled={isLoading} className="h-11 bg-red-600 hover:bg-red-700">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật voucher'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VoucherEditIndex;
