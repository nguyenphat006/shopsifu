import { BaseResponse, PaginationRequest, PaginationMetadata } from "./base.interface";

// ==================================================
// ENUMS
// ==================================================

export enum DisplayType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
export enum VoucherType {
  SHOP = 'SHOP',
  PRODUCT = 'PRODUCT',
  PRIVATE = 'PRIVATE',
  PLATFORM = 'PLATFORM',
  CATEGORY = 'CATEGORY',
  BRAND = 'BRAND',
}
export enum DiscountApplyType {
  ALL = 'ALL',
  SPECIFIC = 'SPECIFIC',
}
export enum DiscountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}
export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIX_AMOUNT = 'FIX_AMOUNT',
}
// ==================================================
// BASE INTERFACE
// ==================================================
export interface Discount {
  id: string;
  name: string;
  description: string;
  code: string;
  value: number;
  maxDiscountValue?: number | null; // Có thể null cho trường hợp không giới hạn
  minOrderValue: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  usesCount: number;
  maxUsesPerUser: number;
  usersUsed: string[];
  shopId: string | null; // PLATFORM voucher có thể có shopId = null
  isPlatform: boolean;
  voucherType: VoucherType;
  discountType: DiscountType;
  discountApplyType: DiscountApplyType;
  discountStatus: DiscountStatus;
  displayType?: DisplayType;
  productIds?: string[];
  categories?: string[];
  brands?: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================================================
// SERVICE PARAMS & RESPONSES
// ==================================================

// 1. Get All Discounts (Admin)
export interface DiscountGetAllParams extends PaginationRequest {
  status?: DiscountStatus;
  type?: DiscountType;
  search?: string;
  createdById?: string;
}
export interface DiscountGetAllResponse extends BaseResponse {
  data: Discount[];
  metadata: PaginationMetadata;
}

// 2. Get Discount By ID
export interface DiscountGetByIdResponse extends BaseResponse {
  data: Discount;
}

// 3. Create Discount
export type CreateDiscountRequest = Omit<Discount, 'id' | 'usesCount' | 'usersUsed' | 'createdAt' | 'updatedAt'>;
export interface CreateDiscountResponse extends BaseResponse {
  data: Discount;
}

// 4. Update Discount
export type UpdateDiscountRequest = Partial<CreateDiscountRequest>;
export interface UpdateDiscountResponse extends BaseResponse {
  data: Discount;
}

// 5. Delete Discount
export interface DeleteDiscountResponse extends BaseResponse {} // No data expected

// 6. Get Guest Discount List
export interface GetGuestDiscountListRequest {
  onlyShopDiscounts?: boolean;
  onlyPlatformDiscounts?: boolean;
  cartItemIds: string; // Comma-separated string of cart item IDs
}
export interface GuestGetDiscountListResponse extends BaseResponse {
  data: Discount[];
}

// 7. Validate Discount Code
export interface ValidateDiscountRequest {
  code: string;
  cartItemIds: string[];
}
export interface ValidateDiscountResponseData {
  isValid: boolean;
  message?: string; // For error messages when isValid is false
  discount?: Discount;
  discountAmount?: number;
  finalOrderTotal?: number;
}
export interface ValidateDiscountResponse extends BaseResponse {
  data: ValidateDiscountResponseData;
}
