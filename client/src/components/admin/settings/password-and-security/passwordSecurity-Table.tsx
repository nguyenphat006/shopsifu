'use client'

import { SettingTable, SettingTableColumn } from '@/components/ui/settings-component/settings-table'
import { ChevronRight, Lock, Shield, Clock, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChangePasswordModal } from './passwordSecurity-ChangePassword'
import { Profile2FAModal } from './passwordSecurity-2faModal'
import { usePasswordSecurity } from './usePasswordSecurity-2fa'
import { useUserData } from '@/hooks/useGetData-UserLogin'


export function PasswordSecurityTable() {
  const router = useRouter()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const user = useUserData();
  const {
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
    t
  } = usePasswordSecurity({ isEnabled: user?.twoFactorEnabled ?? false })



  const columns: SettingTableColumn[] = [
    {
      label: "Mật khẩu",
      value: "Thực hiện thay đổi mật khẩu",
      startIcon: <Lock />,
      endIcon: <ChevronRight />,
      onClick: () => setShowChangePassword(true)
    },    {
      label: "Xác minh 2 bước",
      value: (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${user?.twoFactorEnabled ? "bg-green-500" : "bg-red-500"}`}></div>
          <span>{user?.twoFactorEnabled ? "Đã bật" : "Chưa bật"}</span>
        </div>
      ),
      startIcon: <Shield />,
      endIcon: <ChevronRight />,
      onClick: handle2FAToggle
    },
    {
      label: "Thiết bị đăng nhập",
      value: "2 thiết bị đang hoạt động", // You might want to update this with actual count
      startIcon: <Clock />,
      endIcon: <ChevronRight />,
      onClick: () => router.push('/admin/settings/session')
    },    {
      label: "Tạo lại mã khôi phục",
      value: (
        <div className="flex items-center gap-2">
          <span>Mã khôi phục sẽ được gửi về email của bạn</span>
        </div>
      ),
      startIcon: <KeyRound />,
      endIcon: <ChevronRight />,
      onClick: handleRegenerateClick
    }
  ]



  return (
    <>
      <SettingTable                                                                                               
        title="Bảo mật & Mật khẩu"
        subtitle="Quản lý bảo mật tài khoản và các thiết lập liên quan đến mật khẩu."
        columns={columns}
      />
      <ChangePasswordModal
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />      
      <Profile2FAModal
        showRegenerateConfirm={showRegenerateConfirm}
        setShowRegenerateConfirm={setShowRegenerateConfirm}
        handleRegenerateRecoveryCodes={handleRegenerateRecoveryCodes}
        show2FADialog={show2FADialog}
        setShow2FADialog={setShow2FADialog}
        showQRDialog={showQRDialog}
        setShowQRDialog={setShowQRDialog}
        showRecoveryCodesDialog={showRecoveryCodesDialog}
        setShowRecoveryCodesDialog={setShowRecoveryCodesDialog}
        is2FAEnabled={is2FAEnabled}
        loading={loading}
        qrCodeImage={qrCodeImage}
        secret={secret}
        recoveryCodes={recoveryCodes}
        Code={Code}
        setCode={setCode}
        onConfirm2FA={handleConfirm2FA}
        onConfirmSetup={handleConfirmSetup}
        copyAllRecoveryCodes={copyAllRecoveryCodes}
        downloadRecoveryCodes={downloadRecoveryCodes}
        t={t}
      />
    </>
  )
}
