// "use client";

// import { useEffect, useState } from "react";
// import { useTranslations } from "next-intl";
// import { Button } from "@/components/ui/button";
// import { ChangePasswordModal } from "./profile-DesktopPasswordUpdate";
// import { ProfileUpdateSheet } from "./profile-DesktopUpdate";
// import { TwoFactorAuthModal } from "./profile-Desktop2FA";
// import { DeleteAccountModal } from "./profile-DesktopDeleteAccount";
// import AccountLayout from "@/app/(client)/user/layout";
// import { useUserData } from "@/hooks/useGetData-UserLogin";
// import { usePasswordSecurity } from "../../profile/useProfile-2FA";
// import { useUserMobileHeader } from "@/context/UserMobileHeaderContext";
// import { useResponsive } from "@/hooks/useResponsive";

// export default function ProfileDesktopIndex() {
//   const [profileSheetOpen, setProfileSheetOpen] = useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const user = useUserData();
//   const t = useTranslations();
//   const { isMobile } = useResponsive();
//   const { setTitle } = useUserMobileHeader();

//   useEffect(() => {
//     if (isMobile) {
//       setTitle(t("user.settings.items.Account security"));
//     }
//   }, [isMobile, setTitle, t]);

//   const {
//     is2FAEnabled,
//     show2FADialog,
//     setShow2FADialog,
//     showQRDialog,
//     setShowQRDialog,
//     showRecoveryCodesDialog,
//     setShowRecoveryCodesDialog,
//     qrCodeImage,
//     secret,
//     loading,
//     Code,
//     setCode,
//     recoveryCodes,
//     handleConfirm2FA,
//     handleConfirmSetup,
//     handleRegenerateRecoveryCodes,
//     showRegenerateConfirm,
//     setShowRegenerateConfirm,
//     copyAllRecoveryCodes,
//     downloadRecoveryCodes,
//   } = usePasswordSecurity({ isEnabled: user?.twoFactorEnabled ?? false });

//   const firstName = user?.firstName || "";
//   const lastName = user?.lastName || "";
//   const name = user?.name || "Khách";
//   const phoneNumber = user?.phoneNumber || t("user.account.profile.noPhone");
//   const avatar = user?.avatar || "";
//   const avatarText = name[0]?.toUpperCase() || "U";
//   const isGuest = !user?.id;

//   const handleDeleteAccount = () => {
//     console.log("Account deleted");
//     setIsDeleteModalOpen(false);
//   };

//   return (
//       <div className="py-8 space-y-6">
//         {/* User Info */}
//         <div className="border-b pb-4 px-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-start space-x-4">
//               <div className="flex-shrink-0">
//                 {avatar ? (
//                   <img
//                     src={avatar}
//                     alt="Profile"
//                     className="h-24 w-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
//                   />
//                 ) : (
//                   <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-100 shadow-sm">
//                     <span className="text-3xl font-semibold text-gray-600">
//                       {avatarText}
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <div className="flex-1 ml-6">
//                 <p className="text-sm font-semibold text-green-700">
//                   {t("user.account.profile.protected")}
//                 </p>
//                 <div className="mt-1 text-sm text-gray-700 space-y-1">
//                   {(firstName || lastName) && (
//                     <p>{[firstName, lastName].filter(Boolean).join(" ")}</p>
//                   )}
//                   <p>@{name}</p>
//                   <p>{phoneNumber}</p>
//                 </div>
//               </div>
//             </div>
//             <Button
//               type="button"
//               onClick={() => setProfileSheetOpen(true)}
//               className="bg-red-600 text-white rounded-full px-4 py-2 w-24 h-10 ml-4"
//               disabled={isGuest}
//             >
//               {t("user.account.profile.edit")}
//             </Button>
//           </div>
//         </div>

//         {/* Password */}
//         <div className="border-b pb-4 px-4">
//           <div className="flex items-center justify-between">
//             <p className="font-medium text-gray-900">
//               {t("user.account.profile.password")}
//             </p>
//             <Button
//               type="button"
//               onClick={() => setIsPasswordModalOpen(true)}
//               className="bg-red-600 text-white rounded-full px-4 py-2 w-24 h-10"
//               disabled={isGuest}
//             >
//               {t("user.account.profile.edit")}
//             </Button>
//           </div>
//         </div>

