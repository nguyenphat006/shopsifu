"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAccountModal({ open, onOpenChange, onConfirm }: DeleteAccountModalProps) {
  const  t  = useTranslations();

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[300px] p-4 rounded-xl">
        <DialogHeader className="flex justify-between items-center border-b pb-2">
          <DialogTitle className="text-lg font-semibold">
            {t("user.account.profile.deleteAccount")}
          </DialogTitle>
          <DialogClose className="text-gray-500 hover:text-gray-700" />
        </DialogHeader>
        <div className="py-3 space-y-4">
          {/* <p className="text-sm text-gray-600">
            {t("user.account.profile.deleteAccountDescription")}
          </p> */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("user.account.profile.cancel")}
            </Button>
            <Button
              className="bg-red-600 text-white"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {t("user.account.profile.confirmDelete")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}