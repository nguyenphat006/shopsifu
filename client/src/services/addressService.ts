import { privateAxios } from "@/lib/api";
import { API_ENDPOINTS } from '@/constants/api';
import { 
  Address,
  AddAddressRequest,
  AddAddressResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
  AddressGetByIdResponse,
  AddressGetAllResponse,
  DeleteAddressResponse
} from "@/types/auth/profile.interface";

class AddressService {
  async getAll(params?: Record<string, any>) {
    const res = await privateAxios.get<AddressGetAllResponse>(API_ENDPOINTS.AUTH.GET_ALL_ADDRESS, { params });
    return res.data; // data có { message, data }
  }

  async getById(id: string) {
    const res = await privateAxios.get<AddressGetByIdResponse>(
      API_ENDPOINTS.AUTH.GET_ADDRESS_DETAIL.replace(":addressId", id)
    );
    return res.data;
  }

  async create(payload: AddAddressRequest) {
    const res = await privateAxios.post<AddAddressResponse>(API_ENDPOINTS.AUTH.ADD_ADDRESS, payload);
    return res.data;
  }

  async update(id: string, payload: UpdateAddressRequest) {
    const res = await privateAxios.put<UpdateAddressResponse>(
      API_ENDPOINTS.AUTH.UPDATE_ADDRESS.replace(":addressId", id),
      payload
    );
    return res.data;
  }

  async delete(id: string) {
    const res = await privateAxios.delete<DeleteAddressResponse>(
      API_ENDPOINTS.AUTH.DELETE_ADDRESS.replace(":addressId", id)
    );
    return res.data;
  }
}

export const addressService = new AddressService();
