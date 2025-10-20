import { privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import {
  UserCreateRequest,
  UserUpdateRequest,
  UserUpdateResponse,
  UserCreateResponse,
  UserGetAllResponse,
  UserDeleteResponse,
  User,
  PaginationMeta
} from '@/types/admin/user.interface';
import { PaginationRequest } from '@/types/base.interface';

export const userService = {
    // Lấy danh sách tất cả người dùng
    async getAll(params: any): Promise<UserGetAllResponse> {
        const response = await privateAxios.get(API_ENDPOINTS.USERS.GETALL, { params });
        return response.data;
    },
    // Lấy thông tin người dùng theo ID
    async getById(id: string): Promise<{ data: User }> {
        const response = await privateAxios.get(
            API_ENDPOINTS.USERS.GETBYID.replace(':id', String(id))
        );
        return response.data;
    },
    // Tạo người dùng mới
    async create(data: UserCreateRequest): Promise<UserCreateResponse> {
        const response = await privateAxios.post(
            API_ENDPOINTS.USERS.POST,
            data
        );
        return response.data;
    },
    // Cập nhật người dùng
    async update(id: string, data: UserUpdateRequest): Promise<UserUpdateResponse> {
        const response = await privateAxios.put(
            API_ENDPOINTS.USERS.UPDATE.replace(':id', String(id)),
            data
        );
        return response.data;
    },
    // Xóa người dùng theo ID
    async delete(id: string): Promise<UserDeleteResponse> {
        const response = await privateAxios.delete(
            API_ENDPOINTS.USERS.DELETE_BY_ID.replace(':id', String(id))
        );
        return response.data;
    }
}
