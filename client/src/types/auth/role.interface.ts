import { BaseResponse, PaginationRequest } from "../base.interface";


export interface Permission {
    id: string;  // Thay đổi từ number sang string cho UUID
    name: string;
    description: string;
    module: string;
    path: string;
    method: string;
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export type RoleType = 'admin' | 'seller' | 'client' | 'editor';

export interface RoleRequest {
    name: string;
    description: string;
    role: RoleType;
    isActive: boolean;
}

export interface RoleResponse {
    id: string;
    name: string;
    description: string;
    role: RoleType;
    isActive: boolean;
    permissions: Array<Permission>;
    createdAt: number;
    updatedAt: number;
}

export interface RoleGetAllResponse extends BaseResponse, PaginationRequest {
  data: Array<{
    id: string;  // Thay đổi từ number sang string cho UUID
    name: string;
    description: string;
    isActive: boolean;
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface RoleGetByIdResponse {
    id: string;  // Thay đổi từ number sang string cho UUID
    name: string;
    description: string;
    isActive: boolean;
    permissions: Permission[];
    createdById: string | null;
    updatedById: string | null;
    deletedById: string | null;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RoleCreateRequest {
    name: string;
    description?: string;
    isActive?: boolean;
    isSystemRole?: boolean;
    isSuperAdmin?: boolean;
    permissionIds?: string[];  // Thêm permissionIds cho phép tạo vai trò với quyền
}

export interface RoleCreateResponse extends BaseResponse {
    data:{
        id: string,  // Thay đổi từ number sang string cho UUID
        name: string,
        description: string,
        createdById: string,
        updatedById: string,
        deletedById: string,
        deletedAt: string,
        createdAt: string,
        updatedAt: string,
        isSystemRole: boolean,
        isSuperAdmin: boolean,
        permissions: Permission[]
    }
   
}

export interface RoleUpdateRequest {
    name?: string;
    description?: string;
    isActive?: boolean;
    isSystemRole?: boolean;
    isSuperAdmin?: boolean;
    permissionIds?: string[];  // Thay đổi từ number[] sang string[] cho UUID
}

export interface RoleUpdateResponse extends BaseResponse {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: Permission[];
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface RoleDeleteRequest {
    id: string;
    hardDelete?: boolean;
}

export interface RoleDeleteResponse {
    message: string;
}

export interface RoleAssignPermissionRequest {
    id: string;
    permissionIds: string[];
}

export interface RoleAssignPermissionResponse {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: Permission[];
    createdById: string;
    updatedById: string;
    deletedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface Role {
  id: string;  // Thay đổi từ number sang string cho UUID
  name: string;
  description?: string;
  isActive: boolean;
  createdById?: string;
  updatedById?: string;
  deletedById?: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  permissions?: Permission[];
}