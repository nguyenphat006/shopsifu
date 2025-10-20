import { useState } from 'react';
import { profileService } from '@/services/auth/profileService';
import { ChangePasswordProfileRequest, ChangePasswordRequest } from '@/types/auth/profile.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/route';

export const usePasswordChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (data: ChangePasswordProfileRequest) => {
    setLoading(true);
    try {
      const response = await profileService.changePasswordProfile(data);
      showToast(response.message, 'success');
      if (response.verificationType === 'OTP') {
      router.push(`${ROUTES.AUTH.VERIFY_2FA}?type=OTP`);
      showToast(response.message, 'info');
      return;
    }
    if (response.verificationType === '2FA') {
      router.push(`${ROUTES.AUTH.VERIFY_2FA}?type=TOTP`);
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
