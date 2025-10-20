'use client'

import { Button } from "@/components/ui/button"
export const OrderEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2 py-12">
      <img
        src="/images/client/profile/logo mini.png"
        alt="empty"
        className="w-36 h-36 object-contain"
      />
      <p>Bạn chưa có đơn hàng nào</p>
      <Button variant="link" className="text-primary px-0">Trang chủ</Button>
    </div>
  )
}
