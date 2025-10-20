'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useTrustDevice } from '@/hooks/useTrustDevice'
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// This component now manages the persistent toast notification using sonner
export function TrustDeviceModal() {
  const { isOpen, loading, checkTrustDevice, handleTrustDevice, handleClose } = useTrustDevice()
  // const { toast, dismiss } = useToast() // Removed shadcn toast hook
  const toastIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    // Initial check when the component mounts
    checkTrustDevice();
  }, []); // Empty dependency array to run only once on mount
  useEffect(() => {
    // Show or dismiss the toast based on isOpen state and loading state
    if (isOpen) {
      // Dismiss any existing toast before showing a new one
      if (toastIdRef.current !== undefined && !loading) {
        toast.dismiss(toastIdRef.current);
      }

      const id = toast(
        <div className="flex flex-col gap-2 p-2 w-full">
          <div className="text-base font-semibold text-black">Tin tưởng thiết bị này?</div>
          <div className="text-sm text-gray-500 leading-snug">Bạn có muốn tin tưởng thiết bị này không? Nếu tin tưởng, bạn sẽ không cần xác minh 2FA trong 30 ngày tới.</div>
          <div className="flex justify-end gap-2 mt-2">            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleClose();
              }}
              disabled={loading}
              className={loading ? "opacity-50 cursor-not-allowed" : ""}
            >
              Không
            </Button><Button
              size="sm"
              variant="destructive" // Use destructive variant for red button
              onClick={() => {
                handleTrustDevice();
              }}
              disabled={loading}
              className="relative text-white bg-red-600"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : 'Tin tưởng thiết bị'}
            </Button>
          </div>
        </div>,
        {
          // options for the toast
          id: 'trust-device-toast', // Give it a fixed ID for easier management
          duration: Infinity, // Make the toast persistent
          position: 'bottom-right', // Explicitly set position if not default in Toaster
          // Remove title, description, and action props as we provide custom content
          // title: 'Tin tưởng thiết bị này?',
          // description: 'Bạn có muốn...',
          // action: (...)
          className: "p-0 border-none shadow-lg rounded-lg max-w-sm", // Style the outer toast container
          // style: { backgroundColor: 'white' }, // Example if you need direct style
        }
      );
      toastIdRef.current = id;    } else if (!loading) {
      // Chỉ đóng toast khi không trong trạng thái loading và isOpen = false
      if (toastIdRef.current !== undefined) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = undefined;
      }
    }

    // Clean up toast on unmount
    return () => {
      if (toastIdRef.current !== undefined) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isOpen, loading, handleClose, handleTrustDevice]); // Include dependencies

  // This component renders nothing directly, it only manages the toast
  return null;
}
