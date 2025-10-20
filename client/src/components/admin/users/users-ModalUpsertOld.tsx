// 'use client'

// import { useEffect, useState } from 'react'
// import { useTranslations } from 'next-intl'
// import { z, ZodError } from 'zod'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu"
// import { ChevronDown } from 'lucide-react'
// import { User, UserCreateRequest } from "@/types/admin/user.interface";
// import { Role } from "@/types/auth/role.interface";
// import { Textarea } from '@/components/ui/textarea'
// import { userStepOneSchema, userStepTwoSchema } from '@/utils/schema'

// interface UsersModalUpsertProps {
//   roles: Role[];
//   open: boolean;
//   onClose: () => void;
//   mode: 'add' | 'edit';
//   user: User | null; 
//   onSubmit: (data: User | UserCreateRequest) => Promise<void>; 
// }

// export default function UsersModalUpsert({
//   roles, open, onClose, mode, user, onSubmit
// }: UsersModalUpsertProps) {
//   const t = useTranslations('')
//   // Form state
//   const [step, setStep] = useState(1);
//   const [firstName, setFirstName] = useState("")
//   const [lastName, setLastName] = useState("")
//   const [username, setUsername] = useState("")
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [phoneNumber, setPhoneNumber] = useState("")
//   const [bio, setBio] = useState("")
//   const [avatar, setAvatar] = useState<File | null>(null)
//   const [countryCode, setCountryCode] = useState("")
//   const [roleId, setRoleId] = useState(1) 
//   const [status, setStatus] = useState("ACTIVE")
//   const [loading, setLoading] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})

//   // These should ideally come from an API or a shared constant
//   const STATUS_OPTIONS = [
//     { value: 'ACTIVE', label: t('Hoạt động') },
//     { value: 'INACTIVE', label: t('Không hoạt động') },
//   ]

//   useEffect(() => {
//     setStep(1); 
//     if (mode === 'edit' && user) {
//       setFirstName(user.userProfile?.firstName || "")
//       setLastName(user.userProfile?.lastName || "")
//       setUsername(user.userProfile?.username || '')
//       setEmail(user.email || "")
//       setPhoneNumber(user.userProfile?.phoneNumber || "")
//       setBio(user.userProfile?.bio || "")
//       setCountryCode(user.userProfile?.countryCode || "")
//       setRoleId(user.roleId || 1)
//       setStatus(user.status || "ACTIVE")
//       setPassword("")
//       setConfirmPassword("")
//       setAvatar(null)
//     } else if (mode === 'add') {
//       setFirstName("")
//       setLastName("")
//       setUsername("");
//       setEmail("");
//       setPassword("")
//       setConfirmPassword("")
//       setPhoneNumber("")
//       setBio("")
//       setCountryCode("")
//       setAvatar(null)
//       setRoleId(1);
//       setStatus("ACTIVE");
//       setErrors({})
//     }
//   }, [mode, user, open])

//   const handleNextStep = () => {
//     const dataToValidate = {
//       firstName,
//       lastName,
//       username,
//       email,
//       phoneNumber,
//       roleId,
//     };

//     try {
//       userStepOneSchema(t).parse(dataToValidate);
//       setErrors({});
//       setStep(2);
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const formattedErrors: Record<string, string> = {};
//         error.errors.forEach((err) => {
//           if (err.path[0]) {
//             formattedErrors[err.path[0]] = err.message;
//           }
//         });
//         setErrors(formattedErrors);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (mode === 'add') {
//       const passwordData = { password, confirmPassword };
//       try {
//         userStepTwoSchema(t).parse(passwordData);
//         setErrors({});
//       } catch (error) {
//         if (error instanceof ZodError) {
//           const formattedErrors: Record<string, string> = {};
//           error.errors.forEach((err) => {
//             if (err.path[0]) {
//               formattedErrors[err.path[0]] = err.message;
//             }
//           });
//           setErrors(formattedErrors);
//         }
//         return; 
//       }
//     }

