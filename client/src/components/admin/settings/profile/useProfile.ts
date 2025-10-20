import { useState } from "react";
import { useDispatch } from "react-redux";
import { profileService } from "@/services/auth/profileService";
import { UpdateProfileRequest } from "@/types/auth/profile.interface";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import { setProfile } from "@/store/features/auth/profileSlide";
import { useGetProfile } from "@/hooks/useGetProfile";

export const useUpdateProfile = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { fetchProfile } = useGetProfile();

  const updateProfile = async (data: Partial<UpdateProfileRequest>) => {
    setLoading(true);
    try {
      const response = await profileService.updateProfile(data);
      showToast(response.message || "Cập nhật thông tin thành công", "success");

      await fetchProfile();
      onSuccess?.();
    } catch (error) {
      const apiError = parseApiError(error);
      showToast(apiError, "error");
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
};
