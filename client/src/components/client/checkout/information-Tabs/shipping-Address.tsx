'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Book } from 'lucide-react';
import { CustomerFormData, Address } from '@/types/checkout.interface';
import { addressService } from '@/services/addressService';
import { Address as ProfileAddress } from '@/types/auth/profile.interface';
import { SimpleAddressSelect } from '@/components/ui/simple-address-select';
import { useProvinces, useDistricts, useWards } from '@/hooks/useShipping';
import { setShippingInfo } from '@/store/features/checkout/ordersSilde';

interface ShippingAddressProps {
  formData: CustomerFormData;
  handleChange: (nameOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => void;
  addresses?: Address[];
  onSelectExistingAddress: (address: Address) => void;
}

export function ShippingAddress({ 
  formData, 
  handleChange,
  addresses,
  onSelectExistingAddress
}: ShippingAddressProps) {
  const dispatch = useDispatch();
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [savedAddresses, setSavedAddresses] = useState<ProfileAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Hooks để lấy data cho việc mapping names
  const { data: provincesData } = useProvinces();
  const { data: districtsData } = useDistricts(
    { provinceId: parseInt(formData.province?.split('|')[0] || '0') },
    !!formData.province?.split('|')[0]
  );
  const { data: wardsData } = useWards(
    { districtId: parseInt(formData.district?.split('|')[0] || '0') },
    !!formData.district?.split('|')[0]
  );

  // Handle address selection changes (much simpler now)
  const handleAddressFormChange = useCallback((provinceId: string, districtId: string, wardCode: string) => {
    // Only update if not selecting existing address to prevent conflicts
    if (!isSelectingAddress) {
      // Lấy tên tương ứng với ID
      const provinceName = provincesData?.data?.find(p => p.ProvinceID.toString() === provinceId)?.ProvinceName || '';
      const districtName = districtsData?.data?.find(d => d.DistrictID.toString() === districtId)?.DistrictName || '';
      const wardName = wardsData?.data?.find(w => w.WardCode === wardCode)?.WardName || '';

      // Cập nhật formData với format "ID|Name" để information-Index có thể parse đúng
      if (provinceId && provinceName) {
        handleChange('province', `${provinceId}|${provinceName}`);
      }
      if (districtId && districtName) {
        handleChange('district', `${districtId}|${districtName}`);
      }
      if (wardCode && wardName) {
        handleChange('ward', `${wardCode}|${wardName}`);
      }

      // Lưu thông tin vào Redux với tên tương ứng
      dispatch(setShippingInfo({
        provinceId,
        districtId,
        wardCode,
        provinceName,
        districtName,
        wardName
      }));
    }
  }, [isSelectingAddress, handleChange, dispatch, provincesData, districtsData, wardsData]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoadingAddresses(true);
        const response = await addressService.getAll();
        if (response.data) {
          setSavedAddresses(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    
    const selected = savedAddresses.find((addr) => addr.id === id);
    if (selected) {
      console.log('[ShippingAddress] Selected address:', selected);
      
      if (!isSelectingAddress) {
        setIsSelectingAddress(true);
      }
      
      const addressToUpdate: Address = {
        id: selected.id,
        isDefault: selected.isDefault,
        receiverName: selected.recipient || selected.name || '',
        receiverPhone: selected.phoneNumber || '',
        addressDetail: selected.street,
        ward: `${selected.wardCode}|${selected.ward}`,
        district: `${selected.districtId}|${selected.district}`,
        province: `${selected.provinceId}|${selected.province}`,
        type: selected.addressType === 'HOME' ? 'NHÀ RIÊNG' : 'VĂN PHÒNG',
      };

      // Lưu thông tin shipping vào Redux từ địa chỉ có sẵn
      dispatch(setShippingInfo({
        provinceId: selected.provinceId?.toString() || '',
        districtId: selected.districtId?.toString() || '',
        wardCode: selected.wardCode || '',
        provinceName: selected.province,
        districtName: selected.district,
        wardName: selected.ward
      }));
      
      setTimeout(() => {
        onSelectExistingAddress(addressToUpdate);
      }, 0);
    }
  };

  return (
    <Card className='shadow-none'>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
          <CardTitle className="flex items-center text-base font-semibold">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            Thông tin nhận hàng
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {!isSelectingAddress && savedAddresses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-sm w-full sm:w-auto"
                onClick={() => {
                  // Đánh dấu chuyển sang chế độ chọn địa chỉ có sẵn
                  setIsSelectingAddress(true);
                  
                  // Clear any previously selected address
                  if (selectedAddressId) {
                    setSelectedAddressId('');
                  }
                }}
              >
                <Book className="h-4 w-4 mr-1.5 flex-shrink-0" />
                Chọn địa chỉ có sẵn
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-sm font-light mt-2">
          {isSelectingAddress ? 'Chọn địa chỉ giao hàng có sẵn' : 'Địa chỉ giao hàng của bạn'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Luôn hiển thị trường tên người nhận và số điện thoại, ngay cả khi đang chọn địa chỉ có sẵn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="receiverName" className="text-xs font-medium">
                Tên người nhận
              </Label>
              <Input
                id="receiverName"
                name="receiverName"
                placeholder="Nhập tên người nhận"
                value={formData.receiverName || ''}
                onChange={handleChange}
                className="text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="receiverPhone" className="text-xs font-medium">
                Số điện thoại người nhận
              </Label>
              <Input
                id="receiverPhone"
                name="receiverPhone"
                placeholder="Nhập số điện thoại người nhận"
                value={formData.receiverPhone || ''}
                onChange={handleChange}
                className="text-sm"
                required
              />
            </div>
          </div>

          {isSelectingAddress ? (
            <div className="space-y-3">
              <RadioGroup
                value={selectedAddressId}
                onValueChange={handleAddressSelect}
                className="space-y-3"
              >
                {isLoadingAddresses ? (
                  <p>Đang tải địa chỉ...</p>
                ) : (
                  savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                      selectedAddressId === address.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem 
                      value={address.id} 
                      id={address.id}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={address.id}
                      className="flex-1 cursor-pointer space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                          {address.addressType === 'HOME' ? 'Nhà riêng' : 'Văn phòng'}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs text-red-500">MẶC ĐỊNH</span>
                        )}
                      </div>
                      <div className="text-sm">
                        {`${address.street}, ${address.ward}, ${address.district}, ${address.province}`}
                      </div>
                    </Label>
                  </div>
                ))
              )}
              </RadioGroup>
              <div className="flex items-center">
                <span className="text-sm mr-2">hoặc</span>
                <Button
                  variant="link"
                  className="text-red-500 font-normal p-0 h-auto text-sm hover:text-red-600"
                  onClick={() => {
                    // Update local state
                    setIsSelectingAddress(false);
                    setSelectedAddressId('');
                    
                    // Clear address data
                    const clearedAddressData: Address = {
                      id: '',
                      receiverName: formData.receiverName,
                      receiverPhone: formData.receiverPhone,
                      addressDetail: '',
                      ward: '',
                      district: '',
                      province: '',
                      type: 'NHÀ RIÊNG',
                      isDefault: false
                    };
                    
                    setTimeout(() => {
                      onSelectExistingAddress(clearedAddressData);
                    }, 0);
                  }}
                >
                  nhập địa chỉ mới
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Address Selection Form */}
              <SimpleAddressSelect 
                disabled={false}
                onAddressChange={handleAddressFormChange}
                initialValues={{
                  provinceId: formData.province?.split('|')[0] || '',
                  districtId: formData.district?.split('|')[0] || '',
                  wardCode: formData.ward?.split('|')[0] || '',
                }}
              />
              
              {/* Specific Address Detail */}
              <div className="space-y-1">
                <Label htmlFor="address" className="text-xs font-medium">
                  Địa chỉ cụ thể
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Số nhà, tên đường, khu vực..."
                  value={formData.address}
                  onChange={handleChange}
                  className="text-sm h-9"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <Label htmlFor="note" className="text-xs font-medium">
              Ghi chú
            </Label>
            <Textarea
              id="note"
              name="note"
              placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
              value={formData.note}
              onChange={handleChange}
              className="h-20 text-sm resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
