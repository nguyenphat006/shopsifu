"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/components/ui/toastify";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useRouter } from "next/navigation";

export default function OauthCallbackPage() {
  const { fetchProfile, loading } = useGetProfile();
  const [isProcessing, setIsProcessing] = useState(true);
  const [authSuccess, setAuthSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const profileData = await fetchProfile();
        
        if (profileData) {
          console.log('Profile fetched successfully:', profileData);
          setAuthSuccess(true);
          
          // Redirect dựa trên role
          const userRole = profileData.role?.name?.toUpperCase();
          if (userRole === 'ADMIN' || userRole === 'SELLER') {
            showToast('Đăng nhập thành công!', "success");
            setTimeout(() => {
              window.location.replace("/admin");
            }, 1000);
          } else {
            showToast('Đăng nhập thành công!', "success");
            setTimeout(() => {
              window.location.replace("/");
            }, 1000);
          }
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        showToast('Đăng nhập thất bại. Vui lòng thử lại.', "error");
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [fetchProfile, router]);  // Show error state
  if (!authSuccess && !isProcessing && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Đăng nhập thất bại</p>
          <p className="text-muted-foreground text-sm mt-1">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  // Show success state
  if (authSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-600 font-medium">Đăng nhập thành công!</p>
          <p className="text-muted-foreground text-sm mt-1">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  // Show loading state (default)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Đang xử lý thông tin đăng nhập...</p>
      </div>
    </div>
  );
}
