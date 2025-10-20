import { useState } from "react";
import { profileService } from "@/services/auth/profileService";
import { ChangePasswordProfileRequest } from "@/types/auth/profile.interface";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

export type ChangePasswordResult = {
  success: boolean;
  timestamp: string | null;
};

export const usePasswordChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (
    data: ChangePasswordProfileRequest
  ): Promise<ChangePasswordResult> => {
    setLoading(true);
    try {
      const response = await profileService.changePasswordProfile(data);

      const timestamp = response?.timestamp || new Date().toISOString();

      showToast(response.message, "success");

      if (response.verificationType === "OTP") {
        router.push(`${ROUTES.AUTH.VERIFY_2FA}?type=OTP`);
        return { success: false, timestamp: null };
      }

      if (response.verificationType === "2FA") {
        router.push(`${ROUTES.AUTH.VERIFY_2FA}?type=TOTP`);
        return { success: false, timestamp: null };
      }

      localStorage.setItem("lastPasswordChangedAt", timestamp);
      return { success: true, timestamp };
    } catch (error: any) {
      showToast(parseApiError(error), "error");
      return { success: false, timestamp: null };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleChangePassword,
  };
};
