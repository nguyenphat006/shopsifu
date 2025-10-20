import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { otpSchema } from '../schema/index'
import { authService } from '@/services/auth/authService'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'
import { useTranslations } from 'next-intl'

type ActionType = 'signup' | 'forgot'

export function useVerify() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = (searchParams.get('action') as ActionType) || 'signup'
  const t  = useTranslations()
  const otp = otpSchema(t)
    const verifyOTP = async (code: string) => {
    try {
      setLoading(true)
      
      // API trả về message và statusCode 
      // {message: "Auth.Otp.Verified", statusCode: 200}
      const response = await authService.verifyOTP({ code })
      
      // Hiển thị message từ API response 
      const successMessage = response?.message || t('admin.showToast.auth.authSuccessful')
      showToast(t(successMessage), 'success')
      
      // Chỉ cần kiểm tra action từ URL để quyết định chuyển hướng
      if (action === 'forgot') {
        router.replace(ROUTES.AUTH.RESET_PASSWORD)
      } else if (action === 'signup') {
        router.replace(ROUTES.AUTH.SIGNUP)
      } else {
        router.replace(ROUTES.AUTH.SIGNIN)
      }
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }
  const resendOTP = async () => {
    try {
      setLoading(true)
      
      // Sử dụng phương thức resendOTP từ authService mà không có tham số
      const response = await authService.resendOTP()
      
      // Hiển thị message từ API response hoặc message mặc định
      const successMessage = response?.message || t('admin.showToast.auth.sentNewOtp')
      showToast(t(successMessage), 'success')
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (data: z.infer<typeof otp>) => {
    await verifyOTP(data.otp)
  }

  return { loading, handleVerifyCode, resendOTP, action }
}
