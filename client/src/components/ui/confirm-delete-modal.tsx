'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void; // callback khi xác nhận
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  description = "Bạn có chắc chắn muốn xóa thông tin này? Hành động này không thể hoàn tác.",
  confirmText = "Xóa",
  cancelText = "Hủy",
  loading = false,
}: ConfirmDeleteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={loading}>{cancelText}</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Đang xóa..." : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
