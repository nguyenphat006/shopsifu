"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, AlertCircle, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { VoucherFormState } from '../hook/useNewVoucher';
import { VoucherUseCase } from '../hook/voucher-config';

interface BasicInfoProps {
  formData: VoucherFormState;
  updateFormData: (field: keyof VoucherFormState, value: any) => void;
  errors: Record<string, string>;
  useCase: VoucherUseCase;
  isEdit?: boolean; // Thêm prop isEdit
}

const getVoucherTypeName = (useCase: VoucherUseCase) => {
  switch (useCase) {
    case VoucherUseCase.SHOP:
      return 'Voucher toàn Shop';
    case VoucherUseCase.PRODUCT:
      return 'Voucher sản phẩm';
    case VoucherUseCase.PRIVATE:
      return 'Voucher riêng tư';
    case VoucherUseCase.PLATFORM:
      return 'Voucher toàn nền tảng';
    case VoucherUseCase.CATEGORIES:
      return 'Voucher theo danh mục';
    case VoucherUseCase.BRAND:
      return 'Voucher theo thương hiệu';
    case VoucherUseCase.SHOP_ADMIN:
      return 'Voucher shop (Admin)';
    case VoucherUseCase.PRODUCT_ADMIN:
      return 'Voucher sản phẩm (Admin)';
    case VoucherUseCase.PRIVATE_ADMIN:
      return 'Voucher riêng tư (Admin)';
    default:
      return 'Voucher';
  }
};

