export interface AuditGetALLResponse {
    id: string;
    timestamp: string;
    userId: string | null;
    userEmail: string | null;
    action: string;
    entity: string;
    entityId: string | null;
    ipAddress: string;
    userAgent: string;
    status: string;
    errorMessage: string | null;
    details: {
      method: string;
      statusCode: number;
      elapsedTimeMs: number;
      requestHeaders: {
        referer?: string;
        'user-agent'?: string;
        'accept-language'?: string;
      };
    };
    notes: string;
  }

export interface AuditLogListResponse {
  data: AuditGetALLResponse[];
  totalItems: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface AduitGetStatsResponse {
  totalLogs: number;
  totalSuccessLogs: number;
  totalFailureLogs: number;
  totalEntities: number;
} 
