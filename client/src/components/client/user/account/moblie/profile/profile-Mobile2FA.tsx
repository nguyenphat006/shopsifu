"use client";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, X } from "lucide-react";
import Link from "next/link";

interface TwoFactorAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEnabled: boolean;
  show2FADialog: boolean;
  setShow2FADialog: (open: boolean) => void;
  showQRDialog: boolean;
  setShowQRDialog: (open: boolean) => void;
  showRecoveryCodesDialog: boolean;
  setShowRecoveryCodesDialog: (open: boolean) => void;
  is2FAEnabled: boolean;
  loading: boolean;
  qrCodeImage: string;
  secret: string;
  recoveryCodes: string[];
  Code: string;
  setCode: (code: string) => void;
  onConfirm2FA: () => void;
  onConfirmSetup: () => void;
  copyAllRecoveryCodes: () => void;
  downloadRecoveryCodes: () => void;
  t: (key: string) => string;
  showRegenerateConfirm: boolean;
  setShowRegenerateConfirm: (open: boolean) => void;
  handleRegenerateRecoveryCodes: (code: string) => void;
}

export function TwoFactorAuthModal({
  open,
  onOpenChange,
  isEnabled,
  show2FADialog,
  setShow2FADialog,
  showQRDialog,
  setShowQRDialog,
  showRecoveryCodesDialog,
  setShowRecoveryCodesDialog,
  is2FAEnabled,
  loading,
  qrCodeImage,
  secret,
  recoveryCodes,
  Code,
  setCode,
  onConfirm2FA,
  onConfirmSetup,
  copyAllRecoveryCodes,
  downloadRecoveryCodes,
  t,
  showRegenerateConfirm,
  setShowRegenerateConfirm,
  handleRegenerateRecoveryCodes,
}: TwoFactorAuthModalProps) {
  // Regenerate Recovery Codes Drawer
  if (showRegenerateConfirm) {
    return (
      <Drawer open={showRegenerateConfirm} onOpenChange={setShowRegenerateConfirm}>
        <DrawerContent>
          <div className="h-[100vh] mx-auto w-full max-w-sm">
            <DrawerHeader className="relative">
              <DrawerTitle className="text-xl font-semibold">
                {t("admin.profileSettings.regenerateCodesTitle")}
              </DrawerTitle>
              <button
                onClick={() => setShowRegenerateConfirm(false)}
                className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="text-gray-600 mt-2">
                {t("admin.profileSettings.regenerateCodesDescription")}
              </div>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <Label htmlFor="regenerate-2fa-code" className="block mb-1">
                {t("admin.profileSettings.QrCode.6code")}
              </Label>
              <Input
                id="regenerate-2fa-code"
                className="border-gray-300 font-mono text-lg w-full mb-4"
                maxLength={6}
                value={Code}
                onChange={e => setCode(e.target.value)}
                placeholder="000000"
              />
              <Button
                onClick={() => handleRegenerateRecoveryCodes(Code)}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading || Code.length !== 6}
              >
                {loading
                  ? t("admin.profileSettings.processing")
                  : t("admin.profileSettings.confirm")}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Main 2FA Drawer
  if (show2FADialog) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="h-[100vh] mx-auto w-full max-w-sm">
            <DrawerHeader className="relative">
              <DrawerTitle className="text-xl font-semibold">
                {is2FAEnabled
                  ? t("admin.profileSettings.disable2FATitle")
                  : t("admin.profileSettings.enable2FATitle")}
              </DrawerTitle>
              <button
                onClick={() => {
                  setShow2FADialog(false);
                  onOpenChange(false);
                }}
                className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <div className="text-gray-600 mb-4">
                {is2FAEnabled
                  ? t("admin.profileSettings.disable2FADescription")
                  : t("admin.profileSettings.enable2FADescription")}
              </div>
              {is2FAEnabled && (
                <div className="mb-4">
                  <Label htmlFor="2fa-code" className="block mb-1">
                    {t("admin.profileSettings.QrCode.6code")}
                  </Label>
                  <Input
                    id="2fa-code"
                    className="border-gray-300 font-mono text-lg w-full"
                    maxLength={6}
                    value={Code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="000000"
                  />
                </div>
              )}
              <Button
                onClick={onConfirm2FA}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading || (is2FAEnabled && Code.length !== 6)}
              >
                {loading
                  ? t("admin.profileSettings.processing")
                  : is2FAEnabled
                  ? t("admin.profileSettings.disable")
                  : t("admin.profileSettings.enable")}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // QR Code Drawer
  if (showQRDialog) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="h-[100vh] mx-auto w-full max-w-sm">
            <DrawerHeader className="relative">
              <DrawerTitle className="text-xl font-semibold">
                {t("admin.profileSettings.QrCode.title2fa")}
              </DrawerTitle>
              <button
                onClick={() => setShowQRDialog(false)}
                className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <p className="text-sm text-gray-600 mt-2">
                {t("admin.profileSettings.QrCode.description2fa")}
              </p>
            </DrawerHeader>
            <div className="p-4 space-y-6">
              {/* Step 1: Download App */}
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="font-semibold text-sm">
                    {t("admin.profileSettings.QrCode.downloadAuth")}
                  </div>
                  <div className="text-gray-600 text-xs">
                    <Link
                      href="https://authy.com/"
                      target="_blank"
                      className="text-red-600 hover:underline"
                    >
                      Authy
                    </Link>{" "}
                    {t("admin.profileSettings.QrCode.or")}{" "}
                    <Link
                      href="https://support.google.com/accounts/answer/1066447"
                      target="_blank"
                      className="text-red-600 hover:underline"
                    >
                      Google Authenticator
                    </Link>
                  </div>
                </div>
              </div>
              {/* Step 2: QR Code */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t("admin.profileSettings.QrCode.qr")}
                </Label>
                <div className="flex justify-center my-2">
                  {qrCodeImage ? (
                    <img
                      src={qrCodeImage}
                      alt="QR Code"
                      width={160}
                      height={160}
                    />
                  ) : (
                    <QRCodeSVG value={secret || "placeholder"} size={160} />
                  )}
                </div>
              </div>
              {/* Step 3: Secret Key */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t("admin.profileSettings.QrCode.secret")}
                </Label>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 font-mono text-sm break-all mt-1">
                  {secret}
                </div>
              </div>
              {/* Verification Code */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  {t("admin.profileSettings.QrCode.confirm")}
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    className="border-gray-300 font-mono"
                    maxLength={6}
                    value={Code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="000000"
                  />
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={loading || Code.length !== 6}
                    onClick={onConfirmSetup}
                  >
                    {loading
                      ? t("admin.profileSettings.QrCode.authen")
                      : t("admin.profileSettings.QrCode.2fa")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Recovery Codes Drawer
  if (showRecoveryCodesDialog) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="h-[100vh] mx-auto w-full max-w-sm">
            <DrawerHeader className="relative">
              <DrawerTitle className="text-xl font-semibold">
                {t("admin.profileSettings.QrCode.title")}
              </DrawerTitle>
              <button
                onClick={() => setShowRecoveryCodesDialog(false)}
                className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <p className="text-sm text-gray-600 mt-2">
                {t("admin.profileSettings.QrCode.description")}
              </p>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {recoveryCodes?.map((code, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded px-3 py-2 font-mono text-sm text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-600">
                <p>{t("admin.profileSettings.QrCode.email")}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={copyAllRecoveryCodes}
                >
                  {t("admin.profileSettings.QrCode.copy")}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={downloadRecoveryCodes}
                >
                  {t("admin.profileSettings.QrCode.download")}
                </Button>
              </div>
            </div>
            <DrawerFooter className="border-t">
              <Button
                className="w-full bg-red-600 text-white"
                onClick={() => setShowRecoveryCodesDialog(false)}
              >
                {t("admin.profileSettings.QrCode.done")}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // fallback (should not render)
  return null;
}