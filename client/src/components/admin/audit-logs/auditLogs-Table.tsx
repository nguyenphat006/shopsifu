// "use client";

// import { useEffect, useState } from "react";
// import { AuditLogsColumns, AuditLog } from "./auditLogs-Columns";
// import SearchInput from "@/components/ui/data-table-component/search-input";
// import { DataTable } from "@/components/ui/data-table-component/data-table";
// import { Pagination } from "@/components/ui/data-table-component/pagination";
// import { useAuditLogs } from "./useAuditLogs";
// import { useDebounce } from "@/hooks/useDebounce";
// import { Loader2 } from "lucide-react";
// import { AuditLogsModalView } from "./auditLogs-ModalView";
// import { AuditLogsStats } from "./aduitLogs-Stats";
// import { useTranslations } from "next-intl";
// import { useDataTable } from "@/hooks/useDataTable";
// import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option";

// export function AuditLogsTable() {
//   const t = useTranslations();
//   const {
//     auditLogs,
//     totalItems,
//     page,
//     totalPages,
//     loading,
//     getAllAuditLogs,
//   } = useAuditLogs();

//   const [searchValue, setSearchValue] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
//   const [limit, setLimit] = useState(10);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedLog, setSelectedLog] = useState<any | null>(null);

//   const debouncedSearchValue = useDebounce(searchValue, 1000);

//   useEffect(() => {
//     getAllAuditLogs();
//   }, []);

//   useEffect(() => {
//     if (debouncedSearchValue !== undefined) {
//       setIsSearching(true);
//       getAllAuditLogs({ metadata: { page: 1, limit: limit } }).finally(() => setIsSearching(false));
//     }
//   }, [debouncedSearchValue, limit]);

//   const handleSearch = (value: string) => {
//     setSearchValue(value);
//   };

//   const handlePageChange = (newPage: number) => {
//     getAllAuditLogs({ metadata: { page: newPage, limit: limit } });
//   };

//   const handleLimitChange = (newLimit: number) => {
//     setLimit(newLimit);
//     getAllAuditLogs({ metadata: { page: 1, limit: newLimit } }); // Reset về trang 1 khi thay đổi limit
//   };

//   // Xử lý click vào row để mở modal
//   const handleRowClick = (row: any) => {
//     setSelectedLog(row.original);
//     setModalOpen(true);
//   };

//    const table = useDataTable({
//       data: auditLogs,
//       columns: AuditLogsColumns(),
//     })

//   return (
//     <div className="w-full space-y-4">
//       <AuditLogsStats />
//       <div className="flex items-center gap-2">
//         <SearchInput
//           value={searchValue}
//           onValueChange={handleSearch}
//           placeholder={t("admin.auditLogs.searchPlaceholder")}
//           className="max-w-sm"
//         />
//         <DataTableViewOption table={table} />
//       </div>
//       <div className="relative">
//         <DataTable
//           table={table}
//           columns={AuditLogsColumns()}
//           loading={loading || isSearching}
//           notFoundMessage={t('admin.auditLogs.notFound')}
//           onRowClick={handleRowClick}
//         />
//       </div>
//       {totalPages > 0 && (
//         <Pagination
//           limit={limit}
//           page={page} // Đảm bảo page từ API
//           totalPages={totalPages}
//           totalRecords={totalItems}
//           onPageChange={handlePageChange}
//           onLimitChange={handleLimitChange}
//         />
//       )}
//       <AuditLogsModalView
//         open={modalOpen}
//         onOpenChange={setModalOpen}
//         data={selectedLog}
//       />
//     </div>
//   );
// }