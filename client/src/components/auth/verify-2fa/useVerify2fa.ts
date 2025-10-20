import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema, recoveryCodeSchema } from '../schema/index'
import { authService } from '@/services/auth/authService'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'
import { Verify2faResponse, VerifyOTPResponse } from '@/types/auth/auth.interface'
import { useTranslations } from 'next-intl'
import { useGetProfile } from '@/hooks/useGetProfile'
import { useUserData } from '@/hooks/useGetData-UserLogin'
import { useGetAbility } from '@/hooks/useGetAbility'

const TRUST_DEVICE_KEY = 'askToTrustDevice'

type TwoFactorType = 'TOTP' | 'OTP' | 'RECOVERY'

export function useVerify2FA() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as TwoFactorType) || 'TOTP';
  const isChangePasswordFlow = searchParams.get('changePassword') === 'true';
  const isRevokeAllFlow = searchParams.get('revokeAll') === 'true';
  const { fetchProfile } = useGetProfile()
  const { fetchAbility } = useGetAbility();
  const userData = useUserData();

  const role = userData?.role.name;
  const t = useTranslations()
  
  // Khóa lưu trữ trạng thái thiết bị trong session storage
  // Được cập nhật từ kết quả API sau khi xác thực thành công
  const recovery = recoveryCodeSchema(t)
  const otp = otpSchema(t)

  
  // HÀM XỬ LÝ GỬI LẠI OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true)
      const response = await authService.sendOTP({
        type: 'LOGIN'
      })
      showToast(response.message || t('auth.2faVerify.otpSent'), 'success')
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }
  // HÀM XỬ LÝ XÁC THỰC 2FA TOTP/RECOVERY
  const handleVerify2FA = async (data: { otp: string }) => {
    try {
      setLoading(true);
      let method: 'TOTP' | 'RECOVERY';

      if (type === 'RECOVERY') {
        const result = recovery.safeParse(data);
        if (!result.success) {
          throw result.error;
        }
        method = 'RECOVERY';
      } else if (type === 'TOTP') {
        otp.parse(data);
        method = 'TOTP';
      } else {
        // Trường hợp không mong muốn, nhưng để an toàn
        throw new Error('Invalid 2FA method type.');
      }

      const response = await authService.verify2fa({
        code: data.otp,
        method
      }) as Verify2faResponse;

      if (response.status === 201 && response.data) {
        showToast(response.message || t('auth.2faVerify.verificationSuccess'), 'success');


        // LUỒNG ĐỔI MẬT KHẨU
        if (isChangePasswordFlow && isRevokeAllFlow && role === 'Admin' || role === 'Super Admin') {
          router.push(ROUTES.ADMIN.DASHBOARD);
          return;
        }else{
          router.push(ROUTES.HOME);
        }

        // LUỒNG XÁC THỰC 2FA ĐỂ ĐĂNG NHẬP
        const isDeviceTrusted = response.data.isDeviceTrustedInSession;
        sessionStorage.setItem(TRUST_DEVICE_KEY, String(isDeviceTrusted));
        await fetchProfile();
        await fetchAbility();
        if(role === 'Admin' || role === 'Super Admin'){
          window.location.href = ROUTES.ADMIN.DASHBOARD;
        }else{
          window.location.href = ROUTES.HOME;
        }
      } else {
        throw new Error(response.message || t('auth.2faVerify.verificationFailed'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast(error.errors[0].message, 'error');
      } else {
        showToast(parseApiError(error), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // HÀM XỬ LÝ XÁC THỰC OTP
  const handleVerifyOTP = async (data: { otp:string }) => {
    try {
      setLoading(true);
      otp.parse(data);
      
      const response = await authService.verifyOTP({
        code: data.otp
      }) as VerifyOTPResponse;


      // LUỒNG ĐỔI MẬT KHẨU
      if (isChangePasswordFlow && isRevokeAllFlow && role === 'Admin' || role === 'Super Admin') {
        showToast(response.message || t('auth.2faVerify.otpVerificationSuccess'), 'success');
        router.push(ROUTES.ADMIN.DASHBOARD);
        return;
      }else{
        showToast(response.message || t('auth.2faVerify.otpVerificationSuccess'), 'success');
        router.push(ROUTES.HOME);
      }

      if (response.status === 201 && response.data) {
        showToast(response.message || t('auth.2faVerify.otpVerificationSuccess'), 'success');

        // LUỒNG XÁC THỰC OTP ĐỂ ĐĂNG NHẬP
        const isDeviceTrusted = response.data.isDeviceTrustedInSession;
        sessionStorage.setItem(TRUST_DEVICE_KEY, String(isDeviceTrusted));
        await fetchProfile();
        await fetchAbility();
        if(role === 'Admin' || role === 'Super Admin'){
          window.location.href = ROUTES.ADMIN.DASHBOARD;
        }else{
          window.location.href = ROUTES.HOME;
        }
      } else {
        throw new Error(response.message || t('auth.2faVerify.otpVerificationFailed'));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast(error.errors[0].message, 'error');
      } else {
        showToast(parseApiError(error), 'error');
      }
    } finally {
      setLoading(false);
    }
  };
  // HÀM XỬ LÝ CHUYỂN ĐỔI GIỮA TOTP VÀ RECOVERY
  const switchToRecovery = () => {
    router.replace(`?type=RECOVERY`)
  }
  
  const switchToTOTP = () => {
    router.replace(`?type=TOTP`)
  }
  
  // OTP là phương thức xác thực tách biệt hoàn toàn
  // Không có chức năng chuyển đổi giữa OTP và TOTP/RECOVERY  // Chọn handler phù hợp dựa trên type hiện tại
  const handleVerifyCode = (data: { otp: string }) => {
    if (type === 'OTP') {
      return handleVerifyOTP(data);
    } else {
      return handleVerify2FA(data);
    }
  };

  return { 
    loading, 
    handleVerifyCode, 
    handleVerifyOTP,
    handleVerify2FA,
    handleResendOTP,
    type, 
    switchToRecovery,
    switchToTOTP,
    schema: type === 'RECOVERY' ? recovery : otp 
  }
}
