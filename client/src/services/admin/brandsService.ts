import { publicAxios, privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { AxiosError } from "axios";
import { PaginationRequest } from '@/types/base.interface';
import { 
  Brand, 
  BrandCreateRequest, 
  BrandGetAllResponse, 
  BrandGetByIdResponse, 
  BrandParams, 
  BrandUpdateRequest 
} from '@/types/admin/brands.interface';

// Lấy danh sách brands với phân trang và tìm kiếm
export const getAllBrands = async (params?: BrandParams): Promise<BrandGetAllResponse> => {
  try {
    const response = await privateAxios.get(API_ENDPOINTS.BRANDS.GETALL, {
      params: params
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || {
      message: 'Có lỗi xảy ra khi lấy danh sách thương hiệu'
    };
  }
};

// Lấy thông tin chi tiết brand theo ID
export const getBrandById = async (id: number | string): Promise<BrandGetByIdResponse> => {
  try {
    const url = API_ENDPOINTS.BRANDS.GET_BY_ID.replace(':brandsId', id.toString());
    const response = await privateAxios.get(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || {
      message: 'Có lỗi xảy ra khi lấy thông tin thương hiệu'
    };
  }
};

// Tạo mới brand
export const createBrand = async (data: BrandCreateRequest): Promise<Brand> => {
  try {
    const response = await privateAxios.post(API_ENDPOINTS.BRANDS.CREATE, data);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || {
      message: 'Có lỗi xảy ra khi tạo thương hiệu mới'
    };
  }
};

// Cập nhật brand
export const updateBrand = async (id: number | string, data: BrandUpdateRequest): Promise<Brand> => {
  try {
    const url = API_ENDPOINTS.BRANDS.UPDATE.replace(':brandsId', id.toString());
    const response = await privateAxios.put(url, data);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || {
      message: 'Có lỗi xảy ra khi cập nhật thương hiệu'
    };
  }
};

// Xóa brand
export const deleteBrand = async (id: number | string): Promise<void> => {
  try {
    const url = API_ENDPOINTS.BRANDS.DELETE.replace(':brandsId', id.toString());
    await privateAxios.delete(url);
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response?.data || {
      message: 'Có lỗi xảy ra khi xóa thương hiệu'
    };
  }
};