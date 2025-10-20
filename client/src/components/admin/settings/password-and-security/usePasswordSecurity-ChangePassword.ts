import { useState } from 'react';
import { profileService } from '@/services/auth/profileService';
import { ChangePasswordProfileRequest } from '@/types/auth/profile.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/route';

export const usePasswordSecurityChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (data: ChangePasswordProfileRequest) => {
    setLoading(true);
    try {
      const response = await profileService.changePasswordProfile(data);
      if (response.verificationType === 'OTP') {
      router.push(`${ROUTES.AUTH.VERIFY_2FA}?type=OTP&changePassword=true`);
      showToast(response.message, 'info');
      return;
    }
    if (response.verificationType === '2FA') {
      router.push(`${ROUTES.AUTH.VERIFY_2FA}?type=TOTP&changePassword=true`);
      showToast(response.message, 'info');
      return;
    }
      return true; // Indicate success
    } catch (error: any) {
      showToast(parseApiError(error), 'error');
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleChangePassword,
  };
};
