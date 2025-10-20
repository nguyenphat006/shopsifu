import { BaseEntity, BaseResponse, PaginationMetadata } from "./base.interface";

/**
 * @interface ClientVariant
 * @description Represents a product variant attribute for client-side display
 */
export interface ClientVariant {
    value: string;
    options: string[];
}

/**
 * @interface ClientSku
 * @description Represents a SKU object for client-side display
 */
export interface ClientSku extends BaseEntity {
    value: string;
    price: number;
    stock: number;
    image: string | null;
    productId: string;
}

/**
 * @interface ClientCategory
 * @description Represents a category object for client-side display
 */
export interface ClientCategory extends BaseEntity {
    name: string;
    parentCategoryId: string | null;
    logo: string | null;
    categoryTranslations: any[];
}

/**
 * @interface ClientBrand
 * @description Represents a brand object for client-side display
 */
export interface ClientBrand extends BaseEntity {
    name: string;
    logo: string | null;
    brandTranslations: any[];
}

/**
 * @interface ClientProductTranslation
 * @description Represents translations for client-side products
 */
export interface ClientProductTranslation {
    productId: string;
    languageCode: string;
    name: string;
    description: string;
}

/**
 * @interface ClientProduct
 * @description Represents a product for client-side display (list view)
 */
export interface ClientProduct extends BaseEntity {
    publishedAt: string | null;
    name: string;
    description: string;
    basePrice: number;
    virtualPrice: number;
    brandId: string;
    images: string[];
    variants: ClientVariant[];
    productTranslations: ClientProductTranslation[];
}

/**
 * @interface ClientProductDetail
 * @description Represents a detailed product for client-side display (detail view)
 */
export interface ClientProductDetail extends ClientProduct {
    skus: ClientSku[];
    categories: ClientCategory[];
    brand: ClientBrand;
}

/**
 * @interface ClientProductsResponse
 * @description Represents the API response for client-side product listing
 */
export interface ClientProductsResponse extends BaseResponse {
    data: ClientProduct[];
    metadata?: PaginationMetadata;
}

/**
 * @interface ClientProductDetailResponse
 * @description Represents the API response for client-side product detail
 */
export interface ClientProductDetailResponse extends BaseResponse {
    data: ClientProductDetail;
}

/**
 * @interface ClientProductsListParams
 * @description Parameters for client product listing
 */
export interface ClientProductsListParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    categoryId?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
}

/**
 * @interface ProductSpecification
 * @description Represents a product specification attribute-value pair
 */
export interface ProductSpecification {
    name: string;
    value: string;
}

/**
 * @interface ProductAttribute
 * @description Represents a product attribute name-value pair
 */
export interface ProductAttribute {
    attrName: string;
    attrValue: string;
}

/**
 * @interface ClientSearchResultItem
 * @description Represents a single item in search results
 */
export interface ClientSearchResultItem {
    skuId: string;
    productId: string;
    skuValue: string;
    skuPrice: number;
    skuStock: number;
    skuImage: string;
    productName: string;
    productDescription: string;
    productImages: string[];
    brandId: string;
    brandName: string;
    categoryIds: string[];
    categoryNames: string[];
    specifications: ProductSpecification[];
    variants: ClientVariant[];
    attrs: ProductAttribute[];
    createdAt: string;
    updatedAt: string;
}

/**
 * @interface ClientSearchResponse
 * @description Represents the API response for search functionality
 */
export interface ClientSearchResponse extends BaseResponse {
    data: ClientSearchResultItem[];
    metadata: PaginationMetadata;
}

/**
 * @interface ClientSearchParams
 * @description Parameters for search API
 */
export interface ClientSearchParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    categories?: string;
    brandId?: string;
    minPrice?: number;
    maxPrice?: number;
    [key: string]: any; // For additional dynamic parameters
}
