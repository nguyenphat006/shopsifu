import { useQuery } from "@tanstack/react-query";
import { shippingService } from "@/services/shippingService";
import { GetDistrictsParams, GetWardsParams } from "@/types/shipping.interface";

// Hook để lấy danh sách tỉnh/thành phố
export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: () => shippingService.getProvinces(),
    staleTime: 1000 * 60 * 60, // Cache 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
  });
};

// Hook để lấy danh sách quận/huyện theo tỉnh
export const useDistricts = (params: GetDistrictsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["districts", params.provinceId],
    queryFn: () => shippingService.getDistricts(params),
    enabled: enabled && !!params.provinceId,
    staleTime: 1000 * 60 * 30, // Cache 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // Keep in memory for 2 hours
  });
};

// Hook để lấy danh sách phường/xã theo quận
export const useWards = (params: GetWardsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["wards", params.districtId],
    queryFn: () => shippingService.getWards(params),
    enabled: enabled && !!params.districtId,
    staleTime: 1000 * 60 * 30, // Cache 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // Keep in memory for 2 hours
  });
};
