'use client'

import { useSearchParams } from 'next/navigation'
import { SignupForm } from '@/components/auth/sign-up/signup-form'

export default function SignUpPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return <SignupForm email={email || ''} />
}
