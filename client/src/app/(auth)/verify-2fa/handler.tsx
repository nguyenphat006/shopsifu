'use client'
import { redirect, useSearchParams } from 'next/navigation'
import { Verify2FAForm } from '@/components/auth/verify-2fa/verify2fa-form'
import { useEffect } from 'react'

export default function Verify2faHandler() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  useEffect(() => {
    if (!type) {
      // Chuyển hướng client-side
      window.location.replace('/verify-2fa?type=TOTP')
    }
  }, [type])

  // Nếu chưa có type, không render form (tránh nháy UI)
  if (!type) return null

  return <Verify2FAForm />
}
