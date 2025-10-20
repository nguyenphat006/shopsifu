'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EmailSchema } from '../schema'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useVerifyEmail } from './useVerifyEmail'
import { OAuthForm } from '../layout/OAuthForm'
import { useTranslations } from 'next-intl'

interface VerifyEmailFormProps {
  className?: string
  onSuccess?: (email: string) => void
}

type ActionType = 'signup' | 'forgot'

export function VerifyEmailForm({ className, onSuccess }: VerifyEmailFormProps) {
  const searchParams = useSearchParams()
  const action = (searchParams.get('action') as ActionType) || 'signup'
  const { loading, handleSendOTP } = useVerifyEmail()
  const t = useTranslations('')
  const Schema = EmailSchema(t)
  // Khởi tạo form với zod và react-hook-form

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: { email: '' }
  })

  const onSubmit = async (data: z.infer<typeof Schema>) => {
    const success = await handleSendOTP(data.email)
    if (success) {
      onSuccess?.(data.email)
    }
  }

  const getFormContent = () => {
    switch (action) {
      case 'signup':
        return {
          title: t('auth.register.title'),
          subtitle: t('auth.register.start'),
          successMessage: t('auth.register.success'),
          buttonText: t('auth.register.continue'),
          linkText: t('auth.register.haveaccount'),
          linkHref: '/sign-in',
          linkLabel: t('auth.register.login')
        }
      case 'forgot':
        return {
          title: t('auth.forgotPassword.title'),
          subtitle: t('auth.forgotPassword.subtitle'),
          successMessage: t('auth.forgotPassword.success'),
          buttonText: t('auth.forgotPassword.continue'),
          linkText: t('auth.forgotPassword.Remember password'),
          linkHref: '/sign-in',
          linkLabel: t('auth.forgotPassword.login')
        }
      default:
        return {
          title: t('auth.verifyEmail.title'),
          subtitle: t('auth.verifyEmail.subtitle'),
          successMessage: t('auth.verifyEmail.success'),
          buttonText: t('auth.verifyEmail.confirm'),
          linkText: t('auth.verifyEmail.back'),
          linkHref: '/sign-in',
          linkLabel: t('auth.verifyEmail.login')
        }
    }
  }

  const content = getFormContent()

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-6', className)}
        >
          <AnimatedForm>
            {/* Tiêu đề */}
            <AnimatedFormItem>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-4xl font-bold">{content.title}</h1>
                <p className="text-balance text-md text-muted-foreground">
                  {content.subtitle}
                </p>
              </div>
            </AnimatedFormItem>

            {/* Form */}
            <div className="grid gap-6">
              <AnimatedFormItem>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="m@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AnimatedFormItem>

              <AnimatedButton
                size="sm"
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? t('auth.verifyEmail.Processing') : content.buttonText}
              </AnimatedButton>
            </div>
            {/* OAuth Form */}
            {action === 'signup' && <OAuthForm type="signup"/>}

            {/* Link chuyển hướng */}
            <AnimatedFormItem>
              <div className="text-center text-sm">
                {content.linkText}{' '}
                <Link 
                  href={content.linkHref}
                  className="underline underline-offset-4 text-primary hover:text-primary/90"
                >
                  {content.linkLabel}
                </Link>
              </div>
            </AnimatedFormItem>
          </AnimatedForm>
        </form>
      </Form>

      
    </>
  )
}
