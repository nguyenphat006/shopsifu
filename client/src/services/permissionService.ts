import { privateAxios, publicAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import {
    PerGetAllResponse,
    PerGetByIdResponse,
    PerUpdateRequest,
    PerUpdateResponse,
    PerCreateRequest,
    PerCreateResponse,
    PerDeleteResponse
} from '@/types/auth/permission.interface';
import { PaginationRequest } from '@/types/base.interface';

export const permissionService = {
    // Lấy tất cả permissions
    getAll: async (params?: PaginationRequest, signal?: AbortSignal): Promise<PerGetAllResponse> => {
        try {
          const response = await privateAxios.get(API_ENDPOINTS.PERMISSION.GETALL, {
            params: params,
            signal: signal
          })
          return response.data
        } catch (error) {
          throw error
        }
    },
      

    // Lấy chi tiết permission theo ID
    getById: async (id: string, signal?: AbortSignal): Promise<PerGetByIdResponse> => {
        try {
            const url = API_ENDPOINTS.PERMISSION.GETBYID.replace(':id', id);
            const response = await privateAxios.get(url, { signal });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo permission mới
    create: async (data: PerCreateRequest, signal?: AbortSignal): Promise<PerCreateResponse> => {
        try {
            const response = await privateAxios.post(API_ENDPOINTS.PERMISSION.POST, data, { signal });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật permission theo ID
    update: async (id: string, data: PerUpdateRequest, signal?: AbortSignal): Promise<PerUpdateResponse> => {
        try {
            const url = API_ENDPOINTS.PERMISSION.UPDATE.replace(':id', id);
            const response = await privateAxios.put(url, data, { signal });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xoá permission theo ID
    delete: async (id: string, signal?: AbortSignal): Promise<PerDeleteResponse> => {
        try {
            const url = API_ENDPOINTS.PERMISSION.DELETE_BY_ID.replace(':id', id);
            const response = await privateAxios.delete(url, { signal });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy danh sách quyền của một vai trò cụ thể
    // getRolePermissions: async (roleId: string) => {
    //     try {
    //         const url = API_ENDPOINTS.PERMISSION.GET_ROLE_PERMISSIONS.replace(':id', roleId);
    //         const response = await privateAxios.get(url);
    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    // Cập nhật quyền cho một vai trò
    // updateRolePermissions: async (roleId: string, permissions: string[]) => {
    //     try {
    //         const url = API_ENDPOINTS.PERMISSION.UPDATE_ROLE_PERMISSIONS.replace(':id', roleId);
    //         const response = await privateAxios.put(url, { permissions });
    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
};
