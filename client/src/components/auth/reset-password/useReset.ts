import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { showToast } from '@/components/ui/toastify'
import { resetPasswordSchema } from '../schema/index'
import { authService } from '@/services/auth/authService'
import { ResetPasswordRequest } from '@/types/auth/auth.interface'
import { ROUTES } from '@/constants/route'
import { parseApiError } from '@/utils/error'
import { useTranslations } from 'next-intl'

const RESET_PASSWORD_TOKEN_KEY = 'token_verify_code'

export function useReset() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const t = useTranslations('')
  const schema = resetPasswordSchema(t)

  const handleResetPassword = async (data: z.infer<typeof schema>) => {
    try {
      setLoading(true)
      const resetData: ResetPasswordRequest = {
        newPassword: data.password,
        confirmPassword: data.confirmPassword
      }

      const response = await authService.resetPassword(resetData)

      
      showToast(response.message, 'success')
      router.replace(ROUTES.AUTH.SIGNIN)
    } catch (error) {
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleResetPassword }
}
