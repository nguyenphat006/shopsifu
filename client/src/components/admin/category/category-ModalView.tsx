"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface CategoryDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
}

export function CategoryModalView({ open, onOpenChange, data }: CategoryDetailProps) {
  const t  = useTranslations('admin');

  if (!data) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{t("category.modal.detailTitle", { name: data.name })}</DialogTitle>
          <DialogDescription>{t("category.modal.detailDesc")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 py-2">
          <div><b>{t("category.modal.name")}:</b> {data.name}</div>
          <div><b>{t("category.modal.status")}:</b> 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${data.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {data.isActive ? t("category.status.active") : t("category.status.inactive")}
            </span>
          </div>
          <div><b>{t("category.modal.createdAt")}:</b> {format(new Date(data.createdAt), "yyyy-MM-dd HH:mm:ss")}</div>
          <div><b>{t("category.modal.updatedAt")}:</b> {format(new Date(data.updatedAt), "yyyy-MM-dd HH:mm:ss")}</div>
        </div>
        
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 px-0">
              {t("category.modal.more")} <ChevronDown size={16} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 gap-2 py-2">
              <div><b>{t("category.modal.description")}:</b> {data.description || "-"}</div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <DialogClose asChild>
          <Button variant="outline" className="w-full mt-4">{t("category.modal.close")}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
