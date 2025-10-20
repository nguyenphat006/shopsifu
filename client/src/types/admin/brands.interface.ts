import { PaginationMetadata, PaginationRequest } from "../base.interface";

// Interface cho Brand Translation
export interface BrandTranslation {
  id?: number;
  brandId: number;
  languageId: number;
  name: string;
  description?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface chính cho Brand
export interface Brand {
  id: string;
  name: string;
  logo?: string;
  createdById?: number;
  updatedById?: number | null;
  deletedById?: number | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  brandTranslations: BrandTranslation[];
}

// Request interface cho create và update
export interface BrandCreateRequest {
  name: string;
  logo?: string;
  translations?: Array<{
    languageId: number;
    name: string;
    description?: string;
  }>;
}

export interface BrandUpdateRequest {
  name?: string;
  logo?: string;
  translations?: Array<{
    languageId: number;
    name?: string;
    description?: string;
  }>;
}

// Response interface
export interface BrandGetAllResponse {
  data: Brand[];
  metadata: PaginationMetadata;
}

export interface BrandGetByIdResponse {
  data: Brand;
}

// Params interface
export interface BrandParams extends PaginationRequest {
  // Thêm các trường tìm kiếm đặc thù cho Brand nếu cần
}