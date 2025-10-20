'use client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp'
// import { Button } from '@/components/ui/button'
import { otpSchema } from '../schema/index'
import { useVerify } from './useVerify'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useTranslations } from 'next-intl'

export function VerifyForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const { loading, handleVerifyCode, resendOTP } = useVerify()
  const t = useTranslations('')
  const otp = otpSchema(t)

  const form = useForm<z.infer<typeof otp>>({
    resolver: zodResolver(otp),
    defaultValues: { otp: '' }
  })

  // Khi nhập đủ 6 ký tự OTP thì tự động submit
  const handleOTPChange = (value: string) => {
    form.setValue('otp', value, { shouldValidate: true })
    if (value.length === 6) {
      form.handleSubmit(handleVerifyCode)()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleVerifyCode)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <AnimatedForm>
          {/* Tiêu đề */}
          <AnimatedFormItem>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-4xl font-bold">{t('auth.verifyOtp.title')}</h1>
              <p className="text-balance text-md text-muted-foreground">
              {t('auth.verifyOtp.subtitle')}
              </p>
            </div>
          </AnimatedFormItem>

          {/* Input OTP */}
          <AnimatedFormItem>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>{t('auth.verifyOtp.title')}</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} onChange={handleOTPChange}>
                      <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AnimatedFormItem>

          {/* Link resend */}
          <AnimatedFormItem>
            <div className="text-center text-sm">
              {t('auth.verifyOtp.No code')}{' '}
              <button
                type="button"
                onClick={resendOTP}
                disabled={loading}
                className="underline underline-offset-4 text-primary hover:text-primary/90 disabled:opacity-50"
              >
                {t('auth.verifyOtp.resend')}
              </button>
            </div>
          </AnimatedFormItem>
        </AnimatedForm>
      </form>
    </Form>
  )
}
