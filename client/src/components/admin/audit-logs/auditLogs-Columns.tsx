'use client'

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

export type AuditLog = {
  userEmail: string
  timestamp: string
  action: string
  entity: string
  ipAddress: string
  userAgent: string
  status: string
  statusCode: number
  elapsedTime: number
}

export const AuditLogsColumns = (): ColumnDef<AuditLog>[] => {
  const t = useTranslations();
  return [
    {
      accessorKey: "userEmail",
        header: () => <div>{t("admin.auditLogs.column.userEmail")}</div>,
        cell: ({ row }) => <div>{row.getValue("userEmail")}</div>,
        enableSorting: true,
        enableHiding: true,
  },
  {
    accessorKey: "timestamp",
    header: () => <div>{t("admin.auditLogs.column.timestamp")}</div>,
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{format(new Date(row.getValue("timestamp")), "yyyy-MM-dd HH:mm:ss")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "action",
    header: () => <div>{t("admin.auditLogs.column.action")}</div>,
    cell: ({ row }) => <div>{row.getValue("action")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "entity",
    header: () => <div>{t("admin.auditLogs.column.entity")}</div>,
    cell: ({ row }) => <div className="truncate max-w-[180px]">{row.getValue("entity")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "ipAddress",
    header: () => <div>{t("admin.auditLogs.column.ipAddress")}</div>,
    cell: ({ row }) => <div>{row.getValue("ipAddress")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "userAgent",
    header: () => <div>{t("admin.auditLogs.column.userAgent")}</div>,
    cell: ({ row }) => <div className="truncate max-w-[180px]">{row.getValue("userAgent")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: () => <div>{t("admin.auditLogs.column.status")}</div>,
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "statusCode",
    header: () => <div>{t("admin.auditLogs.column.statusCode")}</div>,
    cell: ({ row }) => <div>{row.getValue("statusCode")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "elapsedTime",
    header: () => <div>{t("admin.auditLogs.column.elapsedTime")}</div>,
    cell: ({ row }) => <div>{row.getValue("elapsedTime")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  ]
}
