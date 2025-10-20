import { PaginationRequest, PaginationMetadata } from "@/types/base.interface";
import { Discount } from './discount.interface';

export interface OrderGetAllParams extends PaginationRequest {
  sortOrder?: OrderStatus;
  sortBy?: "asc" | "desc";
  search?: string;
}

export enum OrderStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PENDING_PACKAGING = "PENDING_PACKAGING",
  PICKUPED = "PICKUPED",
  PENDING_DELIVERY = "PENDING_DELIVERY",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
  VERIFY_PAYMENT = "VERIFY_PAYMENT",
}

// --- Interfaces cho Tạo Đơn hàng (Create Order) ---
interface ReceiverInfo {
  name: string;
  phone: string;
  address: string;
  provinceId: number;
  districtId: number;
  wardCode: string;
}

// --- Interfaces cho Tạo Đơn hàng (Create Order) ---

/**
 * @interface ShippingInfo
 * @description Thông tin chi tiết về gói hàng và dịch vụ vận chuyển được chọn.
 */
interface ShippingInfo {
  length: number;
  weight: number;
  width: number;
  height: number;
  service_id: number;
  service_type_id: number;
  shippingFee: number;
}

/**
 * @interface ShopOrderCreationInfo
 * @description Thông tin tạo đơn hàng cho một shop cụ thể.
 */
interface ShopOrderCreationInfo {
  shopId: string;
  receiver: ReceiverInfo;
  cartItemIds: string[];
  discountCodes: string[];
  shippingInfo: ShippingInfo;
  isCod: boolean;
}

/**
 * @interface OrderCreateRequest
 * @description Cấu trúc request body để tạo một hoặc nhiều đơn hàng.
 */
export interface OrderCreateRequest {
  shops: ShopOrderCreationInfo[];
  platformDiscountCodes: string[];
}

export interface OrderCreateResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    orders: {
      id: string;
      userId: string;
      status: OrderStatus;
      receiver: {
        name: string;
        phone: string;
        address: string;
      };
      shopId: string;
      paymentId: number;
      createdById: string;
      updatedById: string | null;
      deletedById: string | null;
      deletedAt: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
    paymentId: number;
  }
}

// --- Interfaces cho Lấy Đơn hàng (Get Order) ---

interface OrderReceiver {
  name: string;
  phone: string;
  address: string;
}

interface ProductTranslation {
  id: string;
  name: string;
  description: string;
  languageId: string;
}
 
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productTranslations: ProductTranslation[];
  skuPrice: number;
  image: string;
  skuValue: string;
  skuId: string;
  orderId: string;
  quantity: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  receiver: OrderReceiver;
  shopId: string;
  paymentId: string;
  orderCode: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  totalItemCost: number;
  totalShippingFee: number;
  totalVoucherDiscount: number;
  totalPayment: number;
  totalPrice: number;
}

/**
 * @interface ProductInfo
 * @description Thông tin chi tiết sản phẩm cho trang checkout
 */
export interface ProductInfo {
  id: string;
  shopName: string;
  name: string;
  image: string;
  quantity: number;
  subtotal: number;
  price: number;
  variation?: string; // Thêm thuộc tính variation
}

export interface OrderGetAllResponse {
  data: Order[];
  metadata: PaginationMetadata;
}

export interface OrderGetByIdResponse {
  data: Order;
  metadata: PaginationMetadata;
}


export interface OrderCancelResponse {
  // Dữ liệu trả về sau khi huỷ đơn
  message: string;
}

export interface CreatePaymentVnPayUrl{
  amount: number;
  orderInfo: string;
  orderId: string | number;  // paymentId có thể là string hoặc number từ API
  locale: string | "vn";  
}
export interface CreatePaymentVnPayUrlResponse{
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
      paymentUrl: string;
  }
}

// Interface cho kết quả trả về từ hàm handleCreateOrder
export interface OrderHandlerResult {
  success: boolean;
  paymentMethod?: string;
  orderData?: {
    orders?: any[];
    paymentId?: number;
    [key: string]: any;
  };
  orderId?: string; // The ID of the order (from the first order in orders array)
  paymentId?: number;
  paymentUrl?: string;
  error?: string;
}

// ==================================================
// MANAGE ORDER INTERFACES
// ==================================================

/**
 * @interface ManageOrderUser
 * @description Thông tin user trong manage order
 */
export interface ManageOrderUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

/**
 * @interface ManageOrderProductTranslation
 * @description Thông tin dịch thuật sản phẩm
 */
export interface ManageOrderProductTranslation {
  id: string;
  name: string;
  languageId: string;
}

/**
 * @interface ManageOrderItem
 * @description Chi tiết item trong đơn hàng manage
 */
export interface ManageOrderItem {
  id: string;
  productId: string;
  productName: string;
  productTranslations: ManageOrderProductTranslation[];
  skuPrice: number;
  image: string;
  skuValue: string;
  skuId: string;
  orderId: string;
  quantity: number;
  createdAt: string;
}

/**
 * @interface ManageOrder
 * @description Đơn hàng trong hệ thống quản lý
 */
export interface ManageOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  receiver: {
    name: string;
    phone: string;
    address: string;
  };
  shopId: string;
  paymentId: number;
  createdById: string;
  updatedById: string | null;
  deletedById: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: ManageOrderItem[];
  totalItemCost: number;
  totalShippingFee: number;
  totalVoucherDiscount: number;
  totalPayment: number;
  user?: ManageOrderUser;
  orderCode: string;
}

/**
 * @interface ManageOrderGetAllParams
 * @description Parameters cho API get all manage orders
 */
export interface ManageOrderGetAllParams extends PaginationRequest {
  status?: OrderStatus;
  shopId?: string;
  userId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * @interface ManageOrderGetAllResponse
 * @description Response cho API get all manage orders
 */
export interface ManageOrderGetAllResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  data: ManageOrder[];
  metadata: PaginationMetadata;
}

/**
 * @interface ManageOrderGetByIdResponse
 * @description Response cho API get manage order by ID
 */
export interface ManageOrderGetByIdResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  data: ManageOrder;
}

export interface UpdateStatusRequest{
  status: OrderStatus
  note: string;
}
/**
 * @interface Calculate Order
 * @description API Tính toán giá trị đơn hàng kèm mã giảm giá
 */
/**
 * @interface ShopCalculationInfo
 * @description Thông tin để tính toán giá trị đơn hàng cho một shop.
 */
interface ShopCalculationInfo {
  shopId: string;
  cartItemIds: string[];
  shippingFee: number;
  discountCodes: string[];
}

/**
 * @interface CalculateOrderRequest
 * @description Cấu trúc request body để tính toán giá trị cuối cùng của đơn hàng.
 */
export interface CalculateOrderRequest {
  shops: ShopCalculationInfo[];
  platformDiscountCodes: string[];
}
export interface CalculateOrderResponse{
  statusCode: number;
  message: string;
  timestamp: string;
  data: {
    totalItemCost: number;
    totalShippingFee: number;
    totalVoucherDiscount: number;
    totalPayment: number;
    shops: {
      shopId: string;
      itemCost: number;
      shippingFee: number;
      voucherDiscount: number;
      platformVoucherDiscount: number;
      itemCount: number;
      payment: number;
    }[];
  };
}

export interface AppliedVoucherInfo {
  code: string;
  discount: Discount;
  discountAmount: number;
}