//         {/* 2FA */}
//         <div className="border-b pb-4 px-4">
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <p className="font-medium text-gray-900">
//                 {t("user.account.profile.twoFactor")}:{" "}
//                 <span className="font-normal">
//                   {t(
//                     `user.account.profile.${
//                       user?.twoFactorEnabled ? "on" : "off"
//                     }`
//                   )}
//                 </span>
//               </p>
//               <p className="text-sm text-gray-600">
//                 {t("user.account.profile.twoFactorDescription")}
//               </p>
//             </div>
//             <Button
//               type="button"
//               onClick={() => {
//                 setIs2FAModalOpen(true);
//                 setShow2FADialog(true);
//               }}
//               className="bg-red-600 text-white rounded-full px-4 py-2 w-24 h-10"
//               disabled={isGuest}
//             >
//               {t(
//                 `user.account.profile.${
//                   user?.twoFactorEnabled ? "turnOff" : "turnOn"
//                 }`
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* 3rd Party */}
//         <div className="px-4">
//           <p className="font-medium text-gray-900">
//             {t("user.account.profile.thirdPartyAccounts")}
//           </p>
//           {[{ provider: "Google", status: "Linked" }].map(
//             ({ provider, status }) => (
//               <div
//                 key={provider}
//                 className="flex items-center justify-between py-2"
//               >
//                 <div className="flex-1 flex items-center space-x-2">
//                   {provider === "Google" && (
//                     <img
//                       src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
//                       alt="Google G logo"
//                       className="h-5 w-5"
//                     />
//                   )}
//                   <p className="text-sm text-gray-800">{provider}</p>
//                 </div>
//                 <span className="text-red-600 font-medium w-24 h-10 flex items-center justify-center">
//                   {status}
//                 </span>
//               </div>
//             )
//           )}
//         </div>

//         {/* Delete Account */}
//         <div className="border-t pt-6 px-4 flex items-center justify-between">
//           <p className="text-sm text-gray-700 font-medium">
//             {t("user.account.profile.accountTermination")}
//           </p>
//           <button
//             onClick={() => setIsDeleteModalOpen(true)}
//             className="text-red-600 text-sm font-medium hover:underline"
//             disabled={isGuest}
//           >
//             {t("user.account.profile.deleteAccount")}
//           </button>
//         </div>

//         {/* Modals */}
//         <ProfileUpdateSheet
//           open={profileSheetOpen}
//           onOpenChange={setProfileSheetOpen}
//           initialData={{
//             name,
//             phoneNumber,
//             avatar,
//           }}
//         />

//         <ChangePasswordModal
//           open={isPasswordModalOpen}
//           onOpenChange={setIsPasswordModalOpen}
//           firstName={firstName}
//           lastName={lastName}
//           name={name}
//         />

//         <TwoFactorAuthModal
//           open={is2FAModalOpen}
//           onOpenChange={setIs2FAModalOpen}
//           isEnabled={user?.twoFactorEnabled ?? false}
//           showRegenerateConfirm={showRegenerateConfirm}
//           setShowRegenerateConfirm={setShowRegenerateConfirm}
//           handleRegenerateRecoveryCodes={handleRegenerateRecoveryCodes}
//           show2FADialog={show2FADialog}
//           setShow2FADialog={setShow2FADialog}
//           showQRDialog={showQRDialog}
//           setShowQRDialog={setShowQRDialog}
//           showRecoveryCodesDialog={showRecoveryCodesDialog}
//           setShowRecoveryCodesDialog={setShowRecoveryCodesDialog}
//           is2FAEnabled={is2FAEnabled}
//           loading={loading}
//           qrCodeImage={qrCodeImage}
//           secret={secret}
//           recoveryCodes={recoveryCodes}
//           Code={Code}
//           setCode={setCode}
//           onConfirm2FA={handleConfirm2FA}
//           onConfirmSetup={handleConfirmSetup}
//           copyAllRecoveryCodes={copyAllRecoveryCodes}
//           downloadRecoveryCodes={downloadRecoveryCodes}
//           t={t}
//         />

//         <DeleteAccountModal
//           open={isDeleteModalOpen}
//           onOpenChange={setIsDeleteModalOpen}
//           onConfirm={handleDeleteAccount}
//         />
//       </div>
//   );
// }
