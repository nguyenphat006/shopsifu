import { BaseEntity } from '../base.interface';

export type DiscountType = 'PERCENTAGE' | 'FIX_AMOUNT';
export type DiscountStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'USED';
export type VoucherType = 'SHOP' | 'PRODUCT' | 'ORDER' | 'SHIPPING';
export type DisplayType = 'PUBLIC' | 'PRIVATE' | 'HIDDEN';
export type DiscountApplyType = 'ALL' | 'SPECIFIC_PRODUCTS' | 'SPECIFIC_CATEGORIES';

export interface Voucher extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  value: number;
  code: string;
  startDate: string | Date;
  endDate: string | Date;
  maxUsesPerUser?: number;
  minOrderValue?: number;
  maxUses?: number;
  maxDiscountValue?: number;
  displayType: DisplayType;
  voucherType: VoucherType;
  isPlatform: boolean;
  shopId?: string;
  discountApplyType: DiscountApplyType;
  discountStatus: DiscountStatus;
  discountType: DiscountType;
  usedCount?: number;
  products?: string[];
  categories?: string[];
}

export interface VoucherCreateRequest {
  name: string;
  description?: string;
  value: number;
  code: string;
  startDate: string | Date;
  endDate: string | Date;
  maxUsesPerUser?: number;
  minOrderValue?: number;
  maxUses?: number;
  maxDiscountValue?: number;
  displayType: DisplayType;
  voucherType: VoucherType;
  isPlatform: boolean;
  shopId?: string;
  discountApplyType: DiscountApplyType;
  discountStatus: DiscountStatus;
  discountType: DiscountType;
  products?: string[];
  categories?: string[];
}

export interface VoucherUpdateRequest {
  id: string;
  name?: string;
  description?: string;
  value?: number;
  code?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  maxUsesPerUser?: number;
  minOrderValue?: number;
  maxUses?: number;
  maxDiscountValue?: number;
  displayType?: DisplayType;
  voucherType?: VoucherType;
  isPlatform?: boolean;
  shopId?: string;
  discountApplyType?: DiscountApplyType;
  discountStatus?: DiscountStatus;
  discountType?: DiscountType;
  products?: string[];
  categories?: string[];
}

export interface ValidateVoucherRequest {
  code: string;
  orderValue: number;
  products?: string[];
  shopId?: string;
}
