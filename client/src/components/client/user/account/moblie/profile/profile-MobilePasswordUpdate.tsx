"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useUpdatePasswordSchema } from "@/utils/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Info, Lock, X, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import { usePasswordChangePassword } from "../../profile/useProfile-ChangePassword";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  name,
}: ChangePasswordModalProps) {
  const { loading, handleChangePassword } = usePasswordChangePassword();
  const user = useUserData();
  const t = useTranslations();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false);

  const schema = useUpdatePasswordSchema(t);
  type PasswordFormData = z.infer<typeof schema>;

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="h-[100vh] mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-600" />
              <DrawerTitle className="text-xl font-semibold">
                {t("user.account.password.title")}
              </DrawerTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <DrawerDescription>
              <div className="mt-2">
                <div className="font-medium text-sm">@{name}</div>
              </div>
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-6">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-600">
                {t("user.account.password.subtitle")}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(async (data) => {
                  if (!user) return;

                  const result = await handleChangePassword({
                    password: data.password, // đổi field name
                    newPassword: data.newPassword,
                    confirmNewPassword: data.confirmNewPassword, // đổi field name
                    // bỏ revokeOtherSessions nếu backend không dùng
                  });

                  if (result) {
                    form.reset();
                    setRevokeOtherSessions(false);
                    onOpenChange(false);
                  }
                })}
                className="space-y-4"
              >
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          {t("user.account.password.currentPassword")}
                        </FormLabel>
                        <a
                          href="#"
                          className="text-xs text-gray-500 hover:underline"
                        >
                          {t("user.account.password.forgotPassword")}
                        </a>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            className="text-sm"
                            placeholder={t(
                              "user.account.password.currentPasswordPlaceholder"
                            )}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword((prev) => !prev)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            tabIndex={-1}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">
                        {t("user.account.password.newPassword")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            className="text-sm"
                            placeholder={t(
                              "user.account.password.newPasswordPlaceholder"
                            )}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            tabIndex={-1}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        {t("user.account.password.minLength")}
                      </p>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">
                        {t("user.account.password.confirmPassword")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="text-sm"
                            placeholder={t(
                              "user.account.password.newPasswordPlaceholder"
                            )}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Revoke other sessions */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="revokeOtherSessions"
                    checked={revokeOtherSessions}
                    onCheckedChange={(checked) =>
                      setRevokeOtherSessions(checked === true)
                    }
                  />
                  <label
                    htmlFor="revokeOtherSessions"
                    className="text-sm text-gray-600 leading-none"
                  >
                    {t("user.account.password.revokeOtherSessions")}
                  </label>
                </div>

                <DrawerFooter className="border-t">
                  <Button
                    type="submit"
                    className="bg-red-600 text-white w-full"
                    disabled={loading}
                  >
                    {loading
                      ? t("user.account.password.processing")
                      : t("user.account.password.changePassword")}
                  </Button>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
