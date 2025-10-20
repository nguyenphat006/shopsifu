'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { showToast } from "@/components/ui/toastify";
import { Permission } from './permissions-Columns';
import { PerCreateRequest, PerUpdateRequest } from '@/types/auth/permission.interface';
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent, 
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PermissionsModalUpsertProps {
  open: boolean;
  onClose: () => void;
  permission: Permission | null;
  onSubmit: (data: PerCreateRequest | PerUpdateRequest) => Promise<void>;
}

export default function PermissionsModalUpsert({ open, onClose, permission, onSubmit }: PermissionsModalUpsertProps) {
  const t = useTranslations();
  const [name, setName] = useState('');
  const [module, setModule] = useState('');
  const [path, setPath] = useState('');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens or permission changes
  useEffect(() => {
    if (permission) {
      setName(permission.name || '');
      setModule(permission.module || '');
      setPath(permission.path || '');
      setMethod(permission.method || 'GET');
    } else {
      setName('');
      setModule('');
      setPath('');
      setMethod('GET');
    }
  }, [permission, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !path.trim() || !method || !module.trim()) {
      showToast(t('admin.permissions.modal.validation') || 'Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const data: PerCreateRequest | PerUpdateRequest = {
        name,
        path,
        method,
        module
      };
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error is already handled by the parent component's try-catch block
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!permission;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {!isEditMode
              ? t("admin.permissions.modal.addTitle") || 'Add Permission'
              : t("admin.permissions.modal.editTitle") || 'Edit Permission'}
          </DialogTitle>
          <DialogDescription>
            {!isEditMode
              ? t("admin.permissions.modal.addSubtitle") || 'Create a new permission'
              : t("admin.permissions.modal.editSubtitle") || 'Update permission details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.name") || 'Name'}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("admin.permissions.modal.namePlaceholder") || 'Enter permission name'}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.module") || 'Module'}</label>
            <Input
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder={t("admin.permissions.modal.modulePlaceholder") || 'Enter module name'}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.path") || 'Path'}</label>
            <Input
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder={t("admin.permissions.modal.pathPlaceholder") || 'Enter API path'}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t("admin.permissions.modal.method") || 'Method'}</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select HTTP method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>HTTP Methods</SelectLabel>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="ALL">ALL</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          

          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                {t("admin.permissions.modal.cancel") || 'Cancel'}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("admin.permissions.modal.processing") || 'Processing...'
                : (!isEditMode ? t("admin.permissions.modal.save") || 'Create' : t("admin.permissions.modal.update") || 'Update')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
