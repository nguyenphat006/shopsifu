// 'use client'

// import { useTranslations } from 'next-intl'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Switch } from '@/components/ui/switch'
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Settings, User, Shield, Mail, Phone, MapPin } from 'lucide-react'
// import { Separator } from '@/components/ui/separator'
// import { QRCodeSVG } from 'qrcode.react'
// import { useProfileSettings } from './useProfileSettings'

// export function ProfileSetting() {
//   const t  = useTranslations()
//   const {
//     open,
//     setOpen,
//     is2FAEnabled,
//     formData,
//     show2FADialog,
//     setShow2FADialog,
//     showQRDialog,
//     setShowQRDialog,
//     qrUri,
//     loading,
//     handleInputChange,
//     handle2FAToggle,
//     handleConfirm2FA,
//     handleSubmit,
//     totpCode,
//     setTotpCode,
//     handleConfirmSetup
//   } = useProfileSettings()

//   return (
//     <>
//       <Drawer open={open} onOpenChange={setOpen}>
//         <DrawerTrigger asChild>
//           <Button variant="ghost" size="icon" className="p-2 rounded-full hover:bg-gray-100 bg-[#fff]">
//             <Settings className="h-5 w-5 text-gray-600" />
//           </Button>
//         </DrawerTrigger>
//         <DrawerContent>
//           <div className="mx-auto w-full max-w-2xl">
//             <DrawerHeader>
//               <DrawerTitle className="text-xl font-semibold">
//                 {t('admin.profileSettings.title')}
//               </DrawerTitle>
//               <DrawerDescription>
//                 {t('admin.profileSettings.description')}
//               </DrawerDescription>
//             </DrawerHeader>

//             <form onSubmit={handleSubmit} className="p-6">
//               {/* Personal Information Section */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <User className="h-5 w-5 text-gray-600" />
//                   <h3 className="text-lg font-medium">
//                     {t('admin.profileSettings.personalInfo')}
//                   </h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="fullName">{t('admin.profileSettings.fullName')}</Label>
//                     <Input
//                       id="fullName"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleInputChange}
//                       placeholder={t('admin.profileSettings.fullNamePlaceholder')}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">{t('admin.profileSettings.email')}</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder={t('admin.profileSettings.emailPlaceholder')}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <Separator className="my-6" />

//               {/* Contact Information Section */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Phone className="h-5 w-5 text-gray-600" />
//                   <h3 className="text-lg font-medium">
//                     {t('admin.profileSettings.contactInfo')}
//                   </h3>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">{t('admin.profileSettings.phone')}</Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       placeholder={t('admin.profileSettings.phonePlaceholder')}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="address">{t('admin.profileSettings.address')}</Label>
//                     <Input
//                       id="address"
//                       name="address"
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       placeholder={t('admin.profileSettings.addressPlaceholder')}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <Separator className="my-6" />

//               {/* Security Section */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Shield className="h-5 w-5 text-gray-600" />
//                   <h3 className="text-lg font-medium">
//                     {t('admin.profileSettings.security')}
//                   </h3>
//                 </div>
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="space-y-1">
//                     <Label htmlFor="2fa" className="text-base">
//                       {t('admin.profileSettings.twoFactorAuth')}
//                     </Label>
//                     <p className="text-sm text-gray-500">
//                       {t('admin.profileSettings.twoFactorAuthDescription')}
//                     </p>
//                   </div>
//                   <Switch
//                     id="2fa"
//                     checked={is2FAEnabled}
//                     onCheckedChange={handle2FAToggle}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </form>

//             <DrawerFooter className="border-t">
//               <div className="flex justify-end gap-2">
//                 <DrawerClose asChild>
//                   <Button variant="outline">
//                     {t('admin.profileSettings.cancel')}
//                   </Button>
//                 </DrawerClose>
//                 <Button onClick={handleSubmit}>
//                   {t('admin.profileSettings.save')}
//                 </Button>
//               </div>
//             </DrawerFooter>
//           </div>
//         </DrawerContent>
//       </Drawer>

//       {/* 2FA Confirmation Dialog */}
//       <AlertDialog open={show2FADialog} onOpenChange={setShow2FADialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               {is2FAEnabled 
//                 ? t('admin.profileSettings.disable2FATitle')
//                 : t('admin.profileSettings.enable2FATitle')}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {is2FAEnabled
//                 ? t('admin.profileSettings.disable2FADescription')
//                 : t('admin.profileSettings.enable2FADescription')}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={loading}>
//               {t('admin.profileSettings.cancel')}
//             </AlertDialogCancel>
//             <AlertDialogAction onClick={handleConfirm2FA} disabled={loading}>
//               {loading 
//                 ? t('admin.profileSettings.processing')
//                 : is2FAEnabled 
//                   ? t('admin.profileSettings.disable')
//                   : t('admin.profileSettings.enable')}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* QR Code Dialog */}
//       <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{t('admin.profileSettings.scanQRCode')}</DialogTitle>
//             <DialogDescription>
//               {t('admin.profileSettings.scanQRDescription')}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="flex flex-col items-center space-y-4 py-4">
//             <div className="p-4 bg-white rounded-lg">
//               <QRCodeSVG value={qrUri} size={200} />
//             </div>
//             <p className="text-sm text-gray-500 text-center">
//               {t('admin.profileSettings.qrInstructions')}
//             </p>
            
//             {/* TOTP Input Section */}
//             <div className="w-full space-y-4 mt-4">
//               <div className="space-y-2">
//                 <Label htmlFor="totp">{t('admin.profileSettings.enterTOTP')}</Label>
//                 <Input
//                   id="totp"
//                   value={totpCode}
//                   onChange={(e) => setTotpCode(e.target.value)}
//                   placeholder={t('admin.profileSettings.totpPlaceholder')}
//                   maxLength={6}
//                 />
//               </div>
//               <Button 
//                 onClick={handleConfirmSetup}
//                 disabled={loading || totpCode.length !== 6}
//                 className="w-full"
//               >
//                 {loading 
//                   ? t('admin.profileSettings.verifying')
//                   : t('admin.profileSettings.activate2FA')}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }
