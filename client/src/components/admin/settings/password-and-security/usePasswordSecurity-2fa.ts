import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { authService } from '@/services/auth/authService'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { useGetProfile } from '@/hooks/useGetProfile'

import { useEffect } from 'react';

export function usePasswordSecurity({ isEnabled }: { isEnabled: boolean }) {
  const t  = useTranslations()
  const [is2FAEnabled, setIs2FAEnabled] = useState(isEnabled)
  const [show2FADialog, setShow2FADialog] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [showRecoveryCodesDialog, setShowRecoveryCodesDialog] = useState(false)
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState('')
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [Code, setCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const { fetchProfile } = useGetProfile();

  useEffect(() => {
    setIs2FAEnabled(isEnabled);
  }, [isEnabled]);

  const handle2FAToggle = async () => {
    setShow2FADialog(true)
  }

  const handleRegenerateClick = () => {
    if (is2FAEnabled) {
      setCode(''); // Reset code input
      setShowRegenerateConfirm(true);
    } else {
      showToast(t('admin.profileSettings.2fa.enable2FAFirst'), 'info');``
    }
  };

  const handleRegenerateRecoveryCodes = async (code: string) => {
    try {
      setLoading(true)
      const response = await authService.regenerateRecoveryCodes({ code })
      setRecoveryCodes(response.data.recoveryCodes || [])
      setShowRegenerateConfirm(false) // Close confirmation modal
      setShowRecoveryCodesDialog(true) // Open results modal
      showToast(response.message, 'success')
    } catch (error: any) {
      console.error('Error regenerating recovery codes:', error)
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }


  const handleConfirm2FA = async () => {
    try {
      setLoading(true)
      if (!is2FAEnabled) {
        // Setup 2FA
        const response = await authService.setup2fa()

        // Handle new response format with qrCode and secret
        setQrCodeImage(response.data?.qrCode || '')
        setSecret(response.data?.secret || '')
        setShowQRDialog(true)
        showToast(t('admin.profileSettings.2fa.scanQRFirst'), 'info')
      } else {
        // Disable 2FA
        const response = await authService.disable2fa({ method: 'totp', code: Code })
        setIs2FAEnabled(false)
        fetchProfile();
        setRecoveryCodes([])
        showToast(response.message, 'success')
        await fetchProfile();
      }
    } catch (error: any) {
      console.error('Error toggling 2FA:', error)
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
      setShow2FADialog(false)
    }
  }
  const handleConfirmSetup = async () => {
    try {
      setLoading(true)
      const response = await authService.confirm2fa({
        code: Code
      })
      setIs2FAEnabled(true)
      fetchProfile();
      // Lưu recovery codes từ response
      setRecoveryCodes(response.data.recoveryCodes || [])
      // Đóng modal QR code
      setShowQRDialog(false)
      // Mở modal recovery codes
      setShowRecoveryCodesDialog(true)
      showToast(response.message, 'success')
    } catch (error: any) {
      console.error('Error confirming 2FA:', error)
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }  // Hàm sao chép tất cả recovery codes
  const copyAllRecoveryCodes = () => {
    if (recoveryCodes.length > 0) {
      const recoveryCodesText = recoveryCodes.join('\n');
      navigator.clipboard.writeText(recoveryCodesText)
        .then(() => {
          showToast(t('admin.profileSettings.2fa.copyAllRecoveryCodes'), 'success');
        })
        .catch((error) => {
          console.error('Error copying recovery codes:', error);
          showToast('Không thể sao chép mã khôi phục', 'error');
        });
    }
  };

  // Hàm tải xuống recovery codes dưới dạng file text
  const downloadRecoveryCodes = () => {
    if (recoveryCodes.length > 0) {
      const recoveryCodesText = recoveryCodes.join('\n');
      const blob = new Blob([recoveryCodesText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'recovery-codes.txt';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Giải phóng URL object
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
      
      showToast('Đã tải xuống mã khôi phục', 'success');
    }
  };

  return {
    is2FAEnabled,
    show2FADialog,
    setShow2FADialog,
    showQRDialog,
    setShowQRDialog,
    showRecoveryCodesDialog,
    setShowRecoveryCodesDialog,
    qrCodeImage,
    secret,
    loading,
    Code,
    setCode,
    recoveryCodes,
    handle2FAToggle,
    handleConfirm2FA,
    handleConfirmSetup,
    handleRegenerateClick,
    handleRegenerateRecoveryCodes,
    showRegenerateConfirm,
    setShowRegenerateConfirm,
    copyAllRecoveryCodes,
    downloadRecoveryCodes,
    t,
  }
}
