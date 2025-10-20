"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Info, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

import { useUserData } from '@/hooks/useGetData-UserLogin';
import { useUpdatePasswordSchema } from '@/utils/schema';
import { usePasswordSecurityChangePassword } from './usePasswordSecurity-ChangePassword';

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordModal = ({ open, onOpenChange }: ChangePasswordModalProps) => {
  const t = useTranslations();
  const user = useUserData();
  const { loading, handleChangePassword } = usePasswordSecurityChangePassword();
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Create the schema dynamically with the translation function
  const currentPasswordSchema = useUpdatePasswordSchema(t);
  type PasswordFormData = z.infer<typeof currentPasswordSchema>;

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(currentPasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t('admin.profileSettings.changePassword.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-6">
            <div className="font-medium">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>

          <div className="flex items-center p-3 mb-4 space-x-2 text-sm text-blue-800 rounded-lg bg-blue-50">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-600">
              {t('admin.profileSettings.changePassword.passwordPolicy')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(async (data: PasswordFormData) => {
              if (!user) return;

              const result = await handleChangePassword({
                password: data.password,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
                // revokeOtherSessions: revokeOtherSessions,
              });

              if (result) {
                form.reset();
                setRevokeOtherSessions(false);
                onOpenChange(false);
              }
            })} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('admin.profileSettings.changePassword.currentPassword')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...field}
                          placeholder={'*********'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('admin.profileSettings.changePassword.newPassword')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          {...field}
                          placeholder={'*********'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('admin.profileSettings.changePassword.confirmNewPassword')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          placeholder={'*********'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-600 cursor-pointer hover:text-primary transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center space-x-3 space-y-0">
                <Checkbox id="revoke-sessions" checked={revokeOtherSessions} onCheckedChange={(checked) => setRevokeOtherSessions(checked === true)} />
                <label htmlFor="revoke-sessions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {t('admin.profileSettings.changePassword.revokeOtherSessions')}
                </label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? t('admin.profileSettings.changePassword.saving')
                    : t('admin.profileSettings.changePassword.saveChanges')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
