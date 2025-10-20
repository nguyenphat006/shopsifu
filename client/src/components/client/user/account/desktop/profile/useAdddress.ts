import { useState } from "react";
import { useDispatch } from "react-redux";
import { addressService } from "@/services/addressService";
import { 
  AddAddressRequest, 
  UpdateAddressRequest,
  AddressGetAllResponse,
  AddressGetByIdResponse,
  DeleteAddressResponse
} from "@/types/auth/profile.interface";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import { useGetProfile } from "@/hooks/useGetProfile";

// Interface cho AddressFormValues
export interface AddressFormValues {
  id?: string;
  recipient: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
  label: string;
  isDefault: boolean;
  provinceId: number;
  districtId: number;
  wardCode: string;
  type: "home" | "office";
}

export const useAddress = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { fetchProfile } = useGetProfile();

  /* ------------------- GET ALL ------------------- */
  const getAllAddresses = async (
    params?: Record<string, any>
  ): Promise<AddressGetAllResponse["data"] | null> => {
    setLoading(true);
    try {
      const { data } = await addressService.getAll(params);
      return data;
    } catch (error) {
      showToast(parseApiError(error), "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- GET BY ID ------------------- */
  const getAddressById = async (
    id: string
  ): Promise<AddressGetByIdResponse["data"] | null> => {
    setLoading(true);
    try {
      const { data } = await addressService.getById(id);
      return data;
    } catch (error) {
      showToast(parseApiError(error), "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- CREATE ------------------- */
  const createAddress = async (
    payload: AddAddressRequest, 
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      const { message } = await addressService.create(payload);
      showToast(message || "Thêm địa chỉ thành công", "success");
      await fetchProfile();
      onSuccess?.();
    } catch (error) {
      showToast(parseApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- UPDATE ------------------- */
  const updateAddress = async (
    id: string, 
    payload: UpdateAddressRequest, 
    onSuccess?: () => void
  ) => {
    setLoading(true);
    try {
      const { message } = await addressService.update(id, payload);
      showToast(message || "Cập nhật địa chỉ thành công", "success");
      await fetchProfile();
      onSuccess?.();
    } catch (error) {
      showToast(parseApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- DELETE ------------------- */
  const deleteAddress = async (id: string, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const { message }: DeleteAddressResponse = await addressService.delete(id);
      showToast(message || "Xóa địa chỉ thành công", "success");
      await fetchProfile();
      onSuccess?.();
    } catch (error) {
      showToast(parseApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------- UTILITY FUNCTIONS ------------------- */
  
  // Function để fetch và map addresses
  const fetchAndMapAddresses = async (): Promise<AddressFormValues[]> => {
    const data = await getAllAddresses();
    if (!data) return [];

    return data.map((a) => ({
      id: a.id,
      recipient: a.recipient || "",
      phone: a.phoneNumber || "",
      province: a.province,
      district: a.district,
      ward: a.ward,
      detail: a.street,
      label: a.name,
      isDefault: a.isDefault,
      provinceId: a.provinceId || 0,
      districtId: a.districtId || 0,
      wardCode: a.wardCode || "",
      type: (a.addressType || "HOME").toLowerCase() as "home" | "office",
    }));
  };

  // Function để tìm kiếm địa chỉ matching dựa vào tên
  const findMatchingAddress = async (addressDetail: any) => {
    try {
      const { shippingService } = await import('@/services/shippingService');
      
      console.log('Finding match for address:', addressDetail);
      
      // Load provinces
      const provincesResult = await shippingService.getProvinces();
      console.log('Provinces loaded:', provincesResult.data?.length);
      
      const matchedProvince = provincesResult.data?.find((p: any) => 
        p.ProvinceName?.trim().toLowerCase() === addressDetail.province?.trim().toLowerCase()
      );
      
      console.log('Matched province:', matchedProvince);
      
      if (!matchedProvince) {
        console.log('No province match found for:', addressDetail.province);
        return { provinceId: '', districtId: '', wardCode: '' };
      }
      
      // Load districts
      const districtsResult = await shippingService.getDistricts({ 
        provinceId: matchedProvince.ProvinceID 
      });
      console.log('Districts loaded:', districtsResult.data?.length);
      
      const matchedDistrict = districtsResult.data?.find((d: any) => 
        d.DistrictName?.trim().toLowerCase() === addressDetail.district?.trim().toLowerCase()
      );
      
      console.log('Matched district:', matchedDistrict);
      
      if (!matchedDistrict) {
        console.log('No district match found for:', addressDetail.district);
        return { 
          provinceId: matchedProvince.ProvinceID.toString(), 
          districtId: '', 
          wardCode: '' 
        };
      }
      
      // Load wards
      const wardsResult = await shippingService.getWards({ 
        districtId: matchedDistrict.DistrictID 
      });
      console.log('Wards loaded:', wardsResult.data?.length);
      
      const matchedWard = wardsResult.data?.find((w: any) => 
        w.WardName?.trim().toLowerCase() === addressDetail.ward?.trim().toLowerCase()
      );
      
      console.log('Matched ward:', matchedWard);
      
      const result = {
        provinceId: matchedProvince.ProvinceID.toString(),
        districtId: matchedDistrict.DistrictID.toString(),
        wardCode: matchedWard?.WardCode || ''
      };
      
      console.log('Final matching result:', result);
      return result;
      
    } catch (error) {
      console.error('Error finding matching address:', error);
      return { provinceId: '', districtId: '', wardCode: '' };
    }
  };

  // Function để prepare address data cho edit
  const prepareAddressForEdit = async (addressId: string): Promise<{
    addressData: AddressFormValues | null;
    matchedIds: { provinceId: string; districtId: string; wardCode: string };
  }> => {
    try {
      const addressDetail = await getAddressById(addressId);
      
      if (!addressDetail) {
        return { addressData: null, matchedIds: { provinceId: '', districtId: '', wardCode: '' } };
      }

      // Tìm kiếm địa chỉ matching
      const matchedAddress = await findMatchingAddress(addressDetail);
      
      // Tạo form data
      const formData: AddressFormValues = {
        id: addressDetail.id,
        recipient: addressDetail.recipient || "",
        phone: addressDetail.phoneNumber || "",
        province: addressDetail.province,
        district: addressDetail.district,
        ward: addressDetail.ward,
        detail: addressDetail.street,
        label: addressDetail.name,
        isDefault: addressDetail.isDefault,
        provinceId: matchedAddress.provinceId ? parseInt(matchedAddress.provinceId) : (addressDetail.provinceId || 0),
        districtId: matchedAddress.districtId ? parseInt(matchedAddress.districtId) : (addressDetail.districtId || 0),
        wardCode: matchedAddress.wardCode || addressDetail.wardCode || "",
        type: (addressDetail.addressType || "HOME").toLowerCase() as "home" | "office",
      };

      console.log('Address matching result:', {
        original: addressDetail,
        matched: matchedAddress,
        formData
      });

      return {
        addressData: formData,
        matchedIds: matchedAddress
      };
    } catch (error) {
      console.error('Error preparing address for edit:', error);
      return { addressData: null, matchedIds: { provinceId: '', districtId: '', wardCode: '' } };
    }
  };

  // Function để handle save với validation
  const handleSaveAddress = async (
    data: AddressFormValues,
    editingAddressId?: string,
    onSuccess?: () => void
  ) => {
    const basePayload = {
      province: data.province || "",
      district: data.district || "",
      ward: data.ward || "",
      street: data.detail || "",
      addressType: data.type.toUpperCase() as "HOME" | "OFFICE",
      phoneNumber: data.phone || undefined,
      recipient: data.recipient || undefined,
      isDefault: data.isDefault,
      provinceId: data.provinceId,
      districtId: data.districtId,
      wardCode: data.wardCode,
    };

    try {
      if (editingAddressId) {
        const updatePayload: UpdateAddressRequest = {
          ...basePayload,
          name: data.label || "",
        };
        await updateAddress(editingAddressId, updatePayload, onSuccess);
      } else {
        const createPayload: AddAddressRequest = {
          ...basePayload,
          name: data.label || "",
        };
        await createAddress(createPayload, onSuccess);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      throw error; // Re-throw để component có thể handle
    }
  };

  // Function để format full address
  const formatFullAddress = (data: AddressFormValues) =>
    [data.detail, data.ward, data.district, data.province]
      .filter(Boolean)
      .join(", ");

  return {
    loading,
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
    // Utility functions
    fetchAndMapAddresses,
    findMatchingAddress,
    prepareAddressForEdit,
    handleSaveAddress,
    formatFullAddress,
  };
};
