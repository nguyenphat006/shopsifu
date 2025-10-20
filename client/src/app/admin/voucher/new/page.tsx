'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import VoucherFormWrapper from "@/components/admin/voucher/new/voucher-form-Wrapper";
import { VoucherUseCase } from "@/components/admin/voucher/hook/voucher-config";

export default function NewVoucherPage() {
  const router = useRouter();
  const t = useTranslations("admin.ModuleVouchers");
  const searchParams = useSearchParams();
  const useCaseParam = searchParams.get('usecase') || '1';
  
  // Convert string to VoucherUseCase enum
  const getUseCase = (param: string): VoucherUseCase => {
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
  };
  
  const useCase = getUseCase(useCaseParam);

  const getTitle = () => {
    switch (useCase) {
      case VoucherUseCase.PRODUCT:
        return t('title_product');
      case VoucherUseCase.PRIVATE:
        return t('title_private');
      case VoucherUseCase.PLATFORM:
        return 'Tạo Voucher Toàn Nền Tảng';
      case VoucherUseCase.CATEGORIES:
        return 'Tạo Voucher Theo Danh Mục';
      case VoucherUseCase.BRAND:
        return 'Tạo Voucher Theo Thương Hiệu';
      case VoucherUseCase.SHOP_ADMIN:
        return 'Tạo Voucher Shop (Admin)';
      case VoucherUseCase.PRODUCT_ADMIN:
        return 'Tạo Voucher Sản Phẩm (Admin)';
      case VoucherUseCase.PRIVATE_ADMIN:
        return 'Tạo Voucher Riêng Tư (Admin)';
      default:
        return t('title_shop');
    }
  };

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <div className="flex items-center gap-2">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/voucher">{t("breadcrumb.vouchers")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("breadcrumb.newPage")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <h1 className="text-3xl font-semibold">
            {getTitle()}
          </h1>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-start gap-6">
        <VoucherFormWrapper
          useCase={useCase}
          onCreateSuccess={() => {
            router.push(`/admin/voucher`);
          }}
        />
      </div>
    </main>
  );
}