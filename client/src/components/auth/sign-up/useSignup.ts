import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { RegisterSchema } from '../schema/index'
import { authService } from '@/services/auth/authService'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { useTranslations } from 'next-intl'

export function useSignup() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const t = useTranslations()
  const Schema = RegisterSchema(t)
  const handleSignup = async (data: z.infer<typeof Schema>) => {

    try {
      setLoading(true)
      const response = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber,
      })
      
      const successMessage = response?.message || (t('admin.showToast.auth.registerSuccessful'))
      showToast(t(successMessage), 'success')
      
      router.push('/sign-in')
    } catch (error) {
      showToast(parseApiError(error), 'error')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, handleSignup }
}
