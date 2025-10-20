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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { showToast } from "@/components/ui/toastify"
import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PermissionDetail } from '@/types/auth/permission.interface'
import { Role } from './roles-Columns'
import { Permission } from '@/types/auth/role.interface'

interface RolesModalUpsertProps {
  open: boolean
  onClose: () => void
  mode: 'add' | 'edit'
  role?: Role | null
  onSubmit: (values: {
    name: string
    description: string
    isActive: boolean
    permissionIds: string[]  // Thay đổi từ number[] sang string[] cho UUID
  }) => Promise<void>
  // permissionsData chỉ cần thiết khi mode = 'edit'
  permissionsData: Record<string, PermissionDetail[]> | PermissionDetail[];
  isPermissionsLoading: boolean;
}

export default function RolesModalUpsert({
  open,
  onClose,
  mode,
  role,
  onSubmit,
  permissionsData,
  isPermissionsLoading,
}: RolesModalUpsertProps) {
  const t = useTranslations()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (mode === 'edit' && role) {
      // Initialize form with role data
      setName(role.name || '')
      setDescription(role.description || '')
      setIsActive(role.isActive ?? true)
      
      // Set permission IDs from the fetched role data
      if (role.permissions && role.permissions.length > 0) {
        const initialPermissionIds = role.permissions.map((p: Permission) => p.id.toString()) || []
        console.log("Setting initial permission IDs:", initialPermissionIds)
        console.log("Role permissions data:", role.permissions)
        setSelectedPermissionIds(new Set<string>(initialPermissionIds))
      } else {
        console.log("No permissions found in role data")
        setSelectedPermissionIds(new Set<string>())
      }
    } else {
      // Reset fields for "add" mode or when role is not available
      setName('')
      setDescription('')
      setIsActive(true)
      setSelectedPermissionIds(new Set<string>()) // Reset permissions cho mode add
    }
  }, [mode, role, open])

  // Additional effect to update selected permissions when data changes - chỉ cho edit mode
  useEffect(() => {
    // Chỉ xử lý permissions khi ở chế độ edit
    if (mode !== 'edit') return;
    
    // Log permissions data whenever it changes
    console.log("Current permissionsData:", permissionsData);
    console.log("isPermissionsLoading:", isPermissionsLoading);
    
    if (role?.permissions && !isPermissionsLoading) {
      console.log("Updating permissions from useEffect due to permissionsData change");
      const initialPermissionIds = role.permissions.map((p: Permission) => {
        console.log("Processing permission:", p);
        return p.id.toString();
      }) || []
      
      console.log("Final permissions IDs to select:", initialPermissionIds);
      setSelectedPermissionIds(new Set<string>(initialPermissionIds))
    }
  }, [permissionsData, isPermissionsLoading, mode, role])

  const handleMasterSwitchChange = (subject: string, checked: boolean) => {
    // Type guard để xác định permissionsData là Record
    const isRecordType = (data: Record<string, PermissionDetail[]> | PermissionDetail[]): 
      data is Record<string, PermissionDetail[]> => !Array.isArray(data);
      
    if (!isRecordType(permissionsData)) {
      console.error("Permissions data is not in expected format");
      return;
    }
    
    const subjectPermissions = permissionsData[subject] || [];
    const subjectPermissionIds = subjectPermissions.map((p: PermissionDetail) => p.id.toString());
    
    console.log(`${checked ? 'Selecting' : 'Deselecting'} all permissions for module ${subject}:`, subjectPermissionIds);

    setSelectedPermissionIds(prev => {
      const newSet = new Set<string>(prev);
      if (checked) {
        subjectPermissionIds.forEach((id: string) => newSet.add(id));
      } else {
        subjectPermissionIds.forEach((id: string) => newSet.delete(id));
      }
      return newSet;
    });
  };

  const handleChildSwitchChange = (id: string, checked: boolean) => {
    console.log(`${checked ? 'Selecting' : 'Deselecting'} permission:`, id);
    
    setSelectedPermissionIds(prev => {
      const newSet = new Set<string>(prev);
      const stringId = id.toString();
      
      if (checked) {
        newSet.add(stringId);
      } else {
        newSet.delete(stringId);
      }
      
      console.log("New selected permission IDs:", Array.from(newSet));
      return newSet;
    });
  };

  const getActionColor = (action?: string) => {
    if (!action) return 'text-slate-600 font-medium';
    const lowerAction = action.toLowerCase();
    
    // Format dựa trên METHOD (đang có format "METHOD - /path")
    if (lowerAction.startsWith('get ')) return 'text-emerald-600 font-medium';
    if (lowerAction.startsWith('post ')) return 'text-blue-600 font-medium';
    if (lowerAction.startsWith('put ') || lowerAction.startsWith('patch ')) return 'text-amber-600 font-medium';
    if (lowerAction.startsWith('delete ')) return 'text-red-600 font-medium';
    
    return 'text-slate-600 font-medium';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      showToast(t("admin.roles.modal.nameValidation"), "error")
      return
    }

    setLoading(true)
    try {
      if (mode === 'add') {
        // Khi thêm mới, chỉ gửi thông tin cơ bản (name, description, isActive)
        await onSubmit({
          name,
          description,
          isActive,
          permissionIds: [], // Không gửi permissions khi thêm mới
        })
      } else {
        // Mode edit - gửi cả permissionIds
        const permissionIds = Array.from(selectedPermissionIds)
        console.log("Submitting with permission IDs:", permissionIds)
        
        await onSubmit({
          name,
          description,
          isActive,
          permissionIds: permissionIds,
        })
      }
      
      onClose()
    } catch (error) {
      showToast("Có lỗi xảy ra", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? t("admin.roles.modal.title")
              : t("admin.roles.modalEdit.title")}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add'
              ? t("admin.roles.modal.subtitle")
              : t("admin.roles.modalEdit.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto pr-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("admin.roles.modal.name")}</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder={t("admin.roles.modal.namePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t("admin.roles.modal.description")}</label>
              <Input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t("admin.roles.modal.descriptionPlaceholder")}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-sm font-medium">{t("admin.roles.modal.isActive")}</label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            {/* Chỉ hiển thị phần permission khi ở chế độ Edit */}
            {mode === 'edit' && (
              <div className="space-y-2 pt-2">
                <div>
                  <h3 className="font-semibold leading-none tracking-tight">{t("admin.roles.modal.permissions")}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("admin.roles.modal.permissionsDescription")}
                  </p>
                </div>
                <div className="rounded-lg border mt-2">
                  {isPermissionsLoading ? (
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                      </div>
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                  ) : (
                    <Accordion type="multiple" className="w-full">
                      {Object.entries(permissionsData || {}).map(([subject, items]) => {
                        // Kiểm tra xem có items hay không
                        if (!items || items.length === 0) {
                          console.log("No items for subject:", subject);
                          return null;
                        }
                        
                        console.log(`Processing ${subject} with ${items.length} items`, items);
                        
                        // Kiểm tra xem mọi quyền trong module này đã được chọn chưa
                        const allSelected = items.every((item: PermissionDetail) => {
                          const isSelected = selectedPermissionIds.has(item.id.toString());
                          console.log(`Permission ${item.id} (${item.action}) selected: ${isSelected}`);
                          return isSelected;
                        });
                        
                        // Đếm số quyền đã chọn
                        const selectedCount = items.filter((item: PermissionDetail) => 
                          selectedPermissionIds.has(item.id.toString())).length;
                          
                        return (
                          <AccordionItem value={subject} key={subject}>
                            <AccordionTrigger className="bg-slate-50 hover:bg-slate-100 px-4 data-[state=open]:bg-slate-100 rounded-t-lg">
                              <div className="flex items-center justify-between w-full">
                                <span className="font-semibold uppercase tracking-wider">
                                  {subject} 
                                  <span className="text-xs text-muted-foreground ml-2 normal-case">
                                    ({selectedCount}/{items.length} quyền)
                                  </span>
                                </span>
                                <Switch
                                  checked={allSelected}
                                  onCheckedChange={(checked) => handleMasterSwitchChange(subject, checked)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-white p-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                                {items.map((item: PermissionDetail) => {
                                  const isSelected = selectedPermissionIds.has(item.id.toString());
                                  console.log(`Rendering permission ${item.id} - Selected: ${isSelected}`);
                                  
                                  return (
                                    <div key={item.id} className="space-y-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <Label 
                                            htmlFor={`perm-${item.id}`} 
                                            className={`
                                              ${getActionColor(item.action)} 
                                              line-clamp-2 
                                              text-sm
                                              ${isSelected ? 'font-semibold' : 'font-normal'}
                                            `}
                                          >
                                            {item.action || `${item.method} - ${item.path}`}
                                          </Label>
                                        </div>
                                        <div className="flex-shrink-0">
                                          <Switch
                                            id={`perm-${item.id}`}
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleChildSwitchChange(item.id, checked)}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t mt-4 flex-shrink-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
                {t("admin.roles.modal.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("admin.roles.modal.processing")
                : t("admin.roles.modal.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
