'use client'
import { redirect, useSearchParams } from 'next/navigation'
import { VerifyEmailForm } from '@/components/auth/verify-email/verifyemail-form'
import { useEffect } from 'react'

export default function VerifyCodeHandler() {
  const searchParams = useSearchParams()
  const type = searchParams.get('action')

  useEffect(() => {
    if (!type) {
      // Chuyển hướng client-side
      window.location.replace('/verify-email?action=signup')
    }
  }, [type])

  // Nếu chưa có type, không render form (tránh nháy UI)
  if (!type) return null

  return <VerifyEmailForm />
}
