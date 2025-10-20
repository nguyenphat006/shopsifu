import { z } from "zod";

// Define a type for the translation function `t` that will be passed from components.
// This avoids calling the `useTranslations` hook outside of a component.
type Translate = (key: string) => string;

// Reusable password validation logic
const passwordValidation = (t: Translate) => z
  .string()
  .min(6, { message: t('schema.validation.password.minLength') })
  .max(20, { message: t('schema.validation.password.maxLength') })
  .regex(/[A-Z]/, { message: t('schema.validation.password.uppercase') })
  .regex(/[a-z]/, { message: t('schema.validation.password.lowercase') })
  .regex(/[0-9]/, { message: t('schema.validation.password.number') })
  .regex(/[^A-Za-z0-9]/, { message: t('schema.validation.password.specialCharacter') });

// Schema for changing an existing password
export const passwordSchema = (t: Translate) => z.object({
  currentPassword: z.string().min(1, { message: t('schema.validation.password.currentRequired') }),
  newPassword: passwordValidation(t),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t('schema.validation.password.match'),
  path: ["confirmPassword"]
});

// Schema for simple email validation
export const EmailSchema = (t: Translate) => z.object({
  email: z.string().email({ message: t('schema.validation.email.invalid') }),
});

// Schema for updating a user's profile information
export const UpdateProfileSchema = (t: Translate) =>
  z.object({
    // firstName: z.string().min(1, { message: t('schema.validation.profile.firstNameRequired') }),
    // lastName: z.string().min(1, { message: t('schema.validation.profile.lastNameRequired') }),
    name: z.string().min(3, { message: t('schema.validation.user.usernameMinLength') }), // ✅ Thêm dòng này
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    avatar: z.string().optional(),
  });

// Schema for Step 1 of the user creation modal
export const userStepOneSchema = (t: Translate) => z.object({
  firstName: z.string().min(1, { message: t('schema.validation.user.firstNameRequired') }),
  lastName: z.string().min(1, { message: t('schema.validation.user.lastNameRequired') }),
  name: z.string().min(3, { message: t('schema.validation.user.usernameMinLength') }),
  email: z.string().email({ message: t('schema.validation.email.invalid') }),
  roleId: z.string().min(1, { message: t('schema.validation.user.roleRequired') }),
});

// Schema for Step 2 of the user creation modal (creating a new password)
export const userStepTwoSchema = (t: Translate) => z.object({
  password: passwordValidation(t),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('schema.validation.password.match'),
  path: ["confirmPassword"]
});

// User Create schema for modal upsert
export const userCreateSchema = (t: Translate) => z.object({
  email: z.string().email(t('admin.users.validation.emailValid')),
  name: z.string().min(1, t('admin.users.validation.nameRequired')),
  phoneNumber: z.string().min(1, t('admin.users.validation.phoneRequired')),
  password: z.string().min(8, t('admin.users.validation.passwordLength')),
  confirmPassword: z.string(),
  roleId: z.string().min(1, t('admin.users.validation.roleRequired')),
  status: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('admin.users.validation.passwordMatch'),
  path: ['confirmPassword'],
});

// User Update schema for modal upsert
export const userUpdateSchema = (t: Translate) => z.object({
  email: z.string().email(t('admin.users.validation.emailValid')),
  name: z.string().min(1, t('admin.users.validation.nameRequired')),
  phoneNumber: z.string().min(1, t('admin.users.validation.phoneRequired')),
  roleId: z.string().min(1, t('admin.users.validation.roleRequired')),
  status: z.string(),
  // Cho phép password trống hoặc phải dài tối thiểu 8 ký tự nếu có giá trị
});

// ✅ Có return schema rõ ràng
export const useUpdatePasswordSchema = (t: Translate) => z.object({
  password: z.string().min(1, { message: t('schema.validation.password.currentRequired') }),
  newPassword: passwordValidation(t),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: t('schema.validation.password.match'),
  path: ["confirmNewPassword"]
});

