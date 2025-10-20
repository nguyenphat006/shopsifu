"use client";

import { useNewVoucher } from '../hook/useNewVoucher';
import { VoucherUseCase } from '../hook/voucher-config';
import VoucherBasicInfo from './new-BasicInfo';
import VoucherDiscountSettings from './new-SettingsVoucher';
import VoucherShowSettings from './new-ShowVoucher';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUserData } from '@/hooks/useGetData-UserLogin';

interface VoucherNewIndexProps {
  useCase?: VoucherUseCase;
  onCreateSuccess?: () => void;
}

function getUseCase(param: string | null): VoucherUseCase {
  switch (param) {
    case '1':
      return VoucherUseCase.SHOP;
    case '2':
      return VoucherUseCase.PRODUCT;
    case '3':
      return VoucherUseCase.PRIVATE;
    case '4':
      return VoucherUseCase.PLATFORM;
    case '5':
      return VoucherUseCase.CATEGORIES;
    case '6':
      return VoucherUseCase.BRAND;
    case '7':
      return VoucherUseCase.SHOP_ADMIN;
    case '8':
      return VoucherUseCase.PRODUCT_ADMIN;
    case '9':
      return VoucherUseCase.PRIVATE_ADMIN;
    default:
      return VoucherUseCase.SHOP;
  }
}


function VoucherNewContent({ useCase: propUseCase, onCreateSuccess: propOnCreateSuccess }: VoucherNewIndexProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useCaseParam = searchParams.get('usecase');
  const ownerParam = searchParams.get('owner');
  
  // Lấy userData từ Redux state
  const userData = useUserData();

  // Sử dụng useCase từ props nếu có, nếu không thì lấy từ URL params
  const useCase = propUseCase || getUseCase(useCaseParam);
  const owner = (ownerParam === 'PLATFORM' || ownerParam === 'SHOP') ? ownerParam : 'SHOP';

  const { 
    formData, 
    updateFormData, 
    errors, 
    voucherType, 
    submitVoucher, 
    resetForm, 
    isLoading 
  } = useNewVoucher({ 
    useCase, 
    owner,
    userData, // Truyền userData vào hook
    onCreateSuccess: propOnCreateSuccess || (() => {
      // Redirect về trang danh sách voucher sau khi tạo thành công
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
        <VoucherBasicInfo formData={formData} updateFormData={updateFormData} errors={errors} useCase={useCase} />
        <VoucherDiscountSettings formData={formData} updateFormData={updateFormData} errors={errors} useCase={useCase} voucherType={voucherType} />
        <VoucherShowSettings formData={formData} updateFormData={updateFormData} errors={errors} useCase={useCase} voucherType={voucherType} />
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
                Đang lưu...
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function VoucherNewIndex({ useCase, onCreateSuccess }: VoucherNewIndexProps = {}) {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <VoucherNewContent useCase={useCase} onCreateSuccess={onCreateSuccess} />
    </Suspense>
  );
}

export default VoucherNewIndex;