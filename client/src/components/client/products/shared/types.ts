// src/components/client/products/shared/types.ts

export interface ProductVariantOption {
  name: string;
  values: string[];
  images?: Record<string, string>;  // Mapping value -> image
}

export interface ProductSku {
  id: string;
  variantCombo: string; // Ví dụ: "Đỏ-XL"
  price: number;
  stock: number;
  image?: string;
}

// UI State interfaces
export interface SelectedVariants {
  [key: string]: string | null; // Ví dụ: { "Màu sắc": "Đỏ", "Kích thước": "XL" }
}

// Cart related types
export interface AddToCartPayload {
  productId: string;
  skuId: string;
  quantity: number;
  selectedVariants: SelectedVariants;
}