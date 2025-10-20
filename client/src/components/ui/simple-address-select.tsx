import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProvinces, useDistricts, useWards } from "@/hooks/useShipping";

interface SimpleAddressSelectProps {
  disabled?: boolean;
  onAddressChange?: (provinceId: string, districtId: string, wardCode: string) => void;
  initialValues?: {
    provinceId?: string;
    districtId?: string;
    wardCode?: string;
  };
}

export const SimpleAddressSelect: React.FC<SimpleAddressSelectProps> = ({
  disabled = false,
  onAddressChange,
  initialValues,
}) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState(initialValues?.provinceId || '');
  const [selectedDistrictId, setSelectedDistrictId] = useState(initialValues?.districtId || '');
  const [selectedWardCode, setSelectedWardCode] = useState(initialValues?.wardCode || '');

  // Update state khi initialValues thay đổi (cho edit mode)
  useEffect(() => {
    if (initialValues) {
      setSelectedProvinceId(initialValues.provinceId || '');
      setSelectedDistrictId(initialValues.districtId || '');
      setSelectedWardCode(initialValues.wardCode || '');
    }
  }, [initialValues?.provinceId, initialValues?.districtId, initialValues?.wardCode]);

  const { data: provinces, isLoading: provincesLoading } = useProvinces();
  const { data: districts, isLoading: districtsLoading } = useDistricts(
    { provinceId: parseInt(selectedProvinceId) || 0 },
    !!selectedProvinceId
  );
  const { data: wards, isLoading: wardsLoading } = useWards(
    { districtId: parseInt(selectedDistrictId) || 0 },
    !!selectedDistrictId
  );

  const handleProvinceChange = (value: string) => {
    setSelectedProvinceId(value);
    setSelectedDistrictId('');
    setSelectedWardCode('');
    
    if (onAddressChange) {
      onAddressChange(value, '', '');
    }
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrictId(value);
    setSelectedWardCode('');
    
    if (onAddressChange) {
      onAddressChange(selectedProvinceId, value, '');
    }
  };

  const handleWardChange = (value: string) => {
    setSelectedWardCode(value);
    
    if (onAddressChange) {
      onAddressChange(selectedProvinceId, selectedDistrictId, value);
    }
  };

  // Reset function (can be called from parent)
  const resetSelection = () => {
    setSelectedProvinceId('');
    setSelectedDistrictId('');
    setSelectedWardCode('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Province Select */}
      <div className="space-y-1">
        <div>
          <Label className="text-xs font-medium">Tỉnh/Thành phố</Label>
          <Select
            disabled={disabled || provincesLoading}
            onValueChange={handleProvinceChange}
            value={selectedProvinceId}
          >
            <SelectTrigger className="text-sm h-9 w-full">
              <SelectValue placeholder="Chọn tỉnh/thành phố" />
            </SelectTrigger>
            <SelectContent>
              {provinces?.data?.map((province) => (
                <SelectItem
                  key={province.ProvinceID}
                  value={province.ProvinceID.toString()}
                  className="text-sm"
                >
                  {province.ProvinceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* District Select */}
      <div className="space-y-1">
        <div>
          <Label className="text-xs font-medium">Quận/Huyện</Label>
          <Select
            disabled={disabled || !selectedProvinceId || districtsLoading}
            onValueChange={handleDistrictChange}
            value={selectedDistrictId}
          >
            <SelectTrigger className="text-sm h-9 w-full">
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent>
              {districts?.data?.map((district) => (
                <SelectItem
                  key={district.DistrictID}
                  value={district.DistrictID.toString()}
                  className="text-sm"
                >
                  {district.DistrictName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ward Select - Full width on next row */}
      <div className="space-y-1 md:col-span-2">
        <div>
          <Label className="text-xs font-medium">Phường/Xã</Label>
          <Select
            disabled={disabled || !selectedDistrictId || wardsLoading}
            onValueChange={handleWardChange}
            value={selectedWardCode}
          >
            <SelectTrigger className="text-sm h-9 w-full">
              <SelectValue placeholder="Chọn phường/xã" />
            </SelectTrigger>
            <SelectContent>
              {wards?.data?.map((ward) => (
                <SelectItem key={ward.WardCode} value={ward.WardCode} className="text-sm">
                  {ward.WardName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SimpleAddressSelect;
