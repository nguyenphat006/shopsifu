"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface AuditLogDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
}

export function AuditLogsModalView({ open, onOpenChange, data }: AuditLogDetailProps) {
  const t = useTranslations('admin');

  if (!data) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{t("auditLogs.modal.detailTitle", { id: data.id })}</DialogTitle>
          <DialogDescription>{t("auditLogs.modal.detailDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 py-2">
          <div><b>{t("auditLogs.modal.userEmail")}:</b> {data.userEmail}</div>
          <div><b>{t("auditLogs.modal.timestamp")}:</b> {data.timestamp}</div>
          <div><b>{t("auditLogs.modal.action")}:</b> {data.action}</div>
          <div><b>{t("auditLogs.modal.entity")}:</b> {data.entity}</div>
          <div><b>{t("auditLogs.modal.ipAddress")}:</b> {data.ipAddress}</div>
          <div><b>{t("auditLogs.modal.status")}:</b> {data.status}</div>
          <div><b>{t("auditLogs.modal.statusCode")}:</b> {data.statusCode}</div>
          <div><b>{t("auditLogs.modal.elapsedTime")}:</b> {data.elapsedTime} ms</div>
        </div>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 px-0">
              {t("auditLogs.modal.more")} <ChevronDown size={16} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 gap-2 py-2">
              <div><b>{t("auditLogs.modal.userAgent")}:</b> {data.userAgent}</div>
              <div>
                <b>{t("auditLogs.modal.requestHeaders")}:</b>
                <pre className="bg-muted rounded p-2 text-xs mt-1">
                  {data.requestHeaders ? JSON.stringify(data.details, null, 2) : "-"}
                </pre>
              </div>
              <div><b>{t("auditLogs.modal.notes")}:</b> {data.notes || "-"}</div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <DialogClose asChild>
          <Button variant="outline" className="w-full mt-4">{t("auditLogs.modal.close")}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
