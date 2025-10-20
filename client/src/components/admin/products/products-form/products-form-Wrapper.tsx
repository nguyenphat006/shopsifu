'use client'
import dynamic from "next/dynamic";
import { ProductDetail } from "@/types/products.interface";

// Định nghĩa Props cho component Wrapper
interface ProductFormWrapperProps {
  initialData?: ProductDetail | null;
  onCreateSuccess?: (newProductId: string) => void;
}

// Dynamic import ProductForm component
const ProductFormDynamic = dynamic(
  () => import("./form-Index").then(mod => mod.ProductForm),
  { ssr: false }
);

export default function ProductFormWrapper({ initialData, onCreateSuccess }: ProductFormWrapperProps) {
  return (
    <ProductFormDynamic 
      initialData={initialData} 
      onCreateSuccess={onCreateSuccess}
    />
  );
}
