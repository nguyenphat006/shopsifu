"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Info, Settings, Percent, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoucherFormState } from '../hook/useNewVoucher';
import { VoucherUseCase } from '../hook/voucher-config';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

interface DiscountSettingsProps {
  formData: VoucherFormState;
  updateFormData: (field: keyof VoucherFormState, value: any) => void;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  voucherType: string;
  isEdit?: boolean; // Thêm prop isEdit
}

export default function VoucherDiscountSettings({ formData, updateFormData, errors, useCase, voucherType, isEdit = false }: DiscountSettingsProps) {

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return '';
    }
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const parseCurrency = (value: string) => {
    return parseInt(value.replace(/[^0-9]/g, '')) || 0;
  };

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  };

  const RequiredLabel = ({ children, icon: Icon, htmlFor }: { children: React.ReactNode; icon?: any; htmlFor?: string }) => (
    <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-900 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-600" />}
      {children}
      <span className="text-red-500">*</span>
    </Label>
  );

  const InfoLabel = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
    <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-600" />}
      {children}
      <div className="group relative">
        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Tự động tối ưu hiệu quả voucher
        </div>
      </div>
    </Label>
  );

  const [isMaxDiscountLimited, setIsMaxDiscountLimited] = useState(!!formData.maxDiscountValue);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.discountType === 'FIX_AMOUNT') {
      updateFormData('value', parseCurrency(e.target.value));
    } else {
      const rawValue = e.target.value;
      if (!isNaN(Number(rawValue))) {
        updateFormData('value', rawValue === '' ? 0 : Number(rawValue));
      }
    }
  };

  const handleMaxDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData('maxDiscountValue', parseCurrency(e.target.value));
  };

  return (
    <Card className="w-full border-0 shadow-sm bg-white">
      <CardHeader className="pb-6 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
          <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
          {isEdit ? 'Cài đặt mã giảm giá (Một số thông tin không thể sửa)' : 'Thiết lập mã giảm giá'}
        </CardTitle>
        {isEdit && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Các thông tin sau không thể chỉnh sửa:</p>
                <ul className="mt-1 list-disc list-inside text-xs space-y-0.5">
                  <li>Loại giảm giá (Phần trăm/Số tiền)</li>
                  <li>Giá trị giảm giá</li>
                  <li>Mức giảm tối đa (nếu có)</li>
                  <li>Giá trị đơn hàng tối thiểu</li>
                  <li>Lượt sử dụng/người</li>
                </ul>
                <p className="mt-1 text-xs text-green-700">
                  ✅ Có thể chỉnh sửa: Tổng lượt sử dụng tối đa
                </p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Mã giảm giá thông minh */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <InfoLabel icon={Settings}>
              Mã giảm giá thông minh
            </InfoLabel>
            <Switch 
              checked={formData.isPrivate}
              onCheckedChange={(checked) => updateFormData('isPrivate', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          <p className="text-xs text-gray-600 ml-6">
            Hệ thống sẽ tự động tối ưu hiệu quả sử dụng voucher
          </p>
        </div>

        {/* Loại giảm giá & Mức giảm - Improved Layout */}
        <div className="space-y-4">
          <RequiredLabel icon={Percent} htmlFor="discountType">
            Loại giảm giá & Mức giảm
          </RequiredLabel>
          
          {/* Combined row for select and input */}
          <div className="flex gap-3">
            {/* Select for discount type */}
            <div className="flex-shrink-0 w-40">
              <Select
                value={formData.discountType || 'PERCENTAGE'}
                onValueChange={(value) => updateFormData('discountType', value)}
                disabled={isEdit} // Disable khi edit
              >
                <SelectTrigger id="discountType" className={cn(
                  "h-full border-gray-300 text-gray-900",
                  isEdit && "bg-gray-100 cursor-not-allowed"
                )}>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIX_AMOUNT">Theo số tiền</SelectItem>
                  <SelectItem value="PERCENTAGE">Theo phần trăm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Input for discount value */}
            <div className="flex-1 relative">
              <Input
                type={formData.discountType === 'PERCENTAGE' ? 'number' : 'text'}
                placeholder={formData.discountType === 'PERCENTAGE' ? "VD: 10" : "VD: 50.000"}
                value={formData.discountType === 'PERCENTAGE' ? (formData.value || '') : formatCurrency(formData.value)}
                onChange={handleValueChange}
                readOnly={isEdit} // Readonly khi edit
                className={cn(
                  "h-11 pr-12 transition-all duration-200 text-gray-900",
                  "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                  errors.value && "border-red-500 focus:border-red-500 focus:ring-red-100",
                  isEdit && "bg-gray-100 cursor-not-allowed"
                )}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-700 font-medium">
                {formData.discountType === 'PERCENTAGE' ? '%' : '₫'}
              </span>
            </div>
          </div>
          
          <ErrorMessage error={errors.discountValue} />
        </div>

        {formData.discountType === 'PERCENTAGE' && (
          <div className={cn(
            "space-y-3 p-4 border border-gray-300 rounded-md",
            isEdit ? "bg-gray-100" : "bg-gray-50/50"
          )}>
            <Label className="text-sm font-medium text-gray-900">
              Mức giảm tối đa {isEdit && <span className="text-xs text-gray-500">(Không thể chỉnh sửa)</span>}
            </Label>
            <RadioGroup
              value={isMaxDiscountLimited ? 'limited' : 'unlimited'}
              onValueChange={(value) => {
                if (isEdit) return; // Prevent change when editing
                const isLimited = value === 'limited';
                setIsMaxDiscountLimited(isLimited);
                if (!isLimited) {
                  updateFormData('maxDiscountValue', null); // Set null thay vì undefined
                }
              }}
              className="flex flex-col space-y-2 pt-1"
              disabled={isEdit} // Disable when editing
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unlimited" id="unlimited" disabled={isEdit} />
                <Label htmlFor="unlimited" className={cn(
                  "font-normal cursor-pointer text-gray-900",
                  isEdit && "cursor-not-allowed text-gray-500"
                )}>Không giới hạn</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limited" id="limited" disabled={isEdit} />
                <Label htmlFor="limited" className={cn(
                  "font-normal cursor-pointer text-gray-900",
                  isEdit && "cursor-not-allowed text-gray-500"
                )}>Giới hạn</Label>
              </div>
            </RadioGroup>
            {isMaxDiscountLimited && (
              <div className="relative pl-7 pt-2">
                <Input
                  type="text"
                  placeholder="Nhập số tiền giảm tối đa"
                  value={formatCurrency(formData.maxDiscountValue)}
                  onChange={handleMaxDiscountChange}
                  readOnly={isEdit} // Readonly khi edit
                  className={cn(
                    "pr-12 h-11 border-gray-300 text-gray-900",
                    isEdit && "bg-gray-100 cursor-not-allowed"
                  )}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                  VNĐ
                </span>
              </div>
            )}
          </div>
        )}

        {/* Điều kiện đơn hàng */}
        <div className="space-y-4">
          <RequiredLabel icon={ShoppingCart}>
            Giá trị đơn hàng tối thiểu {isEdit && <span className="text-xs text-gray-500">(Không thể chỉnh sửa)</span>}
          </RequiredLabel>
          <div className="relative mt-2">
            <Input
              type="text"
              placeholder="VD: 100.000"
              value={formatCurrency(formData.minOrderValue)}
              onChange={(e) => updateFormData('minOrderValue', parseCurrency(e.target.value))}
              readOnly={isEdit} // Readonly khi edit
              className={cn(
                "h-11 pr-12 transition-all duration-200 text-gray-900",
                "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                errors.minOrderValue && "border-red-500 focus:border-red-500 focus:ring-red-100",
                isEdit && "bg-gray-100 cursor-not-allowed"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-700 font-medium">
              ₫
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Đơn hàng phải đạt giá trị này để áp dụng voucher
          </p>
          <ErrorMessage error={errors.minOrderValue} />
        </div>

        {/* Giới hạn sử dụng */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Giới hạn sử dụng</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Tổng lượt sử dụng */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-900 flex items-center gap-1 whitespace-nowrap">
                  Tổng lượt sử dụng tối đa
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={formData.maxUses || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    updateFormData('maxUses', isNaN(value) ? 1 : value);
                  }}
                  // Cho phép edit maxUses
                  className={cn(
                    "h-10 w-28 text-center text-gray-900",
                    "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                    errors.usageLimit && "border-red-500 focus:border-red-500 focus:ring-red-100"
                  )}
                  min="1"
                />
              </div>
              <ErrorMessage error={errors.usageLimit} />
            </div>

            {/* Lượt sử dụng per user */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-900 flex items-center gap-1 whitespace-nowrap">
                  Lượt sử dụng/Người mua
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="1"
                  value={formData.maxUsesPerUser || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    updateFormData('maxUsesPerUser', isNaN(value) ? 1 : value);
                  }}
                  readOnly={isEdit} // Readonly khi edit
                  className={cn(
                    "h-10 w-28 text-center text-gray-900",
                    "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                    errors.maxUsesPerUser && "border-red-500 focus:border-red-500 focus:ring-red-100",
                    isEdit && "bg-gray-100 cursor-not-allowed"
                  )}
                  min="1"
                />
              </div>
              <ErrorMessage error={errors.maxUsesPerUser} />
            </div>
          </div>
        </div>

        {/* Thông tin tổng quan */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                Tóm tắt thiết lập
              </p>
              <p className="text-xs text-gray-700">
                {formData.value && formData.minOrderValue ? 
                  `Giảm ${formatCurrency(formData.value)}${formData.discountType === 'PERCENTAGE' ? '%' : '₫'} cho đơn hàng từ ${formatCurrency(formData.minOrderValue)}₫` :
                  'Vui lòng điền đầy đủ thông tin để xem tóm tắt'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}