//     setLoading(true);
//     try {
//       if (mode === 'add') {
//         const data: UserCreateRequest = {
//           email,
//           password,
//           confirmPassword,
//           roleId,
//           firstName,
//           lastName,
//           username,
//           phoneNumber,
//           bio,
//           avatar: '', 
//           countryCode,
//         };
//         await onSubmit(data);
//       } else if (mode === 'edit' && user) {
//         const data: User = {
//           ...user,
//           email,
//           status,
//           roleId,
//           userProfile: {
//             ...user.userProfile!,
//             firstName,
//             lastName,
//             username,
//             phoneNumber,
//             bio,
//             countryCode,
//           },
//         };
//         await onSubmit(data);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderStepOne = () => (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">{t('admin.users.modal.firstName')}</label>
//           <Input value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder={t('admin.users.modal.firstName')} />
//           {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">{t('admin.users.modal.lastName')}</label>
//           <Input value={lastName} onChange={e => setLastName(e.target.value)} required placeholder={t('admin.users.modal.lastName')} />
//           {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">{t('Tên người dùng')}</label>
//           <Input value={username} onChange={e => setUsername(e.target.value)} required placeholder={t('Tên người dùng')} />
//           {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">{t('admin.users.modal.email')}</label>
//           <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={t('admin.users.modal.email')} disabled={mode === 'edit'} />
//           {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">{t('admin.users.modal.phoneNumber')}</label>
//           <Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder={t('admin.users.modal.phoneNumber')} />
//           {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">{t('admin.users.modal.countryCode')}</label>
//           <Input value={countryCode} onChange={e => setCountryCode(e.target.value)} placeholder={t('admin.users.modal.countryCode')} />
//         </div>
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium mb-1">{t('admin.users.modal.role')}</label>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="w-full flex justify-between items-center">
//                 {roles.find(role => role.id === roleId)?.name || t('admin.users.modal.role')}
//                 <ChevronDown size={16} />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-full min-w-[120px]">
//               {roles.map((role) => (
//                 <DropdownMenuItem
//                   key={role.id}
//                   onClick={() => {
//                     if (typeof role.id === 'number') {
//                       setRoleId(role.id);
//                     }
//                   }}
//                 >
//                   {role.name}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           {errors.roleId && <p className="text-sm text-red-500 mt-1">{errors.roleId}</p>}
//         </div>
//         {mode === 'edit' && (
//           <div>
//             <label className="block text-sm font-medium mb-1">{t('admin.users.modal.status')}</label>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="w-full flex justify-between items-center">
//                   {STATUS_OPTIONS.find(opt => opt.value === status)?.label || t('admin.users.modal.status')}
//                   <ChevronDown size={16} />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-full min-w-[120px]">
//                 {STATUS_OPTIONS.map(opt => (
//                   <DropdownMenuItem key={opt.value} onClick={() => setStatus(opt.value)}>
//                     {opt.label}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         )}
//       </div>
//       <div>
//         <label className="block text-sm font-medium mb-1">{t('admin.users.modal.bio')}</label>
//         <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={t('admin.users.modal.bio')} />
//       </div>
//       <div>
//         <label className="block text-sm font-medium mb-1">{t('admin.users.modal.avatar')}</label>
//         <Input type="file" onChange={e => setAvatar(e.target.files ? e.target.files[0] : null)} accept="image/*" />
//       </div>
//     </>
//   );

//   const renderStepTwo = () => (
//     <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">{t('admin.users.modal.password')}</label>
//           <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder={t('admin.users.modal.password')} />
//           {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">{t('admin.users.modal.confirmPassword')}</label>
//           <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder={t('admin.users.modal.confirmPassword')} />
//           {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
//         </div>
//     </div>
//   );

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl">
//         <DialogHeader>
//           <DialogTitle>
//             {mode === 'add' ? `${t('admin.users.modal.addTitle')} - ${t('Bước')} ${step}/2` : t('admin.users.modal.editTitle')}
//           </DialogTitle>
//           <DialogDescription>
//             {mode === 'add' 
//               ? (step === 1 ? t('admin.users.modal.addDescription') : t('admin.users.modal.passwordStepDescription'))
//               : t('admin.users.modal.editDescription')
//             }
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {mode === 'edit' && renderStepOne()}
//           {mode === 'add' && step === 1 && renderStepOne()}
//           {mode === 'add' && step === 2 && renderStepTwo()}

//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="outline" disabled={loading} onClick={onClose}>
//                 {t('admin.users.modal.cancel')}
//               </Button>
//             </DialogClose>
            
//             {mode === 'add' && step === 1 && (
//               <Button type="button" onClick={handleNextStep}>{t('Tiếp theo')}</Button>
//             )}

//             {mode === 'add' && step === 2 && (
//               <>
//                 <Button type="button" variant="outline" onClick={() => setStep(1)}>{t('Quay lại')}</Button>
//                 <Button type="submit" disabled={loading}>
//                   {loading ? t('admin.users.modal.loadingAdd') : t('admin.users.modal.confirmAdd')}
//                 </Button>
//               </>
//             )}

//             {mode === 'edit' && (
//               <Button type="submit" disabled={loading}>
//                 {loading ? t('admin.users.modal.loadingEdit') : t('admin.users.modal.confirmEdit')}
//               </Button>
//             )}
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

