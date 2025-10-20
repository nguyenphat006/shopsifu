"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Discount, UpdateDiscountRequest, DiscountStatus, DisplayType } from '@/types/discount.interface';
import { discountService } from '@/services/discountService';
import { VoucherUseCase } from './voucher-config';
import { VoucherFormState } from './useNewVoucher';

// Helper function để xác định useCase từ voucher data
const determineUseCaseFromVoucher = (voucher: Discount, userRole: string): VoucherUseCase => {
  // Dựa trên voucher properties để xác định useCase
  const { voucherType, isPlatform, discountApplyType, productIds, categories, brands, shopId } = voucher;

  console.log('Determining useCase from voucher:', {
    voucherType,
    isPlatform,
    categories,
    brands,
    shopId,
    userRole,
    displayType: voucher.displayType
  });

  // Case 4: PLATFORM voucher (ADMIN only)
  if (isPlatform && voucherType === 'PLATFORM') {
    return VoucherUseCase.PLATFORM;
  }

  // Case 5: CATEGORIES voucher (ADMIN only) - Check voucherType first
  if (voucherType === 'CATEGORY' || (categories && categories.length > 0)) {
    return VoucherUseCase.CATEGORIES;
  }

  // Case 6: BRAND voucher (ADMIN only) - Check voucherType first  
  if (voucherType === 'BRAND' || (brands && brands.length > 0)) {
    return VoucherUseCase.BRAND;
  }

  // Case 7: SHOP_ADMIN voucher (ADMIN only) - voucher for specific shop
  if (userRole === 'ADMIN' && shopId && voucherType === 'SHOP') {
    return VoucherUseCase.SHOP_ADMIN;
  }

  // Case 8: PRODUCT_ADMIN voucher (ADMIN only) - product voucher created by admin
  if (userRole === 'ADMIN' && voucherType === 'PRODUCT') {
    return VoucherUseCase.PRODUCT_ADMIN;
  }

  // Case 9: PRIVATE_ADMIN voucher (ADMIN only) - private voucher created by admin
  if (userRole === 'ADMIN' && voucher.displayType === 'PRIVATE' && !shopId) {
    return VoucherUseCase.PRIVATE_ADMIN;
  }

  // Case 2: PRODUCT voucher (SELLER)
  if (voucherType === 'PRODUCT' && productIds && productIds.length > 0) {
    return VoucherUseCase.PRODUCT;
  }

  // Case 3: PRIVATE voucher (SELLER)
  if (voucher.displayType === 'PRIVATE') {
    return VoucherUseCase.PRIVATE;
  }

  // Case 1: SHOP voucher (default for SELLER)
  return VoucherUseCase.SHOP;
};

// Helper function để convert voucher data thành form data
const convertVoucherToFormData = async (voucher: Discount, useCase: VoucherUseCase): Promise<VoucherFormState> => {
  const baseFormData: VoucherFormState = {
    name: voucher.name || '',
    code: voucher.code || '',
    description: voucher.description || '',
    discountType: voucher.discountType,
    value: voucher.value || 0,
    minOrderValue: voucher.minOrderValue || 0,
    maxDiscountValue: voucher.maxDiscountValue,
    maxUses: voucher.maxUses || 1,
    maxUsesPerUser: voucher.maxUsesPerUser || 1,
    startDate: voucher.startDate,
    endDate: voucher.endDate,
    isActive: voucher.discountStatus === 'ACTIVE',
    discountApplyType: voucher.discountApplyType,
    
    // UI-specific fields - sẽ được populate sau
    showOnProductPage: true,
    selectedProducts: [],
    selectedBrands: [],
    selectedCategories: [],
    selectedShopUser: null,
    categories: voucher.categories || [],
    brands: voucher.brands || [],
    displayType: voucher.displayType,
    isPrivate: voucher.displayType === 'PRIVATE',
    maxDiscountType: voucher.maxDiscountValue ? 'limited' : 'unlimited',
  };

  // TODO: Populate selected items based on useCase
  // Hiện tại chỉ return basic data, sẽ thêm logic load products/categories/brands/users sau
  
  return baseFormData;
};

interface UseEditVoucherProps {
  voucher: Discount;
  userData: any;
  onEditSuccess?: () => void;
}

export interface UseEditVoucherReturn {
  formData: VoucherFormState;
  updateFormData: (field: keyof VoucherFormState, value: any) => void;
  resetForm: () => void;
  submitVoucher: () => Promise<void>;
  isLoading: boolean;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
  isEdit: boolean; // Thêm flag để components biết đây là mode edit
}