export default function VoucherBasicInfo({ formData, updateFormData, errors, useCase, isEdit = false }: BasicInfoProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Debug log để kiểm tra useCase
  console.log('VoucherBasicInfo useCase:', useCase, typeof useCase);
  console.log('VoucherTypeName:', getVoucherTypeName(useCase));

  // Helper function để tạo danh sách giờ
  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return { value: hour, label: `${hour}:00` };
    });
  };

  // Helper function để tạo danh sách phút
  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => {
      const minute = i.toString().padStart(2, '0');
      return { value: minute, label: minute };
    });
  };

  const handleDateSelect = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      // Giữ nguyên thời gian hiện tại nếu có, hoặc set mặc định là 00:00
      const currentDateTime = formData[field] ? new Date(formData[field]) : null;
      const selectedDate = new Date(date);
      
      if (currentDateTime) {
        selectedDate.setHours(currentDateTime.getHours());
        selectedDate.setMinutes(currentDateTime.getMinutes());
      } else {
        // Set thời gian mặc định
        if (field === 'startDate') {
          selectedDate.setHours(0, 0, 0, 0); // 00:00 cho ngày bắt đầu
        } else {
          selectedDate.setHours(23, 59, 0, 0); // 23:59 cho ngày kết thúc
        }
      }
      
      updateFormData(field, selectedDate.toISOString());
    }
    if (field === 'startDate') setStartDateOpen(false);
    if (field === 'endDate') setEndDateOpen(false);
  };

  const handleTimeChange = (field: 'startDate' | 'endDate', type: 'hour' | 'minute', value: string) => {
    const currentDate = formData[field] ? new Date(formData[field]) : new Date();
    
    if (type === 'hour') {
      currentDate.setHours(parseInt(value));
    } else {
      currentDate.setMinutes(parseInt(value));
    }
    
    updateFormData(field, currentDate.toISOString());
  };

  // Helper để lấy giá trị giờ phút từ datetime
  const getTimeValue = (dateTimeString: string, type: 'hour' | 'minute') => {
    if (!dateTimeString) return type === 'hour' ? '00' : '00';
    const date = new Date(dateTimeString);
    return type === 'hour' 
      ? date.getHours().toString().padStart(2, '0')
      : date.getMinutes().toString().padStart(2, '0');
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

  // Helper function để xác định màu sắc badge theo useCase
  const getBadgeStyle = (useCase: VoucherUseCase) => {
    const isAdminCase = [
      VoucherUseCase.PLATFORM, 
      VoucherUseCase.CATEGORIES, 
      VoucherUseCase.BRAND, 
      VoucherUseCase.SHOP_ADMIN, 
      VoucherUseCase.PRODUCT_ADMIN,
      VoucherUseCase.PRIVATE_ADMIN
    ].includes(useCase);

    if (isAdminCase) {
      return {
        container: "bg-gradient-to-r from-red-50 to-red-100 border border-red-200",
        icon: "text-red-600",
        text: "text-red-700"
      };
    }

    return {
      container: "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200",
      icon: "text-blue-600", 
      text: "text-blue-700"
    };
  };

  const badgeStyle = getBadgeStyle(useCase);

  const RequiredLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
    <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-900 flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <Card className="w-full border-0 shadow-sm bg-white">
      <CardHeader className="pb-6 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
          <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
          {isEdit ? 'Chỉnh sửa thông tin cơ bản' : 'Thông tin cơ bản'}
        </CardTitle>
        {isEdit && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Một số thông tin không thể chỉnh sửa:</p>
                <ul className="mt-1 list-disc list-inside text-xs space-y-0.5">
                  <li>Mã voucher và thời gian bắt đầu</li>
                  <li>Loại giảm giá và giá trị giảm giá</li>
                  <li>Lượt sử dụng tối đa và lượt sử dụng/người</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg", badgeStyle.container)}>
            <Tag className={cn("w-3.5 h-3.5", badgeStyle.icon)} />
            <span className={cn("text-xs font-medium", badgeStyle.text)}>{getVoucherTypeName(useCase)}</span>
          </div>
          {/* Thêm badge admin nếu là case admin */}
          {[VoucherUseCase.PLATFORM, VoucherUseCase.CATEGORIES, VoucherUseCase.BRAND, VoucherUseCase.SHOP_ADMIN, VoucherUseCase.PRODUCT_ADMIN, VoucherUseCase.PRIVATE_ADMIN].includes(useCase) && (
            <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
              Admin Only
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Tên chương trình giảm giá */}
        <div className="space-y-2">
          <RequiredLabel htmlFor="voucher-name">
            Tên chương trình giảm giá
          </RequiredLabel>
          <div className="relative">
            <Input
              id="voucher-name"
              placeholder="Nhập tên chương trình giảm giá..."
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              className={cn(
                "pr-16 h-11 transition-all duration-200 text-gray-900",
                "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                errors.name && "border-red-500 focus:border-red-500 focus:ring-red-100"
              )}
              maxLength={100}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full transition-colors",
                formData.name.length > 90 ? "bg-red-100 text-red-600" :
                formData.name.length > 70 ? "bg-orange-100 text-orange-600" :
                "bg-gray-100 text-gray-600"
              )}>
                {formData.name.length}/100
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            Tên này không được hiển thị cho người mua
          </p>
          <ErrorMessage error={errors.name} />
        </div>

        {/* Mã voucher */}
        <div className="space-y-2">
          <RequiredLabel htmlFor="voucher-code">
            Mã voucher
          </RequiredLabel>
          <div className="relative">
            <Input
              id="voucher-code"
              placeholder="VD: GIAM1, FREES"
              value={formData.code}
              onChange={(e) => updateFormData('code', e.target.value.toUpperCase())}
              className={cn(
                "pr-16 h-11 font-mono transition-all duration-200 text-gray-900",
                "border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100",
                errors.code && "border-red-500 focus:border-red-500 focus:ring-red-100",
                isEdit && "bg-gray-100 cursor-not-allowed" // Readonly style when edit
              )}
              maxLength={5}
              readOnly={isEdit} // Readonly khi edit
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full transition-colors",
                formData.code.length > 15 ? "bg-red-100 text-red-600" :
                formData.code.length > 10 ? "bg-orange-100 text-orange-600" :
                "bg-gray-100 text-gray-600"
              )}>
                {formData.code.length}/5
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            {isEdit ? "Mã voucher không thể thay đổi khi chỉnh sửa" : "Chỉ được sử dụng chữ cái viết hoa(A-Z), số (0-9)"}
          </p>
          <ErrorMessage error={errors.code} />
        </div>

        {/* Thời gian sử dụng mã */}
        <div className="space-y-4">
          <RequiredLabel>
            Thời gian sử dụng
          </RequiredLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngày bắt đầu */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Từ ngày
              </Label>
              <Popover open={!isEdit && startDateOpen} onOpenChange={!isEdit ? setStartDateOpen : undefined}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isEdit} // Disable khi edit
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal transition-all duration-200",
                      "border-gray-300 hover:border-red-300 hover:bg-red-50",
                      !formData.startDate && "text-gray-500",
                      formData.startDate && "text-gray-900",
                      errors.startDate && "border-red-500",
                      isEdit && "bg-gray-100 cursor-not-allowed hover:bg-gray-100 hover:border-gray-300" // Readonly style
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                    {formData.startDate ? (
                      <div className="flex items-center gap-2">
                        <span>{format(new Date(formData.startDate), 'dd/MM/yyyy', { locale: vi })}</span>
                        <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          {format(new Date(formData.startDate), 'HH:mm')}
                        </div>
                      </div>
                    ) : (
                      "Chọn ngày và giờ bắt đầu"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-lg border-gray-200" align="start">
                  <div className="flex">
                    <Calendar
                      mode="single"
                      selected={formData.startDate ? new Date(formData.startDate) : undefined}
                      onSelect={(date) => handleDateSelect('startDate', date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="rounded-l-lg border-r"
                    />
                    <div className="p-4 space-y-4 w-32">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">Giờ</Label>
                        <Select
                          value={getTimeValue(formData.startDate, 'hour')}
                          onValueChange={(value) => handleTimeChange('startDate', 'hour', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="00" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateHours().map(hour => (
                              <SelectItem key={hour.value} value={hour.value}>
                                {hour.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">Phút</Label>
                        <Select
                          value={getTimeValue(formData.startDate, 'minute')}
                          onValueChange={(value) => handleTimeChange('startDate', 'minute', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="00" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateMinutes().map(minute => (
                              <SelectItem key={minute.value} value={minute.value}>
                                {minute.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <ErrorMessage error={errors.startDate} />
            </div>

            {/* Ngày kết thúc */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Đến ngày
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal transition-all duration-200",
                      "border-gray-300 hover:border-red-300 hover:bg-red-50",
                      !formData.endDate && "text-gray-500",
                      formData.endDate && "text-gray-900",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                    {formData.endDate ? (
                      <div className="flex items-center gap-2">
                        <span>{format(new Date(formData.endDate), 'dd/MM/yyyy', { locale: vi })}</span>
                        <div className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          {format(new Date(formData.endDate), 'HH:mm')}
                        </div>
                      </div>
                    ) : (
                      "Chọn ngày và giờ kết thúc"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-lg border-gray-200" align="start">
                  <div className="flex">
                    <Calendar
                      mode="single"
                      selected={formData.endDate ? new Date(formData.endDate) : undefined}
                      onSelect={(date) => handleDateSelect('endDate', date)}
                      disabled={(date) => {
                        const today = new Date();
                        const startDate = formData.startDate ? new Date(formData.startDate) : today;
                        return date < today || date < startDate;
                      }}
                      initialFocus
                      className="rounded-l-lg border-r"
                    />
                    <div className="p-4 space-y-4 w-32">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">Giờ</Label>
                        <Select
                          value={getTimeValue(formData.endDate, 'hour')}
                          onValueChange={(value) => handleTimeChange('endDate', 'hour', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="23" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateHours().map(hour => (
                              <SelectItem key={hour.value} value={hour.value}>
                                {hour.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-700">Phút</Label>
                        <Select
                          value={getTimeValue(formData.endDate, 'minute')}
                          onValueChange={(value) => handleTimeChange('endDate', 'minute', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="59" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateMinutes().map(minute => (
                              <SelectItem key={minute.value} value={minute.value}>
                                {minute.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <ErrorMessage error={errors.endDate} />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-800 flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>Voucher có thể được lưu trước thời gian sử dụng</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}