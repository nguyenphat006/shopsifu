"use client";

import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import ProductDetail from "@/components/client/products/desktop/products-Index";
import ProductDetailMobile from "@/components/client/products/mobile/products-IndexMobile";
import { useCheckDevice } from "@/hooks/useCheckDevices";
import { useResponsive } from "@/hooks/useResponsive";
import { useEffect, useState } from "react";
import { useProduct } from "./hooks/useProduct";
import { ClientProductDetail } from "@/types/client.products.interface";

interface ProductPageProps {
  slug: string;
  initialData?: ClientProductDetail;
  error?: any;
}

export function ProductPage({ slug, initialData, error: initialError }: ProductPageProps) {
  const [mounted, setMounted] = useState(false);
  const deviceType = useCheckDevice();
  const { isMobile } = useResponsive();
  
  // Sử dụng hook useProduct để quản lý data
  const { product, isLoading, error } = useProduct(slug, initialData);

  useEffect(() => {
    console.log("✅ [Page] slug param:", slug);
    console.log("✅ [Page] initialData:", initialData ? `Received (${initialData.id})` : "None");
    setMounted(true);
  }, [slug, initialData]);

  if (!mounted || deviceType === "unknown") return null;

  // Xử lý error state
  const productError = error || initialError;
  if (productError) {
    console.error("❌ [ProductPage] Error:", productError);
    // TODO: Thêm component hiển thị lỗi
  }
  
  return (
    <ClientLayoutWrapper
      hideHeader={isMobile}
      hideCommit
      hideHero
      hideFooter={isMobile}
      topContent={isMobile}
      maxWidth={1650}
    >
      {deviceType === "mobile" ? (
        <ProductDetailMobile 
          slug={slug} 
          product={product}
          isLoading={isLoading}
        />
      ) : (
        <ProductDetail 
          slug={slug} 
          product={product}
          isLoading={isLoading}
        />
      )}
    </ClientLayoutWrapper>
  );
}
