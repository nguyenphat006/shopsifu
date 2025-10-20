import { BaseResponse, BaseEntity, PaginationMetadata } from "./base.interface"

/**
 * @interface ShopInfo
 * @description Thông tin về shop trong giỏ hàng
 */
export interface ShopInfo {
    id: string;
    name: string;
    avatar?: string;
}

/**
 * @interface ProductInfo
 * @description Thông tin về sản phẩm trong SKU
 */
export interface ProductInfo {
    id: string;
    publishedAt: string;
    name: string;
    description: string;
    basePrice: number;
    virtualPrice: number;
    brandId: string;
    images: string[];
    sku: SkuInfo;
    variants: Array<{
        value: string;
        options: string[];
    }>;
    productTranslations: any[];
}

/**
 * @interface SkuInfo
 * @description Thông tin về SKU trong giỏ hàng
 */
export interface SkuInfo {
    id: string;
    value: string;
    price: number;
    stock: number;
    image: string;
    productId: string;
    product: ProductInfo;
}

/**
 * @interface CartItem
 * @description Đại diện cho một mặt hàng trong giỏ hàng
 */
export interface CartItem extends Partial<BaseEntity> {
    id: string;
    quantity: number;
    skuId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    sku: SkuInfo;
    isSelected?: boolean; // Thêm trường này để hỗ trợ chọn mặt hàng
}

/**
 * @interface ShopCart
 * @description Đại diện cho giỏ hàng của một shop
 */
export interface ShopCart {
    shop: ShopInfo;
    cartItems: CartItem[];
    isSelected?: boolean; // Thêm trường này để hỗ trợ chọn tất cả mặt hàng của shop
}

/**
 * @interface CartListResponse
 * @description Response API khi lấy danh sách giỏ hàng
 */
export interface CartListResponse extends BaseResponse {
    data: ShopCart[];
    metadata?: PaginationMetadata;
}

/**
 * @interface Cart
 * @description Tổng hợp giỏ hàng (được tính toán ở client)
 */
export interface Cart {
    shops: ShopCart[];
    totalItems: number;
    totalPrice: number;
    totalSelectedItems: number;
    totalSelectedPrice: number;
}

/**
 * @interface CartResponse
 * @description Response API khi thực hiện các thao tác với giỏ hàng
 */
export interface CartResponse extends BaseResponse {
    data: CartItem | {
        cartItem?: CartItem;
    };
}

/**
 * @interface CartItemRequest
 * @description Request để thêm sản phẩm vào giỏ hàng
 */
export interface CartItemRequest {
    skuId: string;
    quantity: number;
}

/**
 * @interface UpdateCartItemRequest
 * @description Request để cập nhật sản phẩm trong giỏ hàng
 */
export interface UpdateCartItemRequest {
    skuId: string;
    quantity: number;
    isSelected?: boolean;
}

/**
 * @interface DeleteCartRequest
 * @description Request để xóa các sản phẩm khỏi giỏ hàng
 */
export interface DeleteCartRequest {
    cartItemIds: string[];
}

/**
 * @interface SelectCartItemsRequest
 * @description Request để chọn/bỏ chọn nhiều sản phẩm trong giỏ hàng
 */
export interface SelectCartItemsRequest {
    cartItemIds: string[];
    isSelected: boolean;
}

/**
 * @interface CartSummary
 * @description Tóm tắt thông tin giỏ hàng (được tính toán ở client)
 */
export interface CartSummary {
    totalItems: number;
    totalSelectedItems: number;
    totalPrice: number;
    totalSelectedPrice: number;
    totalShops: number;
}