import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/services/auth/authService'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import {t} from "i18next"

type ActionType = 'signup' | 'forgot'

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = (searchParams.get('action') as ActionType) || 'signup'

  const handleSendOTP = async (email: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      if (action === 'signup') {
        const response = await authService.register_send({ email })
        // showToast(response.message, 'success')
      } else {
        const response = await authService.resetPassword_send({ email })
        showToast(response.message, 'success')
      }
      router.push(`/verify-code?action=${action}`)
      return true
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Send OTP error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    handleSendOTP,
    action
  }
}
