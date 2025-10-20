import { privateAxios } from '@/lib/api';
import {
    SessionGetALLResponse,
    SessionRevokeAllRequest,
    SessionRevokeAllResponse,
    SessionRevokeRequest,
    SessionRevokeResponse
} from '@/types/auth/session.interface';
import { API_ENDPOINTS } from '@/constants/api';
import { PaginationRequest } from '@/types/base.interface';

export const sessionService = {
    // Lấy danh sách phiên đăng nhập
    getAll: async (params?: PaginationRequest): Promise<SessionGetALLResponse> => {
        const response = await privateAxios.get<SessionGetALLResponse>(API_ENDPOINTS.SESSIONS.GETALL, { params });
        return response.data;
    },

    // Hủy tất cả phiên đăng nhập ngoại trừ phiên hiện tại
    revokeAll: async (data: SessionRevokeAllRequest): Promise<SessionRevokeAllResponse> => {
        const response = await privateAxios.post<SessionRevokeAllResponse>(API_ENDPOINTS.SESSIONS.REVOKE_ALL, data);
        return response.data;
    },

    // Hủy các phiên đăng nhập cụ thể
    revoke: async (data: SessionRevokeRequest): Promise<SessionRevokeResponse> => {
        const response = await privateAxios.post<SessionRevokeResponse>(API_ENDPOINTS.SESSIONS.REVOKE, data);
        return response.data;
    }
};
