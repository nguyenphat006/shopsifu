// "use client";

// import { useCheckDevice } from "@/hooks/useCheckDevices";
// import dynamic from "next/dynamic";
// import { Skeleton } from "@/components/ui/skeleton";

// const ProfilePage = dynamic(() => import("../desktop/profile/profile-Index"), {
//   loading: () => <Skeleton className="w-full h-full" />,
//   ssr: false,
// });
// const ProfileMobile = dynamic(() => import("../moblie/profile/profile-MobileIndex"), {
//   loading: () => <Skeleton className="w-full h-full" />,
//   ssr: false,
// });

// export function ProfileMain() {
//   const deviceType = useCheckDevice();
//   const isMobileView = deviceType === "mobile";

//   return (
//     <div className="w-full h-full">
//       {isMobileView ? <ProfileMobile /> : <ProfilePage />}
//     </div>
//   );
// }

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = dynamic(() => import("../desktop/profile/profile-Index"), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false,
});

export function ProfileMain() {
  return (
    <div className="w-full h-full">
      <ProfilePage />
    </div>
  );
}
