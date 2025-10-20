"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductFormWrapper from "@/components/admin/products/products-form/products-form-Wrapper";

export default function NewProductPage() {
  const router = useRouter();
  const t = useTranslations("admin.ModuleProduct.AddNew");

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:p-10">
      <div className="mx-auto grid w-full max-w-7xl gap-2">
        <div className="flex items-center gap-2">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/products">{t("page.breadcrumb.products")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("page.breadcrumb.newPage")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div>
          <h1 className="text-3xl font-semibold">
            {t("page.title")}
          </h1>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-start gap-6">
        <ProductFormWrapper 
          onCreateSuccess={(productId: string) => {
            console.log('Navigating to edit page:', `/admin/products/${productId}`);
            router.push(`/admin/products/${productId}`);
          }}
        />
      </div>
    </main>
  );
}