'use client';

import { useState, useEffect } from 'react';
import provincesService, { Province, District, Ward } from '@/services/shared/provincesService';

export interface LocationOption {
  value: string;
  label: string;
}

interface UseProvincesReturn {
  provinces: LocationOption[];
  districts: LocationOption[];
  wards: LocationOption[];
  selectedProvince: string;
  selectedDistrict: string;
  selectedWard: string;
  isLoadingProvinces: boolean;
  isLoadingDistricts: boolean;
  isLoadingWards: boolean;
  error: string | null;
  setSelectedProvince: (provinceCode: string) => void;
  setSelectedDistrict: (districtCode: string) => void;
  setSelectedWard: (wardCode: string) => void;
  getProvinceName: (code: string) => string;
  getDistrictName: (code: string) => string;
  getWardName: (code: string) => string;
  resetDistrict: () => void;
  resetWard: () => void;
  resetAll: () => void;
}

/**
 * A custom hook for managing provinces, districts, and wards data from Vietnam's administrative units
 */
export function useProvinces(): UseProvincesReturn {
  // Store all data
  const [provincesData, setProvincesData] = useState<Province[]>([]);
  const [districtsData, setDistrictsData] = useState<District[]>([]);
  const [wardsData, setWardsData] = useState<Ward[]>([]);
  
  // Selected values
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  
  // Loading states
  const [isLoadingProvinces, setIsLoadingProvinces] = useState<boolean>(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false);
  const [isLoadingWards, setIsLoadingWards] = useState<boolean>(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Convert raw data to dropdown options
  const provinces: LocationOption[] = provincesData.map((province) => ({
    value: province.code,
    label: province.name
  }));

  const districts: LocationOption[] = districtsData.map((district) => ({
    value: district.code,
    label: district.name
  }));

  const wards: LocationOption[] = wardsData.map((ward) => ({
    value: ward.code,
    label: ward.name
  }));

  // Helper functions to get names from codes
  const getProvinceName = (code: string): string => {
    const province = provincesData.find(p => p.code === code);
    return province?.name || '';
  };

  const getDistrictName = (code: string): string => {
    const district = districtsData.find(d => d.code === code);
    return district?.name || '';
  };

  const getWardName = (code: string): string => {
    const ward = wardsData.find(w => w.code === code);
    return ward?.name || '';
  };

  // Reset functions
  const resetDistrict = () => {
    setSelectedDistrict('');
    setDistrictsData([]);
  };

  const resetWard = () => {
    setSelectedWard('');
    setWardsData([]);
  };

  const resetAll = () => {
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setDistrictsData([]);
    setWardsData([]);
  };

  // Fetch all provinces on initial load
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      setError(null);
      
      try {
        const data = await provincesService.getProvinces();
        setProvincesData(data);
      } catch (err) {
        console.error('Failed to fetch provinces:', err);
        setError('Không thể tải danh sách tỉnh/thành phố');
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (!selectedProvince) {
      resetDistrict();
      return;
    }

    const fetchDistricts = async () => {
      setIsLoadingDistricts(true);
      setError(null);
      
      try {
        const data = await provincesService.getDistrictsByProvince(selectedProvince);
        setDistrictsData(data);
        resetWard(); // Reset ward when province changes
      } catch (err) {
        console.error(`Failed to fetch districts for province ${selectedProvince}:`, err);
        setError('Không thể tải danh sách quận/huyện');
      } finally {
        setIsLoadingDistricts(false);
      }
    };
    
    fetchDistricts();
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      resetWard();
      return;
    }

    const fetchWards = async () => {
      setIsLoadingWards(true);
      setError(null);
      
      try {
        const data = await provincesService.getWardsByDistrict(selectedDistrict);
        setWardsData(data);
      } catch (err) {
        console.error(`Failed to fetch wards for district ${selectedDistrict}:`, err);
        setError('Không thể tải danh sách phường/xã');
      } finally {
        setIsLoadingWards(false);
      }
    };
    
    fetchWards();
  }, [selectedDistrict]);

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    error,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    getProvinceName,
    getDistrictName,
    getWardName,
    resetDistrict,
    resetWard,
    resetAll
  };
}

export default useProvinces;
