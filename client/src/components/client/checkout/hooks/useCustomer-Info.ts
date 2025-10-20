'use client';

import { useState, useEffect } from 'react';
import { useProvinces } from '@/hooks/combobox/useProvinces';
import { CustomerFormData } from '@/types/checkout.interface';

export function useCustomerInfo(formData: CustomerFormData, handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) {
  // Parse formData để lấy code và name nếu có format "code|name"
  const parseLocationData = (value: string | undefined) => {
    if (!value) return { code: '', name: '' };
    const parts = value.split('|');
    return {
      code: parts[0] || '',
      name: parts[1] || ''
    };
  };

  const provinceData = parseLocationData(formData.province);
  const districtData = parseLocationData(formData.district);
  const wardData = parseLocationData(formData.ward);

  const [sameAsCustomer, setSameAsCustomer] = useState(true);
  const [customerProvince, setCustomerProvince] = useState<string>(provinceData.code);
  const [customerDistrict, setCustomerDistrict] = useState<string>(districtData.code);
  const [customerWard, setCustomerWard] = useState<string>(wardData.code);
  const [shippingProvince, setShippingProvince] = useState<string>('');
  const [shippingDistrict, setShippingDistrict] = useState<string>('');
  const [shippingWard, setShippingWard] = useState<string>('');
  
  // Thêm state để lưu tên của các địa điểm đã chọn
  const [customerProvinceName, setCustomerProvinceName] = useState<string>(provinceData.name);
  const [customerDistrictName, setCustomerDistrictName] = useState<string>(districtData.name);
  const [customerWardName, setCustomerWardName] = useState<string>(wardData.name);
  const [shippingProvinceName, setShippingProvinceName] = useState<string>('');
  const [shippingDistrictName, setShippingDistrictName] = useState<string>('');
  const [shippingWardName, setShippingWardName] = useState<string>('');
  
  // Use the provinces hook for customer address
  const { 
    provinces, 
    districts: customerDistricts, 
    wards: customerWards, 
    isLoadingProvinces, 
    isLoadingDistricts: isLoadingCustomerDistricts, 
    isLoadingWards: isLoadingCustomerWards,
    setSelectedProvince: setCustomerProvinceCode,
    setSelectedDistrict: setCustomerDistrictCode,
    setSelectedWard: setCustomerWardCode,
    getProvinceName: getCustomerProvinceName,
    getDistrictName: getCustomerDistrictName,
    getWardName: getCustomerWardName,
    error: provincesError
  } = useProvinces();
  
  // Debug log để kiểm tra khi nào data được load
  // Debug logging removed
  useEffect(() => {
    // Track province changes silently
  }, [customerProvince, customerProvinceName, provinces.length, isLoadingProvinces]);
  
  // Separate instance for shipping address
  const { 
    districts: shippingDistricts, 
    wards: shippingWards, 
    isLoadingDistricts: isLoadingShippingDistricts, 
    isLoadingWards: isLoadingShippingWards,
    setSelectedProvince: setShippingProvinceCode,
    setSelectedDistrict: setShippingDistrictCode,
    setSelectedWard: setShippingWardCode,
    getProvinceName: getShippingProvinceName,
    getDistrictName: getShippingDistrictName,
    getWardName: getShippingWardName
  } = useProvinces();
  
  // Load tên tỉnh/thành phố khi component được mount hoặc khi danh sách provinces thay đổi
  useEffect(() => {
    if (customerProvince && provinces.length > 0 && !isLoadingProvinces) {
      const selectedProvince = provinces.find(p => p.value === customerProvince);
      if (selectedProvince) {
        setCustomerProvinceName(selectedProvince.label);
      }
    }
  }, [customerProvince, provinces, isLoadingProvinces]);

  // Load tên quận/huyện khi component được mount hoặc khi danh sách districts thay đổi
  useEffect(() => {
    if (customerDistrict && customerDistricts.length > 0 && !isLoadingCustomerDistricts) {
      const selectedDistrict = customerDistricts.find(d => d.value === customerDistrict);
      if (selectedDistrict) {
        setCustomerDistrictName(selectedDistrict.label);
      }
    }
  }, [customerDistrict, customerDistricts, isLoadingCustomerDistricts]);

  // Load tên phường/xã khi component được mount hoặc khi danh sách wards thay đổi  
  useEffect(() => {
    if (customerWard && customerWards.length > 0 && !isLoadingCustomerWards) {
      const selectedWard = customerWards.find(w => w.value === customerWard);
      if (selectedWard) {
        setCustomerWardName(selectedWard.label);
      }
    }
  }, [customerWard, customerWards, isLoadingCustomerWards]);

  // Update customerProvinceCode when customerProvince changes
  useEffect(() => {
    if (customerProvince) {
      setCustomerProvinceCode(customerProvince);
      // Reset district và ward khi province thay đổi
      setCustomerDistrict('');
      setCustomerDistrictName('');
      setCustomerWard('');
      setCustomerWardName('');
    }
  }, [customerProvince, setCustomerProvinceCode]);

  // Update customerDistrictCode when customerDistrict changes
  useEffect(() => {
    if (customerDistrict) {
      setCustomerDistrictCode(customerDistrict);
      // Reset ward khi district thay đổi
      setCustomerWard('');
      setCustomerWardName('');
    }
  }, [customerDistrict, setCustomerDistrictCode]);
  
  // Update customerWardCode when customerWard changes
  useEffect(() => {
    if (customerWard) {
      setCustomerWardCode(customerWard);
      // Lấy tên phường/xã nếu chưa có
      if (!customerWardName) {
        const wardName = getCustomerWardName(customerWard);
        if (wardName) setCustomerWardName(wardName);
      }
    }
  }, [customerWard, customerWardName, setCustomerWardCode, getCustomerWardName]);
  
  // Update shippingProvinceCode when shippingProvince changes
  useEffect(() => {
    if (shippingProvince && !sameAsCustomer) {
      setShippingProvinceCode(shippingProvince);
      setShippingDistrict('');
      setShippingWard('');
      
      // Lấy tên tỉnh/thành phố nếu chưa có
      if (!shippingProvinceName) {
        const provinceName = getShippingProvinceName(shippingProvince);
        if (provinceName) setShippingProvinceName(provinceName);
      }
    }
  }, [shippingProvince, shippingProvinceName, sameAsCustomer, setShippingProvinceCode, getShippingProvinceName]);

  // Update shippingDistrictCode when shippingDistrict changes
  useEffect(() => {
    if (shippingDistrict && !sameAsCustomer) {
      setShippingDistrictCode(shippingDistrict);
      setShippingWard('');
    }
  }, [shippingDistrict, sameAsCustomer, setShippingDistrictCode]);

  // Xử lý khi toggle switch "Giống thông tin khách hàng"
  const handleSameAsCustomerChange = (checked: boolean) => {
    setSameAsCustomer(checked);
    
    if (checked) {
      // Cập nhật thông tin người nhận từ thông tin khách hàng
      const evt1 = {
        target: {
          name: 'receiverName',
          value: formData.fullName
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      const evt2 = {
        target: {
          name: 'receiverPhone',
          value: formData.phoneNumber
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(evt1);
      handleChange(evt2);
      
      // Copy địa chỉ
      setShippingProvince(customerProvince);
      setShippingProvinceName(customerProvinceName);
      setShippingDistrict(customerDistrict);
      setShippingDistrictName(customerDistrictName);
      setShippingWard(customerWard);
      setShippingWardName(customerWardName);
      
      // Set values in the hook
      if (customerProvince) setShippingProvinceCode(customerProvince);
      if (customerDistrict) setShippingDistrictCode(customerDistrict);
      if (customerWard) setShippingWardCode(customerWard);
    }
  };

  // Các hàm xử lý thay đổi giá trị dropdown cho địa chỉ khách hàng
  const handleProvinceChange = (value: string) => {
    setCustomerProvince(value);
    
    // Lấy tên tỉnh/thành phố từ danh sách provinces
    const selectedProvince = provinces.find(p => p.value === value);
    const provinceName = selectedProvince ? selectedProvince.label : '';
    setCustomerProvinceName(provinceName);
    
    // Ensure we have a valid provinceName before updating form data
    if (provinceName) {
      // Cập nhật form data với cả code và name
      const evt = {
        target: {
          name: 'province',
          value: `${value}|${provinceName}`
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(evt);
    } else {
      console.warn('⚠️ Province name not found for code:', value);
    }
    
    // Nếu cùng địa chỉ, cập nhật địa chỉ giao hàng
    if (sameAsCustomer) {
      setShippingProvince(value);
      setShippingProvinceName(provinceName);
      setShippingDistrict('');
      setShippingDistrictName('');
      setShippingWard('');
      setShippingWardName('');
      if (value) setShippingProvinceCode(value);
    }
  };

  const handleDistrictChange = (value: string) => {
    setCustomerDistrict(value);
    
    // Lấy tên quận/huyện từ danh sách customerDistricts
    const selectedDistrict = customerDistricts.find(d => d.value === value);
    const districtName = selectedDistrict ? selectedDistrict.label : '';
    setCustomerDistrictName(districtName);
    
    // Ensure we have a valid districtName before updating form data
    if (districtName) {
      // Cập nhật form data với cả code và name
      const evt = {
        target: {
          name: 'district',
          value: `${value}|${districtName}`
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(evt);
    } else {
      console.warn('⚠️ District name not found for code:', value);
    }
    
    // Nếu cùng địa chỉ, cập nhật địa chỉ giao hàng
    if (sameAsCustomer) {
      setShippingDistrict(value);
      setShippingDistrictName(districtName);
      setShippingWard('');
      setShippingWardName('');
      if (value) setShippingDistrictCode(value);
    }
  };

  const handleWardChange = (value: string) => {
    setCustomerWard(value);
    
    // Lấy tên phường/xã từ danh sách customerWards
    const selectedWard = customerWards.find(w => w.value === value);
    const wardName = selectedWard ? selectedWard.label : '';
    setCustomerWardName(wardName);
    
    // Ensure we have a valid wardName before updating form data
    if (wardName) {
      // Cập nhật form data với cả code và name
      const evt = {
        target: {
          name: 'ward',
          value: `${value}|${wardName}`
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(evt);
    } else {
      console.warn('⚠️ Ward name not found for code:', value);
    }
    
    // Nếu cùng địa chỉ, cập nhật địa chỉ giao hàng
    if (sameAsCustomer) {
      setShippingWard(value);
      setShippingWardName(wardName);
    }
  };
  
  // Các hàm xử lý thay đổi giá trị dropdown cho địa chỉ giao hàng
  const handleShippingProvinceChange = (value: string) => {
    setShippingProvince(value);
    // Lấy tên tỉnh/thành phố
    const provinceName = getShippingProvinceName(value);
    setShippingProvinceName(provinceName);
    
    // Ensure we have a valid provinceName before updating form data
    if (provinceName) {
      // Cập nhật form data với cả code và name
      const evt = {
        target: {
          name: 'receiverProvince',
          value: `${value}|${provinceName}`
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(evt);
    }
  };

  const handleShippingDistrictChange = (value: string) => {
    setShippingDistrict(value);
    // Lấy tên quận/huyện
    const districtName = getShippingDistrictName(value);
    setShippingDistrictName(districtName);
    
    // Ensure we have a valid districtName before updating form data
    if (districtName) {
      // Cập nhật form data với cả code và name
      const evt = {
        target: {
          name: 'receiverDistrict',
          value: `${value}|${districtName}`
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(evt);
    } else {
      console.warn('⚠️ Shipping district name not found for code:', value); 
    }
  };

  const handleShippingWardChange = (value: string) => {
    setShippingWard(value);
    // Lấy tên phường/xã
    const wardName = getShippingWardName(value);
    setShippingWardName(wardName);
    
    // Ensure we have a valid wardName before updating form data
    if (wardName) {
      // Cập nhật form data với cả code và name
      const evt = {
        target: {
          name: 'receiverWard',
          value: `${value}|${wardName}`
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleChange(evt);
    } else {
      console.warn('⚠️ Shipping ward name not found for code:', value);
    }
  };

  return {
    // States
    sameAsCustomer,
    customerProvince,
    customerDistrict,
    customerWard,
    customerProvinceName,
    customerDistrictName,
    customerWardName,
    shippingProvince,
    shippingDistrict,
    shippingWard,
    shippingProvinceName,
    shippingDistrictName,
    shippingWardName,
    
    // Data from hooks
    provinces,
    customerDistricts,
    customerWards,
    shippingDistricts,
    shippingWards,
    
    // Loading states
    isLoadingProvinces,
    isLoadingCustomerDistricts,
    isLoadingCustomerWards,
    isLoadingShippingDistricts,
    isLoadingShippingWards,
    
    // Error
    provincesError,
    
    // Handlers
    handleSameAsCustomerChange,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleShippingProvinceChange,
    handleShippingDistrictChange,
    handleShippingWardChange
  };
}