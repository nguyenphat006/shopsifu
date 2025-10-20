'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QRCodeSVG } from 'qrcode.react'
import React from 'react'
import { ShieldCheck, Smartphone } from "lucide-react"
import Link from "next/link"

interface Profile2FAModalProps {
  showRegenerateConfirm: boolean;
  setShowRegenerateConfirm: (open: boolean) => void;
  handleRegenerateRecoveryCodes: (code: string) => void;
  show2FADialog: boolean
  setShow2FADialog: (open: boolean) => void
  showQRDialog: boolean
  setShowQRDialog: (open: boolean) => void
  showRecoveryCodesDialog?: boolean
  setShowRecoveryCodesDialog?: (open: boolean) => void
  is2FAEnabled: boolean
  loading?: boolean
  qrCodeImage: string
  secret: string
  recoveryCodes?: string[]
  Code: string
  setCode: (code: string) => void
  onConfirm2FA: () => void
  onConfirmSetup: () => void
  copyAllRecoveryCodes?: () => void
  downloadRecoveryCodes?: () => void
  t: (key: string) => string
}

export function Profile2FAModal({
  show2FADialog,
  setShow2FADialog,
  showQRDialog,
  setShowQRDialog,
  showRecoveryCodesDialog = false,
  setShowRecoveryCodesDialog = () => {},
  is2FAEnabled,
  loading = false,
  qrCodeImage,
  secret,
  recoveryCodes = [],
  Code,
  setCode,
  onConfirm2FA,
  onConfirmSetup,
  copyAllRecoveryCodes = () => {},
  downloadRecoveryCodes = () => {},
  t,
  showRegenerateConfirm,
  setShowRegenerateConfirm,
  handleRegenerateRecoveryCodes,
}: Profile2FAModalProps) {  return (
    <>      {/* 2FA Confirmation Dialog */}
      {/* Regenerate Recovery Codes Confirmation Dialog */}
      <Dialog open={showRegenerateConfirm} onOpenChange={setShowRegenerateConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.profileSettings.regenerateCodesTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.profileSettings.regenerateCodesDescription')}
              <div className="mt-4">
                <Label htmlFor="regenerate-2fa-code">{t('admin.profileSettings.QrCode.6code')}</Label>
                <Input
                  id="regenerate-2fa-code"
                  className="border border-gray-600 text-lg w-40 mt-1"
                  maxLength={6}
                  value={Code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="000000"
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRegenerateConfirm(false)} disabled={loading}>
              {t('admin.profileSettings.cancel')}
            </Button>
            <Button onClick={() => handleRegenerateRecoveryCodes(Code)} disabled={loading || Code.length !== 6}>
              {loading ? t('admin.profileSettings.processing') : t('admin.profileSettings.confirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2FA Confirmation Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {is2FAEnabled ?  t('admin.profileSettings.disable2FATitle') : t('admin.profileSettings.enable2FATitle')}
            </DialogTitle>
            <DialogDescription>
              {is2FAEnabled ? (
                <>
                  <p>{t('admin.profileSettings.disable2FADescription')}</p>
                  <div className="mt-4">
                    <Label htmlFor="2fa-code">{t('admin.profileSettings.QrCode.6code')}</Label>
                    <Input
                      id="2fa-code"
                      className="border border-gray-600 text-lg w-40 mt-1"
                      maxLength={6}
                      value={Code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="000000"
                    />
                  </div>
                </>
              ) : (
                t('admin.profileSettings.enable2FADescription')
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShow2FADialog(false)} disabled={loading}>
              {t('admin.profileSettings.cancel')}
            </Button>
            <Button onClick={onConfirm2FA} disabled={loading || (is2FAEnabled && Code.length !== 6)}>
              {loading ? t('admin.profileSettings.processing') : is2FAEnabled ? t('admin.profileSettings.disable') : t('admin.profileSettings.enable')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>      {/* Recovery Codes Dialog - Hiển thị sau khi kích hoạt 2FA thành công */}
      <Dialog open={showRecoveryCodesDialog} onOpenChange={setShowRecoveryCodesDialog}>
        <DialogContent className="max-w-lg bg-[#23272f] text-white rounded-xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold mb-1">
              {t('admin.profileSettings.QrCode.title')}
            </DialogTitle>
            <DialogDescription className="text-gray-300 mb-4">
              {t('admin.profileSettings.QrCode.description')}
            </DialogDescription>
          </div>
          
          <div className="px-8 pb-8">
            {/* Recovery codes display */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {recoveryCodes && recoveryCodes.length > 0 ? (
                  recoveryCodes.map((code, idx) => (
                    <div key={idx} className="bg-[#181a20] rounded px-3 py-2 font-mono text-base select-all text-center">
                      {code}
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4">
                    {t('admin.profileSettings.QrCode.nofound')}
                  </div>
                )}
              </div>
              
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-md p-3 text-sm text-blue-300 mb-4">
                <p>{t('admin.profileSettings.QrCode.email')}</p>
              </div>
              
              {/* Actions buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={copyAllRecoveryCodes}
                  className="bg-[#383c44] hover:bg-[#4c505a] text-white flex-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  {t('admin.profileSettings.QrCode.copy')}
                </Button>
                
                <Button
                  onClick={downloadRecoveryCodes}
                  className="bg-[#383c44] hover:bg-[#4c505a] text-white flex-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {t('admin.profileSettings.QrCode.download')}
                </Button>
              </div>
            </div>
            
            {/* Close button */}
            <Button
              onClick={() => setShowRecoveryCodesDialog(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('admin.profileSettings.QrCode.done')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>     
       {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-lg bg-[#23272f] text-white rounded-xl p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <DialogTitle className="text-2xl font-bold mb-1">{t('admin.profileSettings.QrCode.title2fa')}</DialogTitle>
            <DialogDescription className="text-gray-300 mb-4">
              {t('admin.profileSettings.QrCode.description2fa')}
            </DialogDescription>
          </div>
          <div className="px-8 pb-2">
            {/* Bước 1: Tải app */}
            <div className="flex items-center gap-4 mb-6">
              <Smartphone className="w-10 h-10 text-gray-400" />
              <div>
                <div className="font-semibold text-white">{t('admin.profileSettings.QrCode.downloadAuth')}</div>
                <div className="text-gray-300 text-sm">
                  {t('admin.profileSettings.QrCode.downloadSetup')} <Link href="https://authy.com/" target="_blank" className="underline text-blue-400">Authy</Link> {t('admin.profileSettings.QrCode.or')} <Link href="https://support.google.com/accounts/answer/1066447?hl=vi" target="_blank" className="underline text-blue-400">Google Authenticator</Link> {t('admin.profileSettings.QrCode.or2')}
                </div>
              </div>
            </div>
            {/* Bước 2: QR */}
            <div className="mb-6">
              <div className="font-semibold mb-2">{t('admin.profileSettings.QrCode.qr')}</div>              
              <div className="flex flex-col items-center">
                {qrCodeImage ? (
                  <img src={qrCodeImage} alt="QR Code" width={160} height={160} />
                ) : (
                  <QRCodeSVG value={secret || "placeholder"} size={160} />
                )}
              </div>
              <div className="text-gray-300 text-sm mt-2">
                {t('admin.profileSettings.QrCode.openQr')}
              </div>
            </div>
            {/* Bước 3: Secret code */}
            <div className="mb-6">
              <div className="font-semibold mb-2">{t('admin.profileSettings.QrCode.secret')}</div>
              <div className="bg-[#181a20] rounded-md px-4 py-3 font-mono text-lg tracking-widest text-blue-300 select-all break-all">
                {secret}
              </div>
            </div>
            
            {/* Nhập mã xác minh */}
            <div className="mb-2">
              <div className="font-semibold mb-2">{t('admin.profileSettings.QrCode.confirm')}</div>
              <div className="text-gray-300 text-sm mb-2">{t('admin.profileSettings.QrCode.6code')}</div>
              <div className="flex gap-2">
                <Input
                  className="bg-[#181a20] border border-gray-600 text-white font-mono text-lg w-40"
                  maxLength={6}
                  value={Code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="000000"
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  disabled={loading || Code.length !== 6}
                  onClick={onConfirmSetup}
                >
                  {loading ? t('admin.profileSettings.QrCode.authen') : t('admin.profileSettings.QrCode.2fa')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