export function useEditVoucher({ voucher, userData, onEditSuccess }: UseEditVoucherProps): UseEditVoucherReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Xác định useCase từ voucher data
  const useCase = determineUseCaseFromVoucher(voucher, userData?.role?.name || 'SELLER');
  const voucherType = voucher.voucherType;

  // Convert voucher data to form data - sẽ được update sau khi load xong
  const [formData, setFormData] = useState<VoucherFormState>(() => {
    // Tạo initial form data đồng bộ trước
    const baseFormData: VoucherFormState = {
      name: voucher.name || '',
      code: voucher.code || '',
      description: voucher.description || '',
      discountType: voucher.discountType,
      value: voucher.value || 0,
      minOrderValue: voucher.minOrderValue || 0,
      maxDiscountValue: voucher.maxDiscountValue,
      maxUses: voucher.maxUses || 1,
      maxUsesPerUser: voucher.maxUsesPerUser || 1,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      isActive: voucher.discountStatus === 'ACTIVE',
      discountApplyType: voucher.discountApplyType,
      
      // UI-specific fields
      showOnProductPage: true,
      selectedProducts: [],
      selectedBrands: [],
      selectedCategories: [],
      selectedShopUser: null,
      categories: voucher.categories || [],
      brands: voucher.brands || [],
      displayType: voucher.displayType,
      isPrivate: voucher.displayType === 'PRIVATE',
      maxDiscountType: voucher.maxDiscountValue ? 'limited' : 'unlimited',
    };
    return baseFormData;
  });

  // Load additional data và populate selected items
  useEffect(() => {
    const loadAdditionalData = async () => {
      try {
        const updatedFormData = await convertVoucherToFormData(voucher, useCase);
        setFormData(updatedFormData);
      } catch (error) {
        console.error('Error loading additional voucher data:', error);
      }
    };

    loadAdditionalData();
  }, [voucher, useCase]);

  // Log để debug
  useEffect(() => {
    console.log('useEditVoucher initialized:', {
      voucher,
      useCase,
      voucherType,
      formData,
      userRole: userData?.role?.name
    });
  }, [voucher, useCase, voucherType, userData]);

  // Helper function để xử lý API error messages
  const parseErrorMessage = (error: any): string => {
    const defaultMessage = 'Đã xảy ra lỗi khi cập nhật voucher. Vui lòng thử lại.';
    
    if (!error?.response?.data?.message) {
      return error?.message || defaultMessage;
    }

    const apiMessage = error.response.data.message;
    
    // Kiểm tra nếu message là array (validation errors từ backend)
    if (Array.isArray(apiMessage)) {
      const validationErrors = apiMessage
        .map(err => err.message || err)
        .filter(Boolean)
        .join('. ');
      
      return validationErrors || defaultMessage;
    }
    
    // Nếu message là string thông thường
    if (typeof apiMessage === 'string') {
      return apiMessage;
    }
    
    return defaultMessage;
  };

  // Cập nhật form data
  const updateFormData = (field: keyof VoucherFormState, value: any) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [field]: value
      };

      // Khi người dùng chọn áp dụng cho tất cả sản phẩm, xóa danh sách sản phẩm đã chọn
      if (field === 'discountApplyType' && value === 'ALL') {
        newFormData.selectedProducts = [];
      }

      return newFormData;
    });

    // Clear error khi user nhập lại
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    const baseFormData: VoucherFormState = {
      name: voucher.name || '',
      code: voucher.code || '',
      description: voucher.description || '',
      discountType: voucher.discountType,
      value: voucher.value || 0,
      minOrderValue: voucher.minOrderValue || 0,
      maxDiscountValue: voucher.maxDiscountValue,
      maxUses: voucher.maxUses || 1,
      maxUsesPerUser: voucher.maxUsesPerUser || 1,
      startDate: voucher.startDate,
      endDate: voucher.endDate,
      isActive: voucher.discountStatus === 'ACTIVE',
      discountApplyType: voucher.discountApplyType,
      
      // UI-specific fields
      showOnProductPage: true,
      selectedProducts: [],
      selectedBrands: [],
      selectedCategories: [],
      selectedShopUser: null,
      categories: voucher.categories || [],
      brands: voucher.brands || [],
      displayType: voucher.displayType,
      isPrivate: voucher.displayType === 'PRIVATE',
      maxDiscountType: voucher.maxDiscountValue ? 'limited' : 'unlimited',
    };
    setFormData(baseFormData);
    setErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      toast.error('Tên chương trình giảm giá là bắt buộc');
      return false;
    }

    if (!formData.code?.trim()) {
      toast.error('Mã voucher là bắt buộc');
      return false;
    }

    // Validate mã voucher format
    const codePattern = /^[A-Z0-9_-]+$/;
    if (formData.code && !codePattern.test(formData.code)) {
      toast.error('Mã voucher chỉ được chứa chữ hoa, số, dấu gạch dưới (_) và dấu gạch ngang (-)');
      return false;
    }

    if (!formData.startDate) {
      toast.error('Ngày bắt đầu là bắt buộc');
      return false;
    }

    if (!formData.endDate) {
      toast.error('Ngày kết thúc là bắt buộc');
      return false;
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return false;
    }

    if (formData.value <= 0) {
      toast.error('Giá trị giảm giá phải lớn hơn 0');
      return false;
    }

    if (formData.discountType === 'PERCENTAGE' && formData.value > 100) {
      toast.error('Phần trăm giảm giá không được vượt quá 100%');
      return false;
    }

    if ((formData.minOrderValue ?? 0) < 0) {
      toast.error('Giá trị đơn hàng tối thiểu không được âm');
      return false;
    }

    if (formData.maxUses < 1) {
      toast.error('Số lượt sử dụng tối đa phải ít nhất là 1');
      return false;
    }

    if (formData.maxUsesPerUser < 1) {
      toast.error('Số lượt sử dụng tối đa mỗi người phải ít nhất là 1');
      return false;
    }

    // Validation: maxUsesPerUser không được vượt quá maxUses
    if (formData.maxUsesPerUser > formData.maxUses) {
      toast.error('Số lượt sử dụng tối đa mỗi người không được vượt quá tổng số lượt sử dụng');
      return false;
    }

    // Các validation khác tương tự như useNewVoucher...
    
    return true;
  };

  // Submit voucher
  const submitVoucher = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    // Kiểm tra có userData không
    if (!userData) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    setIsLoading(true);
    try {
      // Chuẩn bị data để update
      const updateData: Partial<UpdateDiscountRequest> = {
        name: formData.name,
        code: formData.code, // Thêm mã voucher vào request body
        description: formData.description,
        value: formData.value,
        minOrderValue: formData.minOrderValue,
        maxDiscountValue: formData.maxDiscountValue,
        maxUses: formData.maxUses,
        maxUsesPerUser: formData.maxUsesPerUser,
        startDate: formData.startDate,
        endDate: formData.endDate,
        discountApplyType: formData.discountApplyType,
        discountStatus: formData.isActive ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE,
        displayType: formData.displayType as DisplayType,
        voucherType: voucher.voucherType, // Giữ nguyên voucherType từ response
        shopId: voucher.shopId, // Giữ nguyên shopId từ response (nếu có)
      };

      // Thêm fields specific cho từng useCase
      switch (useCase) {
        case VoucherUseCase.PRODUCT:
        case VoucherUseCase.PRODUCT_ADMIN:
          if (formData.selectedProducts && formData.selectedProducts.length > 0) {
            updateData.productIds = formData.selectedProducts.map(p => p.id);
          }
          break;
        case VoucherUseCase.CATEGORIES:
          if (formData.selectedCategories && formData.selectedCategories.length > 0) {
            updateData.categories = formData.selectedCategories.map(c => c.value);
          }
          break;
        case VoucherUseCase.BRAND:
          if (formData.selectedBrands && formData.selectedBrands.length > 0) {
            updateData.brands = formData.selectedBrands.map(b => b.value);
          }
          break;
        case VoucherUseCase.SHOP_ADMIN:
          if (formData.selectedShopUser) {
            updateData.shopId = formData.selectedShopUser.value;
          }
          break;
      }

      console.log('Updating voucher with data:', updateData);

      await discountService.update(voucher.id, updateData);
      
      toast.success('Cập nhật voucher thành công!');
      onEditSuccess?.();
      
    } catch (error: any) {
      console.error('Error updating voucher:', error);
      const errorMessage = parseErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    formData,
    updateFormData,
    resetForm,
    submitVoucher,
    isLoading,
    errors,
    useCase,
    voucherType: voucherType.toString(),
    isEdit: true, // Đây là mode edit
  };
}
