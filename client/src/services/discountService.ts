import { privateAxios, publicAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import {
  DiscountGetAllParams,
  DiscountGetAllResponse,
  DiscountGetByIdResponse,
  CreateDiscountRequest,
  CreateDiscountResponse,
  UpdateDiscountRequest,
  UpdateDiscountResponse,
  DeleteDiscountResponse,
  GetGuestDiscountListRequest,
  GuestGetDiscountListResponse,
  ValidateDiscountRequest,
  ValidateDiscountResponse,
} from "@/types/discount.interface";

export const discountService = {
  // 1. Get All Discounts (Admin)
  getAll: async (
    params?: DiscountGetAllParams,
    signal?: AbortSignal
  ): Promise<DiscountGetAllResponse> => {
    const response = await privateAxios.get(API_ENDPOINTS.DISCOUNT.GETALL, {
      params,
      signal,
    });
    return response.data;
  },

  // 2. Get Discount By ID
  getById: async (
    discountId: string,
    signal?: AbortSignal
  ): Promise<DiscountGetByIdResponse> => {
    const url = API_ENDPOINTS.DISCOUNT.GET_BY_ID.replace(":discountId", discountId);
    const response = await privateAxios.get(url, { signal });
    return response.data;
  },

  // 3. Create Discount
  create: async (
    data: CreateDiscountRequest,
    signal?: AbortSignal
  ): Promise<CreateDiscountResponse> => {
    const response = await privateAxios.post(API_ENDPOINTS.DISCOUNT.CREATE, data, {
      signal,
    });
    return response.data;
  },

  // 4. Update Discount
  update: async (
    discountId: string,
    data: UpdateDiscountRequest,
    signal?: AbortSignal
  ): Promise<UpdateDiscountResponse> => {
    const url = API_ENDPOINTS.DISCOUNT.UPDATE.replace(":discountId", discountId);
    const response = await privateAxios.put(url, data, { signal });
    return response.data;
  },

  // 5. Delete Discount
  delete: async (
    discountId: string,
    signal?: AbortSignal
  ): Promise<DeleteDiscountResponse> => {
    const url = API_ENDPOINTS.DISCOUNT.DELETE.replace(":discountId", discountId);
    const response = await privateAxios.delete(url, { signal });
    return response.data;
  },

  // 6. Get Guest Discount List
  getGuestDiscountList: async (
    params: GetGuestDiscountListRequest,
    signal?: AbortSignal
  ): Promise<GuestGetDiscountListResponse> => {
    const response = await publicAxios.get(
      API_ENDPOINTS.DISCOUNT.GUEST_GET_DISCOUNT_LIST,
      { params, signal }
    );
    return response.data;
  },

  // 7. Validate Discount Code
  validate: async (
    data: ValidateDiscountRequest,
    signal?: AbortSignal
  ): Promise<ValidateDiscountResponse> => {
    const response = await privateAxios.post(
      API_ENDPOINTS.DISCOUNT.VALIDATE_DISCOUNT,
      data,
      { signal }
    );
    return response.data;
  },
};