import * as z from 'zod'
import { TFunction } from 'i18next'
type Translate = (key: string) => string;
export const EmailSchema = (t: Translate) => z.object({
  email: z.string().email({ message: t('validation.email') })
})

export const RegisterSchema = (t: Translate) =>
  z.object({
    firstName: z.string().min(1, {
      message: t('validation.firstName')
    }),
    lastName: z.string().min(1, {
      message: t('validation.lastName')
    }),
    username: z.string().min(3, {
      message: t('validation.username')
    }),
    phoneNumber: z.string().min(10, {
      message: t('validation.minLengthPhone')
    }),
    password: z
      .string()
      .min(6, { message: t('validation.password.minLength') })
      .regex(/[A-Z]/, { message: t('validation.password.uppercase') })
      .regex(/\d/, { message: t('validation.password.number') }),
    confirmPassword: z
      .string()
      .min(6, { message: t('validation.password.minLength') })
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.password.match'),
    path: ['confirmPassword']
  })

export const LoginSchema = (t: Translate) =>
  z.object({
    email: z.string().email({ message: t('validation.email') }),
    password: z
      .string()
      .min(6, { message: t('validation.password.minLength') })
      .regex(/[A-Z]/, { message: t('validation.password.uppercase') })
      .regex(/\d/, { message: t('validation.password.number') }),
    rememberMe: z.boolean()
  })

export const ForgotPasswordSchema = (t: Translate) =>
  z.object({
    email: z.string().email({
      message: t('validation.email')
    })
  })

export const otpSchema = (t: Translate) =>
  z.object({
    otp: z.string()
      .length(6, { message: t('validation.otp.length') })
      .regex(/^\d+$/, { message: t('validation.otp.numeric') })
  })

export const recoveryCodeSchema = (t: Translate) =>
  z.object({
    otp: z.string()
      .length(11, { message: t('validation.recovery.codeLength') })
      .regex(/^[A-Z0-9]{5}-[A-Z0-9]{5}$/, {
        message: t('validation.recovery.codeFormat')
      })
      .transform(val => val.toUpperCase())
  })

export const resetPasswordSchema = (t: Translate) =>
  z.object({
    password: z
      .string()
      .min(6, { message: t('validation.password.minLength') })
      .regex(/[A-Z]/, { message: t('validation.password.uppercase') })
      .regex(/\d/, { message: t('validation.password.number') }),
    confirmPassword: z
      .string()
      .min(6, { message: t('validation.password.minLength') })
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.password.match'),
    path: ['confirmPassword']
  })
