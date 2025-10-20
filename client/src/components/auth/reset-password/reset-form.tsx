'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
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
import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
import { resetPasswordSchema } from '../schema/index'
import Link from 'next/link'
import { useReset } from './useReset'
import {
  AnimatedForm,
  AnimatedFormItem,
  AnimatedButton
} from '@/components/ui/animated-form'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'



export function ResetForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const t = useTranslations('')
const schema = resetPasswordSchema(t)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' }
  })
  const { loading, handleResetPassword } = useReset()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleResetPassword)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <AnimatedForm>
          {/* Tiêu đề */}
          <AnimatedFormItem>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-4xl font-bold">{t('auth.resetPassword.title')}</h1>
              <p className="text-balance text-md text-muted-foreground">
                {t('auth.resetPassword.subtitle')}
              </p>
            </div>
          </AnimatedFormItem>

          {/* Form */}
          <div className="grid gap-6">
            {/* Mật khẩu mới */}
            <AnimatedFormItem>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.resetPassword.new password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="******"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer hover:text-primary transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500 cursor-pointer hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AnimatedFormItem>

            {/* Xác nhận mật khẩu */}
            <AnimatedFormItem>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.resetPassword.confirmnewPassword')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="******"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer hover:text-primary transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500 cursor-pointer hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AnimatedFormItem>

            {/* Nút gửi */}
            <AnimatedButton
              size="sm"
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? t('auth.resetPassword.Processing...') : t('auth.resetPassword.title')}
            </AnimatedButton>
          </div>

          {/* Link trở lại đăng nhập */}
          <AnimatedFormItem>
            <div className="text-center text-sm">
              {t('auth.resetPassword.Remember password')}{' '}
              <Link
                href="/sign-in"
                className="underline underline-offset-4 text-primary hover:text-primary/90"
              >
                {t('auth.resetPassword.login')}
              </Link>
            </div>
          </AnimatedFormItem>
        </AnimatedForm>
      </form>
    </Form>
  )
}
