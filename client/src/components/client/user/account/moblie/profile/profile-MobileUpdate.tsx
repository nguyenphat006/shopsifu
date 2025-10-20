"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { UpdateProfileSchema } from "@/utils/schema";
import { z } from "zod";
import { showToast } from "@/components/ui/toastify";
import { useUpdateProfile } from "./../../profile/useProfile-Update";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import useUploadMediaPresign, {
  FileWithPreview,
} from "@/hooks/useUploadMediaPresign";

interface ProfileUpdateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    name: string;
    phoneNumber: string;
    avatar: string;
  };
}

export function ProfileUpdateSheet({
  open,
  onOpenChange,
  initialData,
}: ProfileUpdateSheetProps) {
  const [avatar, setAvatar] = useState(initialData.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userData = useUserData();
  const t = useTranslations();
  const formSchema = UpdateProfileSchema(t);

  const { updateProfile, loading } = useUpdateProfile(() =>
    onOpenChange(false)
  );

  // Hook upload mới
  const {
    handleAddFiles,
    uploadToS3Multiple,
    reset: resetUpload,
    files,
  } = useUploadMediaPresign();

  type ProfileFormData = z.infer<typeof formSchema>;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (userData && open) {
      form.reset({
        name: userData.name || "",
        phoneNumber: userData.phoneNumber || "",
        avatar: userData.avatar || "",
      });
      setAvatar(userData.avatar || "");
    }
  }, [open, initialData, form, userData]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    resetUpload(); // clear state cũ
    const { processedFiles } = await handleAddFiles([file]);
    if (processedFiles.length > 0) {
      const previewFile = processedFiles[0] as FileWithPreview;
      setAvatar(previewFile.preview || "");
      form.setValue("avatar", previewFile.preview || "", { shouldDirty: true });
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let avatarUrl = userData?.avatar;

      if (files.length > 0) {
        const urls = await uploadToS3Multiple();
        if (urls.length > 0) {
          avatarUrl = urls[0];
        }
      }

      const hasChanges =
        data.name !== userData?.name ||
        data.phoneNumber !== userData?.phoneNumber ||
        avatarUrl !== userData?.avatar;

      if (!hasChanges) {
        showToast("Không có thay đổi nào để lưu.", "info");
        return;
      }

      updateProfile({ ...data, avatar: avatarUrl });
    } catch (err) {
      console.error("Lỗi khi cập nhật profile:", err);
    }
  };

  const name = form.watch("name");
  const avatarText = name ? name[0].toUpperCase() : "U";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="h-[100vh] mx-auto w-full max-w-sm">
          <DrawerHeader className="relative">
            <DrawerTitle className="text-xl font-semibold">
              {t("user.account.profile.title")}
            </DrawerTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </DrawerHeader>
          <div className="p-4 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-3">
              <div
                className="relative cursor-pointer group"
                onClick={handleAvatarClick}
              >
                {avatar ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={avatar}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-gray-600">
                      {avatarText}
                    </span>
                  </div>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow hover:bg-gray-100 transition cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-sm text-blue-500 hover:text-blue-700 hover:underline-offset-2 transition-colors"
              >
                {t("user.account.profile.clickToChange")}
              </button>
            </div>

            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("user.account.profile.username")}
                </label>
                <Input
                  id="name"
                  {...form.register("name")}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("user.account.profile.phone")}
                </label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  type="tel"
                  className="w-full"
                />
              </div>

              <Button
                className="bg-red-600 text-white w-full mt-4"
                type="submit"
                disabled={loading}
              >
                {loading ? t("common.saving") : t("user.account.profile.save")}
              </Button>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
