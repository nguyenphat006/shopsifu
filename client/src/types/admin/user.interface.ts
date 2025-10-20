import { BaseResponse } from "@/types/base.interface";

export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  search?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  phoneNumber: string;
  bio: string;
  avatar: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedById: string | null;
  updatedById: string | null;
  createdById: string | null;
}

// export interface User {
//   id: number;
//   email: string;
//   status: string;
//   roleId: number;
//   isEmailVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
//   userProfile?: UserProfile;
// }

export interface UserRole {
  id: string;
  name: string;
}

export interface UserAddress {
    id: string
    name: string,
    recipient: string,
    phoneNumber: string,
    province: string,
    district: string,
    ward: string,
    provinceId: number,
    districtId: number,
    wardCode: string,
    street: string,
    addressType: string,
    createdById: string,
    updatedById: null,
    deletedById: null,
    deletedAt: null,
    createdAt: string,
    updatedAt: string,
    isDefault: false
}
export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  status: string;
  roleId: string;
  createdById: string | null;
  updatedById: string | null;
  deletedById: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  addresses: UserAddress[];
}

// LẤY TẤT CẢ DANH SÁCH NGƯỜI DÙNG - GET ALL USER
export interface UserGetAllResponse extends BaseResponse {
  data: User[];
  metadata: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// TẠO NGƯỜI DÙNG - CREATE USER
export interface UserCreateRequest {
  email: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  password: string;
  confirmPassword?: string; // Made optional since it's only used for frontend validation
  roleId: string;
  status: string;
}

export interface UserCreateResponse extends BaseResponse {
  data: User;
}

// SỬA NGƯỜI DÙNG - UPDATE USER
export interface UserUpdateRequest {
  // id excluded from the request body as it should be provided as URL parameter only
  email?: string;
  name?: string;
  phoneNumber?: string;
  avatar?: string;
  roleId?: string;
  status?: string;
}

export interface UserUpdateResponse extends BaseResponse {
  data: User;
}

// XÓA NGƯỜI DÙNG - DELETE USER
export interface UserDeleteResponse extends BaseResponse {}
