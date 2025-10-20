'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Category } from '@/types/admin/category.interface';
import { categoryService } from '@/services/admin/categoryService';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (categoryIds: string[], selectionPath: string) => void;
  initialSelectedIds?: string[];
}

export function CategoryModal({ 
  open, 
  onOpenChange, 
  onConfirm, 
  initialSelectedIds = [] 
}: CategoryModalProps) {
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);

  const [selectedParent, setSelectedParent] = useState<Category | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  // Reset states when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedParent(null);
      setSelectedChildId(null);
      setChildCategories([]);
    }
  }, [open]);

  const fetchParentCategories = useCallback(async () => {
    setLoadingParents(true);
    try {
      const params = { page: 1, limit: 100 };
      const response = await categoryService.getAll(params);
      setParentCategories(response.data);
      
      // Nếu có initialSelectedIds, tìm parent category và set selected
      if (initialSelectedIds && initialSelectedIds.length > 0) {
        // Tìm trong parent categories
        const parentId = initialSelectedIds[0];
        const parent = response.data.find(p => p.id && p.id.toString() === parentId);
        
        if (parent) {
          setSelectedParent(parent);
          // Nếu có parent, load child categories
          fetchChildCategories(parent.id);
        } else {
          // Tìm xem nó có phải là child category không
          for (const parent of response.data) {
            if (parent.id) {
              const childParams = { page: 1, limit: 100, parentCategoryId: parent.id.toString() };
              const childResponse = await categoryService.getAll(childParams);
              const child = childResponse.data.find(c => c.id && c.id.toString() === parentId);
              
              if (child) {
                // Tìm thấy trong child categories
                setSelectedParent(parent);
                setChildCategories(childResponse.data);
                setSelectedChildId(parentId);
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh mục cha');
    } finally {
      setLoadingParents(false);
    }
  }, [initialSelectedIds]);

  const fetchChildCategories = useCallback(async (parentId: string | number) => {
    setLoadingChildren(true);
    setChildCategories([]);
    try {
      const params = { page: 1, limit: 100, parentCategoryId: parentId.toString() };
      const response = await categoryService.getAll(params);
      setChildCategories(response.data);
      
      // Nếu có initialSelectedIds và có child category trong initialSelectedIds
      if (initialSelectedIds && initialSelectedIds.length > 1) {
        const childId = initialSelectedIds[1];
        const isChildInResponse = response.data.some(c => c.id && c.id.toString() === childId);
        
        if (isChildInResponse) {
          setSelectedChildId(childId);
        }
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh mục con');
    } finally {
      setLoadingChildren(false);
    }
  }, [initialSelectedIds]);

  useEffect(() => {
    if (open) {
      fetchParentCategories();
    }
  }, [open, fetchParentCategories]);

  const handleParentSelect = (parent: Category) => {
    console.log('Selected parent category:', parent);
    console.log('Parent ID type:', typeof parent.id, 'Value:', parent.id);
    
    setSelectedParent(parent);
    setSelectedChildId(null);
    
    if (parent.id) {
      // Log the ID that will be used for fetching children
      console.log('Fetching child categories with parent ID:', parent.id.toString());
      fetchChildCategories(parent.id.toString());
    }
  };

  const handleConfirm = () => {
    // Tạo mảng categoryIds để gửi về
    const categoryIds: string[] = [];
    
    if (selectedParent?.id) {
      // Sử dụng nguyên ID gốc, không thay đổi
      categoryIds.push(selectedParent.id.toString());
    }
    
    if (selectedChildId) {
      // Sử dụng nguyên ID gốc, không thay đổi
      categoryIds.push(selectedChildId);
    }
    
    console.log('Sending original category IDs:', categoryIds);
    onConfirm(categoryIds, selectionPath);
    onOpenChange(false);
  };

  const selectionPath = useMemo(() => {
    if (!selectedParent) return '';
    const child = childCategories.find((c) => c.id && c.id.toString() === selectedChildId);
    return child ? `${selectedParent.name} > ${child.name}` : selectedParent.name;
  }, [selectedParent, selectedChildId, childCategories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-none w-[80vw] max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Chọn danh mục sản phẩm</DialogTitle>
        </DialogHeader>
        
        {/* Main Content - Fixed Height with Proper Overflow */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="grid grid-cols-4 gap-px bg-border rounded-lg" style={{ height: '450px' }}>

            {/* Parent Category Column */}
            <div className="bg-background flex flex-col overflow-auto">
              <div className="p-3 border-b bg-muted/30">
                <h3 className="text-sm font-medium">Danh mục cha</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {loadingParents ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">Đang tải...</p>
                      </div>
                    ) : parentCategories.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
                      </div>
                    ) : (
                      parentCategories.map((parent) => (
                        <button
                          key={parent.id}
                          onClick={() => handleParentSelect(parent)}
                          className={cn(
                            'w-full text-left p-3 rounded-md flex justify-between items-center text-sm transition-colors',
                            'hover:bg-muted/50',
                            selectedParent?.id === parent.id 
                              ? 'bg-primary/10 text-primary border border-primary/20' 
                              : 'border border-transparent'
                          )}
                          title={parent.name}
                        >
                          <span className="truncate pr-2 flex-1">{parent.name}</span>
                          <ChevronRight className="h-4 w-4 flex-shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Child Category Column */}
            <div className="bg-background flex flex-col overflow-auto">
              <div className="p-3 border-b bg-muted/30">
                <h3 className="text-sm font-medium">Danh mục con</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-1">
                    {!selectedParent ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">Vui lòng chọn danh mục cha</p>
                      </div>
                    ) : loadingChildren ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">Đang tải...</p>
                      </div>
                    ) : childCategories.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">Không có danh mục con</p>
                      </div>
                    ) : (
                      childCategories.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setSelectedChildId(child.id?.toString() || '')}
                          className={cn(
                            'w-full text-left p-3 rounded-md text-sm transition-colors',
                            'hover:bg-muted/50',
                            child.id && selectedChildId === child.id.toString()
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'border border-transparent'
                          )}
                          title={child.name}
                        >
                          <span className="truncate block">{child.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* 3rd Column - Reserved */}
            <div className="bg-background flex flex-col">
              <div className="p-3 border-b bg-muted/30">
                <h3 className="text-sm font-medium text-muted-foreground">Dành cho tương lai</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Chưa sử dụng</p>
              </div>
            </div>

            {/* 4th Column - Reserved */}
            <div className="bg-background flex flex-col">
              <div className="p-3 border-b bg-muted/30">
                <h3 className="text-sm font-medium text-muted-foreground">Dành cho tương lai</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Chưa sử dụng</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 mt-4 pt-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Đã chọn: <span className="text-foreground font-medium">{selectionPath || 'Chưa chọn'}</span>
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="button" onClick={handleConfirm} disabled={!selectionPath}>
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}