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
  InputOTPSlot,
  InputOTPSeparator
} from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { useVerify2FA } from './useVerify2fa'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export function Verify2FAForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const router = useRouter()
  const t = useTranslations()
  const { 
    loading, 
    handleVerifyCode, 
    handleResendOTP, 
    type, 
    switchToRecovery, 
    switchToTOTP, 
    schema 
  } = useVerify2FA()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { otp: '' }
  })

  // Reset form when type changes
  useEffect(() => {
    form.reset({ otp: '' })
  }, [type])

  // Khi nhập đủ ký tự thì tự động submit
  const handleOTPChange = (value: string) => {
    if (type === 'RECOVERY') {
      // Chỉ lấy các ký tự nhập vào, bỏ qua dấu gạch ngang
      const cleanValue = value.replace(/-/g, '');
      // Chỉ lấy 10 ký tự đầu tiên
      const firstPart = cleanValue.slice(0, 5);
      const secondPart = cleanValue.slice(5, 10);
      // Tạo giá trị cuối cùng với dấu gạch ngang ở giữa
      const processedValue = `${firstPart}-${secondPart}`;
      // console.log('Processed value:', processedValue);
      form.setValue('otp', processedValue, { shouldValidate: true });
      
      if (cleanValue.length === 10) {
        form.handleSubmit(handleVerifyCode)();
      }
    } else {
      form.setValue('otp', value, { shouldValidate: true });
      if (value.length === 6) {
        form.handleSubmit(handleVerifyCode)();
      }
    }
  }  // Không tự động gửi OTP khi component mount
  // Chỉ gửi khi người dùng chủ động yêu cầu thông qua nút "Resend OTP"

  const renderTitle = () => {
    switch (type) {
      case 'OTP':
        return t('auth.2faVerify.enterOTPCode')
      case 'RECOVERY':
        return t('auth.2faVerify.enterRecoveryCode')
      default:
        return t('auth.2faVerify.enterVerrifyCodeAuthen')
    }
  }

  const renderDescription = () => {
    switch (type) {
      case 'OTP':
        return t('auth.2faVerify.sent6DigitCodeEmail')
      case 'RECOVERY':
        return t('auth.2faVerify.plsEnterRecoveryCode')
      default:
        return t('auth.2faVerify.sent6DigitCodeAuthenticator')
    }
  }
  const renderSwitchMethod = () => {
    // OTP là phương thức xác thực tách biệt, không có chuyển đổi giữa OTP và TOTP/RECOVERY
    if (type === 'OTP') {
      return null // Không hiển thị nút chuyển đổi khi đang ở chế độ OTP
    }

    // Chỉ cho phép chuyển đổi giữa TOTP và RECOVERY
    return (
      <AnimatedFormItem>
        <div className="text-center text-sm">
          <button
            type="button"
            onClick={type === 'TOTP' ? switchToRecovery : switchToTOTP}
            disabled={loading}
            className="underline underline-offset-4 text-primary hover:text-primary/90 disabled:opacity-50"
          >
            {type === 'TOTP' ? t('auth.2faVerify.useRecoveryCode') : t('auth.2faVerify.useAuthenticator')}
          </button>
        </div>
      </AnimatedFormItem>
    )
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
              <h1 className="text-4xl font-bold">
                {renderTitle()}
              </h1>
              <p className="text-balance text-md text-muted-foreground">
                {renderDescription()}
              </p>
            </div>
          </AnimatedFormItem>

          {/* Input OTP/Recovery */}
          <AnimatedFormItem>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>{t('auth.2faVerify.enterVerrifyCode')}</FormLabel>
                  <FormControl>
                    <InputOTP 
                      maxLength={type === 'RECOVERY' ? 10 : 6}
                      {...field} 
                      onChange={handleOTPChange}
                      className="gap-2"
                      pattern={type === 'RECOVERY' ? '[A-Za-z0-9]*' : '[0-9]*'}
                      value={type === 'RECOVERY' ? field.value.replace(/-/g, '') : field.value}
                    >
                      {type === 'RECOVERY' ? (
                        <>
                          <InputOTPGroup>
                            {[...Array(5)].map((_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                          <InputOTPSeparator>-</InputOTPSeparator>
                          <InputOTPGroup>
                            {[...Array(5)].map((_, index) => (
                              <InputOTPSlot key={index + 5} index={index + 5} />
                            ))}
                          </InputOTPGroup>
                        </>
                      ) : (
                        <InputOTPGroup>
                          {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      )}
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </AnimatedFormItem>

          {/* Nút chuyển đổi phương thức xác minh */}
          {renderSwitchMethod()}

          {/* Link resend (chỉ hiển thị khi type là OTP) */}
          {type === 'OTP' && (
            <AnimatedFormItem>
              <div className="text-center text-sm">
                {t('auth.2faVerify.didnotReceiveCode')}{' '}                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="underline underline-offset-4 text-primary hover:text-primary/90 disabled:opacity-50"
                >
                  {t('auth.2faVerify.resendOtp')}
                </button>
              </div>
            </AnimatedFormItem>
          )}
        </AnimatedForm>
      </form>
    </Form>
  )
}
