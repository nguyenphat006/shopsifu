import { publicAxios, privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { AxiosError } from "axios";
import { AuditGetALLResponse, AuditLogListResponse, AduitGetStatsResponse } from '@/types/admin/auditLogs.interface';
import { PaginationRequest } from '@/types/base.interface';

export const auditLogsService = {
    getAll: async (params?: PaginationRequest): Promise<AuditLogListResponse> => {
        const response = await privateAxios.get(API_ENDPOINTS.AUDIT_LOGS.GETALL, { params });
        return response.data;
    },
    getStats: async (): Promise<AduitGetStatsResponse> => {
        const response = await privateAxios.get(API_ENDPOINTS.AUDIT_LOGS.GET_STATS);
        return response.data;
    },
    getById: async (id: string): Promise<AuditGetALLResponse> => {
        const response = await privateAxios.get(API_ENDPOINTS.AUDIT_LOGS.GET_BY_ID.replace(':id', id));
        return response.data;
    },
    getActions: async (): Promise<string[]> => {
        const response = await privateAxios.get(API_ENDPOINTS.AUDIT_LOGS.GET_ACTIONS);
        return response.data;
    },
    getEntities: async (): Promise<string[]> => {
        const response = await privateAxios.get(API_ENDPOINTS.AUDIT_LOGS.GET_ENTITIES);
        return response.data;
    },
}
