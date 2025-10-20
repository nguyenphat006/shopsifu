"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Camera, Image as ImageIcon, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from "@/types/admin/category.interface";
import { useUploadMedia } from "@/hooks/useUploadMedia";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categoryService } from "@/services/admin/categoryService";

// Define props interface
interface CategoryModalUpsertProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  category?: Category | null;
  onSubmit: (data: CategoryCreateRequest | CategoryUpdateRequest) => Promise<any>;
}

export function CategoryModalUpsert({
  isOpen,
  onClose,
  mode,
  category,
  onSubmit,
}: CategoryModalUpsertProps) {
  const t = useTranslations("admin.ModuleCategory.ModalCreate");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Upload media hook
  const { 
    files, 
    uploadedUrls, 
    isUploading,
    progress,
    error: uploadError,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveAllFiles,
    uploadFiles,
    reset: resetUpload
  } = useUploadMedia();

  // Define form schema with Zod
  const formSchema = z.object({
    name: z.string().min(1, t("validation.required", { field: t("name") })),
    parentCategoryId: z.string().nullable(),
    logo: z.string().nullable().optional(),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parentCategoryId: null,
      logo: null,
    }
  });

  // Fetch categories for parent dropdown
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryService.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Update form values when category changes (edit mode)
  useEffect(() => {
    if (mode === 'edit' && category) {
      form.reset({
        name: category.name || "",
        parentCategoryId: category.parentCategoryId,
        logo: category.logo,
      });
      // Reset upload state
      resetUpload();
    } else {
      form.reset({
        name: "",
        parentCategoryId: null,
        logo: null,
      });
      // Reset upload state
      resetUpload();
    }
  }, [category, mode, form, resetUpload]);

  // Handle file change for logo upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // File type validation
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Định dạng tệp không được hỗ trợ', {
          description: 'Vui lòng chọn tệp hình ảnh (JPG, PNG, GIF, etc.)'
        });
        return;
      }
      
      // Clear existing files first
      handleRemoveAllFiles();
      
      // Add the new file (which will be compressed automatically)
      handleAddFiles(e.target.files);
    }
  };
  
  // Handle logo upload
  const handleUploadLogo = async () => {
    if (files.length === 0) return;
    
    const urls = await uploadFiles();
    if (urls.length > 0) {
      // Use the first uploaded image URL as logo
      form.setValue('logo', urls[0]);
    }
  };

  // Handle form submission
  const handleSubmitForm = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // No need to convert parentCategoryId anymore as it's already a string
      const processedData = {
        ...data,
        parentCategoryId: data.parentCategoryId || null,
      };
      
      await onSubmit(processedData);
      onClose();
    } catch (error) {
      console.error("Error submitting category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? t("addCategory")
              : t("editCategory")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("parentCategory")}</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full flex justify-between items-center"
                          disabled={loadingCategories}
                        >
                          <span className="flex items-center gap-2">
                            {loadingCategories && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loadingCategories 
                              ? "Đang tải..."
                              : field.value 
                                ? categories.find(cat => cat.id === field.value)?.name || t("parentPlaceholder")
                                : t("parentPlaceholder") || "Chọn danh mục cha"
                            }
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
                        <DropdownMenuItem 
                          onClick={() => field.onChange(null)}
                          className={!field.value ? "bg-accent" : ""}
                        >
                          {t("noParent") || "Không có danh mục cha"}
                        </DropdownMenuItem>
                        {categories
                          .filter(cat => mode === 'edit' ? cat.id !== category?.id : true) // Exclude current category in edit mode
                          .map((cat) => (
                            <DropdownMenuItem 
                              key={cat.id}
                              onClick={() => field.onChange(cat.id)}
                              className={field.value === cat.id ? "bg-accent" : ""}
                            >
                              {cat.name}
                            </DropdownMenuItem>
                          ))
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("logo")}</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Logo preview with integrated select button */}
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <Avatar className="h-16 w-16 border-2 border-gray-200">
                            {field.value ? (
                              <AvatarImage 
                                src={field.value} 
                                alt="Logo preview" 
                                className="object-cover" 
                              />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                <ImageIcon className="h-6 w-6" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          
                          {/* Overlay select button */}
                          <button 
                            type="button"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            disabled={isUploading}
                            aria-label={t("logoSelect") || 'Chọn logo'}
                            title={t("logoSelect") || 'Chọn logo'}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
                          >
                            <Camera className="h-5 w-5 text-white" />
                          </button>
                        </div>
                        
                        {/* Logo URL - Read Only */}
                        <div className="flex-1 space-y-1">
                          <Input 
                            {...field}
                            value={field.value || ""}
                            readOnly
                            placeholder={t("logoPlaceholder") || 'URL sẽ được tạo sau khi tải lên'} 
                            className="bg-muted"
                          />
                          
                          {/* Upload button only shown when a file is selected */}
                          {files.length > 0 && (
                            <Button 
                              type="button"
                              size="sm"
                              onClick={handleUploadLogo}
                              disabled={isUploading}
                              className="w-full"
                            >
                              {isUploading ? t("logoUploading") || 'Đang tải lên...' : t("logoUpload") || 'Tải lên'}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <input
                        id="logo-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        accept="image/*"
                        aria-label={t("logoSelect") || 'Chọn logo'}
                      />
                      
                      {/* Upload progress */}
                      {isUploading && (
                        <div className="space-y-1">
                          <Progress value={progress} className="h-1" />
                          <p className="text-xs text-muted-foreground">
                            {t("logoUploadProgress") || 'Đang tải lên'} {progress}%
                          </p>
                        </div>
                      )}
                      
                      {/* File preview */}
                      {files.length > 0 && !isUploading && (
                        <div className="text-xs text-muted-foreground">
                          {files[0].name} ({Math.round(files[0].size / 1024)} KB)
                        </div>
                      )}
                      
                      {/* Upload error */}
                      {uploadError && (
                        <p className="text-sm text-red-500">{uploadError}</p>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t("logoHelp")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'add' ? t("common.create") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
