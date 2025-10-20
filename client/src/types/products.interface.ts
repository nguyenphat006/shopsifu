import { BaseEntity, PaginationMetadata, BaseResponse } from "./base.interface";

/**
 * @interface Variant
 * @description Represents a product variant attribute, like 'Color' or 'Size'.
 */
export interface Variant {
    value: string;
    options: string[];
}

/**
 * @interface Sku
 * @description Represents a specific stock keeping unit, a unique combination of variants.
 */
export interface Sku {
    value: string;
    price: number;
    stock: number;
    image: string;
}

/**
 * @interface ProductTranslation
 * @description Represents the translation of a product's text fields into a specific language.
 */
export interface ProductTranslation extends BaseEntity {
    productId: number;
    languageCode: string;
    name: string;
    description: string;
}

/**
 * @interface Product
 * @description Represents the main product entity, extending the base entity.
 */
export interface Product extends BaseEntity{
    publishedAt: string | null;
    name: string;
    basePrice: number;
    virtualPrice: number;
    brandId: number;
    images: string[];
    variants: Variant[];
    skus?: Sku[]; // Optional as it's not in the list response
    categories?: string[]; // Optional as it's not in the list response
    productTranslations: ProductTranslation[];
    message: string;
}

/**
 * @interface ProductsResponse
 * @description Represents the API response for a list of products, including pagination metadata.
 */
export interface ProductsResponse {
    data: Product[];
    metadata: PaginationMetadata;
    message: string;
}

/**
 * @interface ProductCreateRequest
 * @description Represents the payload for creating a new product.
 */
export interface ProductCreateRequest {
    name: string;
    description: string; // Thêm trường description
    publishedAt?: string | null;
    basePrice: number;
    virtualPrice: number;
    brandId: string; // Cập nhật sang string để phù hợp với UUID từ API
    images: string[]; // Mảng string URLs trực tiếp
    categories: string[]; // Cập nhật sang string[] để phù hợp với UUID từ API
    specifications: Array<{
      name: string;
      value: string;
    }>
    variants: Variant[];
    skus: Sku[];
}

/**
 * @interface ProductUpdateRequest
 * @description Represents the payload for updating an existing product. It's a partial of the create request.
 */
export type ProductUpdateRequest = Partial<ProductCreateRequest>;

// --- Interfaces for Product Detail Response ---

/**
 * @interface SkuDetail
 * @description Represents a detailed Sku object from the product detail API endpoint.
 */
export interface SkuDetail extends BaseEntity {
  value: string;
  price: number;
  stock: number;
  image: string | null;
  productId: number;
}

/**
 * @interface CategoryDetail
 * @description Represents a detailed Category object from the product detail API endpoint.
 */
export interface CategoryDetail extends BaseEntity {
  name: string;
  parentCategoryId: number | null;
  logo: string | null;
}

/**
 * @interface BrandDetail
 * @description Represents a detailed Brand object from the product detail API endpoint.
 */
export interface BrandDetail extends BaseEntity {
  name: string;
  logo: string | null;
}

/**
 * @interface ProductDetail
 * @description Represents the detailed product entity from the API, including nested objects.
 */
export interface ProductDetail extends BaseEntity {
  publishedAt: string | null;
  name: string;
  description?: string | null;
  basePrice: number;
  virtualPrice: number;
  brandId: number;
  images: string[];
  variants: Variant[];
  skus: SkuDetail[];
  categories: CategoryDetail[];
  specifications: Array<{
    name: string;
    value: string;
  }>;
  brand: BrandDetail;
  productTranslations: ProductTranslation[];
}

/**
 * @interface ProductDetailResponse
 * @description Represents the full API response for a single product detail.
 */
export interface ProductDetailResponse extends BaseResponse {
  data: ProductDetail;
}