"use client";

import { useState, useEffect } from 'react';
import { VoucherUseCase } from './voucher-config';
import {
  CreateDiscountRequest,
  DiscountApplyType,
  DiscountStatus,
  DiscountType,
  VoucherType,
  DisplayType,
} from '@/types/discount.interface';
import { discountService } from '@/services/discountService';
import { toast } from 'sonner';

// The explicit and complete state for the voucher form.
// This approach avoids using Partial<> to prevent downstream 'undefined' errors.
export type VoucherFormState = {
  name: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIX_AMOUNT';
  value: number;
  minOrderValue: number;
  maxDiscountValue?: number | null; // Cho phép null
  maxUses: number;
  maxUsesPerUser: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  discountApplyType: DiscountApplyType;

  // UI-specific fields
  showOnProductPage?: boolean;
  selectedProducts?: Array<{ id: string; name: string; price: number; image: string; }>;
  selectedBrands?: Array<{ value: string; label: string; image?: string | null; }>;
  selectedCategories?: Array<{ value: string; label: string; icon?: string | null; parentCategoryId?: string | null; }>;
  selectedShopUser?: { value: string; label: string; email?: string | null; phone?: string | null; } | null;
  categories?: string[];
  brands?: string[];
  displayType?: 'PUBLIC' | 'PRIVATE';
  isPrivate?: boolean;
  maxDiscountType?: 'limited' | 'unlimited';
};

// Interface for the hook's return value
export interface UseNewVoucherReturn {
  formData: VoucherFormState;
  updateFormData: (field: keyof VoucherFormState, value: any) => void;
  resetForm: () => void;
  submitVoucher: () => Promise<void>;
  isLoading: boolean;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
}

const getInitialFormData = (): VoucherFormState => {
  // Set thời gian mặc định: startDate = hiện tại, endDate = +1 ngày
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 0, 0); // Set 23:59 cho endDate
  
  return {
    name: '',
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    value: 0,
    minOrderValue: 0,
    maxUses: 1,
    maxUsesPerUser: 1,
    startDate: now.toISOString(),
    endDate: tomorrow.toISOString(),
    isActive: true,
    showOnProductPage: true,
    selectedProducts: [],
    selectedBrands: [],
    selectedCategories: [],
    selectedShopUser: null,
    categories: [],
    brands: [],
    discountApplyType: DiscountApplyType.ALL,
    maxDiscountType: 'unlimited',
    maxDiscountValue: null, // Set null thay vì 0
  };
};

const initialFormData: VoucherFormState = getInitialFormData();

interface UseNewVoucherProps {
  useCase: VoucherUseCase;
  owner: 'PLATFORM' | 'SHOP'; // Giữ lại cho tương thích, nhưng sẽ override bằng userData.role
  userData: any; // Nhận userData từ component cha
  onCreateSuccess?: () => void;
}

