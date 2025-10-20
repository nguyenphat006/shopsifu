// import { useState } from 'react';
// import { auditLogsService } from '@/services/admin/auditLogsService';
// import { AuditLogListResponse } from '@/types/admin/auditLogs.interface';
// import { PaginationRequest } from '@/types/base.interface';

// export function useAuditLogs() {
//   const [auditLogs, setAuditLogs] = useState<any[]>([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [page, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Fetch all audit logs with pagination and search
//   const getAllAuditLogs = async (params?: PaginationRequest) => {
//     setLoading(true);
//     try {
//       const queryParams: any = {
//         page: params?.metadata?.page || 1,
//         limit: params?.metadata?.limit || 10,
//       };
//       if (params?.metadata?.search) queryParams.search = params.metadata.search;
//       const response: AuditLogListResponse = await auditLogsService.getAll(queryParams);
//       const data = response.data.map((item) => ({
//         id: item.id,
//         userEmail: item.userEmail,  
//         timestamp: item.timestamp,
//         action: item.action,
//         entity: item.entity,
//         ipAddress: item.ipAddress,
//         userAgent: item.userAgent,
//         status: item.status,
//         statusCode: item.details?.statusCode,
//         elapsedTime: item.details?.elapsedTimeMs,
//         userId: item.userId,
//         notes: item.notes,
//         details:{
//           method: item.details?.method,
//           statusCode: item.details?.statusCode,
//           elapsedTimeMs: item.details?.elapsedTimeMs,
//           requestHeaders: item.details?.requestHeaders,
//         }
//       }));
//       setAuditLogs(data);
//       setTotalItems(response.totalItems);
//       setCurrentPage(response.page);
//       setTotalPages(response.totalPages);
//       return response;
//     } catch (error) {
//       setAuditLogs([]);
//       setTotalItems(0);
//       setCurrentPage(1);
//       setTotalPages(1);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     auditLogs,
//     totalItems,
//     page,
//     totalPages,
//     loading,
//     getAllAuditLogs,
//   };
// }
