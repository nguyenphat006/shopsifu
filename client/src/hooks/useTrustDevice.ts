import { useState } from 'react'
import { authService } from '@/services/auth/authService'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'

const TRUST_DEVICE_KEY = 'askToTrustDevice'

export function useTrustDevice() {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const checkTrustDevice = () => {
    const shouldTrust = sessionStorage.getItem(TRUST_DEVICE_KEY)
    if (shouldTrust === 'false') {
      setIsOpen(true)
    }
  }
  const handleTrustDevice = async () => {
    try {
      setLoading(true)
      // Gọi API xử lý tin tưởng thiết bị
      await authService.trustDevice()
      // Sau khi API thành công, xóa key khỏi session storage
      sessionStorage.removeItem(TRUST_DEVICE_KEY)
      // Đóng modal
      setIsOpen(false)
      // Hiển thị thông báo thành công
      showToast('Thiết bị đã được tin tưởng', 'success')
    } catch (error) {
      // Hiển thị lỗi nếu có
      showToast(parseApiError(error), 'error')
    } finally {
      // Luôn tắt trạng thái loading khi API hoàn thành (dù thành công hay thất bại)
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Không cho đóng modal khi đang trong trạng thái loading
    if (!loading) {
      setIsOpen(false)
      sessionStorage.removeItem(TRUST_DEVICE_KEY)
    }
  }

  return {
    loading,
    isOpen,
    checkTrustDevice,
    handleTrustDevice,
    handleClose
  }
}