export function useNewVoucher({ useCase, owner, userData, onCreateSuccess }: UseNewVoucherProps): UseNewVoucherReturn {
  const [formData, setFormData] = useState<VoucherFormState>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // userData được truyền từ component cha

  // Helper function để xử lý API error messages
  const parseErrorMessage = (error: any): string => {
    const defaultMessage = 'Đã xảy ra lỗi khi tạo voucher. Vui lòng thử lại.';
    
    if (!error?.response?.data?.message) {
      return error?.message || defaultMessage;
    }

    const apiMessage = error.response.data.message;
    
    // Kiểm tra nếu message là array (validation errors từ backend)
    if (Array.isArray(apiMessage)) {
      // Kết hợp tất cả error messages, hoặc chỉ lấy cái đầu tiên
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

  const getVoucherType = (uc: VoucherUseCase) => {
    if (uc === VoucherUseCase.PRODUCT) return VoucherType.PRODUCT;
    if (uc === VoucherUseCase.PRIVATE) return VoucherType.SHOP; // PRIVATE vẫn là SHOP type nhưng displayType khác
    return VoucherType.SHOP;
  };
  const voucherType = getVoucherType(useCase);

  // Log để debug
  useEffect(() => {
    console.log('useNewVoucher initialized:', {
      useCase, voucherType
    });

    // Sanitize form data based on use case
    setFormData(prev => {
      const newFormData = { ...getInitialFormData(), name: prev.name, code: prev.code }; // Reset to initial but keep name/code

      // Thời gian mặc định đã được set trong getInitialFormData()

      switch (useCase) {
        case VoucherUseCase.SHOP:
          newFormData.discountApplyType = DiscountApplyType.ALL;
          newFormData.selectedProducts = [];
          newFormData.displayType = 'PUBLIC';
          newFormData.isPrivate = false;
          break;
        
        case VoucherUseCase.PRODUCT:
          newFormData.discountApplyType = DiscountApplyType.SPECIFIC;
          newFormData.selectedProducts = []; // Start with empty selection
          newFormData.displayType = 'PUBLIC';
          newFormData.isPrivate = false;
          break;

        case VoucherUseCase.PRIVATE:
          newFormData.displayType = 'PRIVATE';
          newFormData.isPrivate = true;
          newFormData.discountApplyType = DiscountApplyType.ALL; // Default to all
          newFormData.selectedProducts = [];
          break;

        case VoucherUseCase.PRIVATE_ADMIN:
          newFormData.displayType = 'PRIVATE';
          newFormData.isPrivate = true;
          newFormData.discountApplyType = DiscountApplyType.ALL; // Default to all
          newFormData.selectedProducts = [];
          break;
      }
      return newFormData;
    });

  }, [useCase]);

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

  // Reset form
  const resetForm = () => {
    setFormData(getInitialFormData());
    setErrors({});
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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
      toast.error('Mức giảm phải lớn hơn 0');
      return false;
    }

    if (formData.discountType === 'PERCENTAGE' && formData.value > 100) {
      toast.error('Phần trăm giảm không được vượt quá 100%');
      return false;
    }

    if ((formData.minOrderValue ?? 0) < 0) {
      toast.error('Giá trị đơn hàng tối thiểu không được âm');
      return false;
    }

    if (formData.maxUses < 1) {
      toast.error('Tổng lượt sử dụng phải ít nhất là 1');
      return false;
    }

    if (formData.maxUsesPerUser < 1) {
      toast.error('Lượt sử dụng mỗi người phải ít nhất là 1');
      return false;
    }

    // Validation: maxUsesPerUser không được vượt quá maxUses
    if (formData.maxUsesPerUser > formData.maxUses) {
      toast.error('Số lần sử dụng tối đa per user không được vượt quá số lần sử dụng tối đa');
      return false;
    }

    // Validation cho voucher sản phẩm
    if (useCase === VoucherUseCase.PRODUCT && 
        formData.discountApplyType === DiscountApplyType.SPECIFIC && 
        (formData.selectedProducts ?? []).length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để áp dụng voucher');
      return false;
    }

    // Validation cho voucher CATEGORIES
    if (useCase === VoucherUseCase.CATEGORIES && 
        (formData.selectedCategories ?? []).length === 0) {
      toast.error('Vui lòng chọn ít nhất một danh mục để áp dụng voucher');
      return false;
    }

    // Validation cho voucher BRAND
    if (useCase === VoucherUseCase.BRAND && 
        (formData.selectedBrands ?? []).length === 0) {
      toast.error('Vui lòng chọn ít nhất một thương hiệu để áp dụng voucher');
      return false;
    }

    // Validation cho voucher SHOP_ADMIN
    if (useCase === VoucherUseCase.SHOP_ADMIN && 
        !formData.selectedShopUser) {
      toast.error('Vui lòng chọn một người dùng (shop) để áp dụng voucher');
      return false;
    }

    // Validation cho voucher PRODUCT_ADMIN khi chọn sản phẩm cụ thể
    if (useCase === VoucherUseCase.PRODUCT_ADMIN && 
        formData.selectedProducts && 
        formData.selectedProducts.length > 0 &&
        formData.discountApplyType === DiscountApplyType.SPECIFIC && 
        formData.selectedProducts.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để áp dụng voucher');
      return false;
    }

    // Validation cho voucher PRIVATE_ADMIN khi chọn sản phẩm cụ thể
    if (useCase === VoucherUseCase.PRIVATE_ADMIN && 
        formData.discountApplyType === DiscountApplyType.SPECIFIC && 
        (formData.selectedProducts ?? []).length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để áp dụng voucher');
      return false;
    }

    // Validation cho maxDiscountValue khi discountType là PERCENTAGE
    if (formData.discountType === 'PERCENTAGE' && 
        formData.maxDiscountValue !== null && 
        formData.maxDiscountValue !== undefined &&
        formData.maxDiscountValue <= 0) {
      toast.error('Mức giảm tối đa phải lớn hơn 0');
      return false;
    }

    return true;
  };

  // Submit voucher
  const submitVoucher = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    // Kiểm tra có userData không
    if (!userData) {
      toast.error('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    // Xác định owner thực tế dựa trên role của user và useCase
    // Chỉ case PLATFORM (4) mới có isPlatform = true
    // Các case khác (5-8-9) đều có isPlatform = false nhưng shopId = null
    const isAdminCase = userData?.role?.name === 'ADMIN' && 
                       [VoucherUseCase.PLATFORM, VoucherUseCase.CATEGORIES, VoucherUseCase.BRAND, 
                        VoucherUseCase.SHOP_ADMIN, VoucherUseCase.PRODUCT_ADMIN, VoucherUseCase.PRIVATE_ADMIN].includes(useCase);
    
    const isPlatformVoucher = (useCase === VoucherUseCase.PLATFORM); // Chỉ case PLATFORM mới true
    const actualOwner = isPlatformVoucher ? 'PLATFORM' : 'SHOP';

    // Xác định voucherType dựa trên useCase
    let finalVoucherType: VoucherType;
    if (useCase === VoucherUseCase.PLATFORM) {
      finalVoucherType = VoucherType.PLATFORM;
    } else {
      finalVoucherType = getVoucherType(useCase);
    }

    // Kiểm tra shopId khi là shop voucher (chỉ cho SELLER)
    if (!isAdminCase && !isPlatformVoucher && !userData?.id) {
      toast.error('Không thể lấy thông tin shop. Vui lòng đăng nhập lại.');
      return;
    }

    console.log('Debug userData structure:', {
      userData,
      userId: userData?.id,
      userRole: userData?.role?.name,
    });

    setIsLoading(true);
    try {
      // Chuẩn bị payload base theo format API
      const payload: CreateDiscountRequest = {
        name: formData.name,
        description: formData.description || formData.name, // Nếu không có description thì dùng name
        code: formData.code,
        value: formData.value,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxUsesPerUser: formData.maxUsesPerUser,
        minOrderValue: formData.minOrderValue,
        maxUses: formData.maxUses,
        shopId: null, // Sẽ được set lại trong switch statement
        isPlatform: isPlatformVoucher, // Chỉ true cho case PLATFORM
        voucherType: finalVoucherType, // Set giá trị mặc định, sẽ override trong switch
        discountApplyType: formData.discountApplyType,
        discountStatus: formData.isActive ? DiscountStatus.ACTIVE : DiscountStatus.INACTIVE,
        discountType: formData.discountType === 'FIX_AMOUNT' ? DiscountType.FIX_AMOUNT : DiscountType.PERCENTAGE,
      };

      // Xử lý voucherType dựa trên useCase
      switch (useCase) {
        case VoucherUseCase.PLATFORM:
          payload.voucherType = VoucherType.PLATFORM;
          payload.isPlatform = true;
          payload.shopId = null;
          payload.discountApplyType = DiscountApplyType.ALL; // Platform voucher luôn áp dụng cho tất cả
          break;
        
        case VoucherUseCase.CATEGORIES:
          payload.voucherType = VoucherType.CATEGORY;
          payload.isPlatform = false;
          payload.shopId = null;
          payload.discountApplyType = DiscountApplyType.SPECIFIC;
          // Thêm categories nếu có
          if (formData.selectedCategories && formData.selectedCategories.length > 0) {
            (payload as any).categories = formData.selectedCategories.map(c => c.value);
          }
          break;
        
        case VoucherUseCase.BRAND:
          payload.voucherType = VoucherType.BRAND;
          payload.isPlatform = false;
          payload.shopId = null;
          payload.discountApplyType = DiscountApplyType.SPECIFIC;
          // Thêm brands nếu có
          if (formData.selectedBrands && formData.selectedBrands.length > 0) {
            (payload as any).brands = formData.selectedBrands.map(b => b.value);
          }
          break;
        
        case VoucherUseCase.SHOP_ADMIN:
          // Case 7: Voucher shop được tạo bởi Admin (giống SELLER SHOP nhưng có quyền admin)
          payload.voucherType = VoucherType.SHOP;
          payload.isPlatform = false;
          payload.shopId = formData.selectedShopUser?.value || null; // Admin chọn user cụ thể
          payload.discountApplyType = DiscountApplyType.ALL;
          break;
          
        case VoucherUseCase.PRODUCT_ADMIN:
          // Case 8: Voucher sản phẩm được tạo bởi Admin (giống SELLER PRODUCT nhưng có quyền admin)
          payload.voucherType = VoucherType.PRODUCT;
          payload.isPlatform = false;
          payload.shopId = null; // Admin có thể tạo cho sản phẩm bất kỳ, không cần shopId cụ thể
          // Nếu có sản phẩm được chọn thì SPECIFIC, không thì ALL
          payload.discountApplyType = (formData.selectedProducts && formData.selectedProducts.length > 0) 
            ? DiscountApplyType.SPECIFIC 
            : DiscountApplyType.ALL;
          break;
          
        case VoucherUseCase.PRIVATE_ADMIN:
          // Case 9: Voucher riêng tư được tạo bởi Admin (giống SELLER PRIVATE nhưng ở cấp platform)
          payload.voucherType = VoucherType.SHOP; // Bản chất vẫn là SHOP voucher
          payload.isPlatform = false;
          payload.shopId = null; // Admin tạo voucher riêng tư cấp platform
          payload.displayType = DisplayType.PRIVATE; // Force private
          payload.discountApplyType = formData.discountApplyType; // Có thể ALL hoặc SPECIFIC
          break;
        
        default:
          // Các case SELLER (1-3) - cần shopId từ userData
          payload.voucherType = finalVoucherType;
          payload.shopId = userData.id; // SELLER cần shopId
          payload.isPlatform = false;
          break;
      }

      // Thêm các trường tùy chọn
      // Chỉ thêm maxDiscountValue khi có giá trị và discountType là PERCENTAGE
      if (formData.discountType === 'PERCENTAGE' && 
          formData.maxDiscountValue !== null && 
          formData.maxDiscountValue !== undefined &&
          formData.maxDiscountValue > 0) {
        payload.maxDiscountValue = formData.maxDiscountValue;
      } else {
        // Nếu không có hoặc không phải PERCENTAGE thì set null
        payload.maxDiscountValue = null;
      }

      // Xử lý displayType dựa trên useCase
      if (useCase === VoucherUseCase.PRIVATE || useCase === VoucherUseCase.PRIVATE_ADMIN) {
        payload.displayType = DisplayType.PRIVATE;
      } else {
        payload.displayType = formData.displayType === 'PRIVATE' ? DisplayType.PRIVATE : DisplayType.PUBLIC;
      }

      // Xử lý products cho voucher sản phẩm
      if (useCase === VoucherUseCase.PRODUCT && formData.discountApplyType === DiscountApplyType.SPECIFIC) {
        (payload as any).products = formData.selectedProducts?.map(p => p.id) || [];
      }

      // Xử lý products cho PRODUCT_ADMIN (admin có thể chọn sản phẩm từ toàn platform)
      if (useCase === VoucherUseCase.PRODUCT_ADMIN && formData.selectedProducts && formData.selectedProducts.length > 0) {
        (payload as any).products = formData.selectedProducts.map(p => p.id);
        payload.discountApplyType = DiscountApplyType.SPECIFIC;
      }

      // Xử lý products cho PRIVATE_ADMIN khi chọn sản phẩm cụ thể
      if (useCase === VoucherUseCase.PRIVATE_ADMIN && formData.discountApplyType === DiscountApplyType.SPECIFIC) {
        (payload as any).products = formData.selectedProducts?.map(p => p.id) || [];
      }

      console.log('User role and owner logic:', {
        userRole: userData?.role?.name,
        useCase,
        isAdminCase,
        isPlatformVoucher,
        shopId: payload.shopId,
        originalVoucherType: voucherType,
        finalVoucherType: finalVoucherType
      });

      console.log('Submitting voucher with payload:', payload);
      
      // Debug specific cho các case ADMIN
      if (useCase === VoucherUseCase.PLATFORM) {
        console.log('🔥 PLATFORM VOUCHER DEBUG:', {
          useCase: 'PLATFORM (4)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: true,
            voucherType: 'PLATFORM',
            shopId: null,
            discountApplyType: 'ALL'
          }
        });
      }

      if (useCase === VoucherUseCase.CATEGORIES) {
        console.log('🔥 CATEGORIES VOUCHER DEBUG:', {
          useCase: 'CATEGORIES (5)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          categories: (payload as any).categories,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'CATEGORY',
            shopId: null,
            discountApplyType: 'SPECIFIC'
          }
        });
      }

      if (useCase === VoucherUseCase.BRAND) {
        console.log('🔥 BRAND VOUCHER DEBUG:', {
          useCase: 'BRAND (6)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          brands: (payload as any).brands,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'BRAND',
            shopId: null,
            discountApplyType: 'SPECIFIC'
          }
        });
      }

      if (useCase === VoucherUseCase.SHOP_ADMIN) {
        console.log('🔥 SHOP_ADMIN VOUCHER DEBUG:', {
          useCase: 'SHOP_ADMIN (7)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          selectedShopUser: formData.selectedShopUser,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'SHOP',
            shopId: 'user_id_selected',
            discountApplyType: 'ALL'
          }
        });
      }

      if (useCase === VoucherUseCase.PRODUCT_ADMIN) {
        console.log('🔥 PRODUCT_ADMIN VOUCHER DEBUG:', {
          useCase: 'PRODUCT_ADMIN (8)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          products: (payload as any).products,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'PRODUCT',
            shopId: null,
            discountApplyType: 'ALL or SPECIFIC'
          }
        });
      }

      if (useCase === VoucherUseCase.PRIVATE_ADMIN) {
        console.log('🔥 PRIVATE_ADMIN VOUCHER DEBUG:', {
          useCase: 'PRIVATE_ADMIN (9)',
          isPlatform: payload.isPlatform,
          voucherType: payload.voucherType,
          shopId: payload.shopId,
          displayType: payload.displayType,
          products: (payload as any).products,
          discountApplyType: payload.discountApplyType,
          expectedFormat: {
            isPlatform: false,
            voucherType: 'SHOP',
            shopId: null,
            displayType: 'PRIVATE',
            discountApplyType: 'ALL or SPECIFIC'
          }
        });
      }
      
      // Gọi API
      const response = await discountService.create(payload);
      
      console.log('Voucher created successfully:', response);
      
      // Hiển thị thông báo thành công
      toast.success('Tạo voucher thành công!');
      
      // Reset form sau khi tạo thành công
      resetForm();
      
      // Callback success nếu có
      onCreateSuccess?.();

    } catch (error: any) {
      console.error('Error creating voucher:', error);
      
      // Sử dụng helper function để parse error message
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
  };
}