import { BaseResponse, PaginationRequest } from "../base.interface";

// Category data model
export interface Category {
  id: string;
  parentCategoryId: string | null;
  name: string;
  logo: string | null;
  createdById: string | null;
  updatedById: string | null;
  deletedById: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Request interfaces
export interface CategoryCreateRequest {
  name: string;
  logo?: string | null;
  parentCategoryId?: string | null;
}

export interface CategoryUpdateRequest {
  name?: string;
  logo?: string | null;
  parentCategoryId?: string | null;
}

// Response interfaces
export interface CategoryGetAllResponse extends BaseResponse {
  data: Category[];
}

export interface CategoryGetByIdResponse extends BaseResponse {
  data: Category;
}

export interface CategoryCreateResponse extends BaseResponse {
  data: Category;
}

export interface CategoryUpdateResponse extends BaseResponse {
  data: Category;
}

export interface CategoryDeleteResponse extends BaseResponse {
  message: string;
}
