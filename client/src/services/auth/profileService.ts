import { publicAxios, privateAxios, refreshAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { UserProfileResponse, UpdateProfileRequest, ChangePasswordRequest, ChangePasswordResponse, ChangePasswordProfileRequest, ChangePasswordProfileResponse } from '@/types/auth/profile.interface';


export const profileService = {
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await privateAxios.get<UserProfileResponse>(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    const response = await privateAxios.put<UserProfileResponse>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    return response.data;
  },
  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
      const response = await privateAxios.put<ChangePasswordResponse>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD_PROFILE,
        data
      )
      return response.data
    },
  changePasswordProfile: async (data: ChangePasswordProfileRequest): Promise<ChangePasswordProfileResponse> => {
      const response = await privateAxios.put<ChangePasswordResponse>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD_PROFILE,
        data
      )
      return response.data
    },
};


