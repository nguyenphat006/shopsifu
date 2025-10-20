"use client";

import { useResponsive } from "@/hooks/useResponsive";
import { Sidebar } from "@/components/client/user/layout/user-Sidebar";
import { UserMobileHeaderProvider } from "@/providers/UserMobileHeaderContext";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import ProfileHeader from "@/components/client/user/account/profile/profile-Header";
import MobileBottomNav from "@/components/client/user/account/moblie/mobile-sidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile } = useResponsive();
  const userData = useUserData();

  return (
    <UserMobileHeaderProvider>
      <ClientLayoutWrapper hideCommit hideHero hideFooter maxWidth={1400}>
        <div className="!w-full !max-w-none !px-0 !mx-0 ">
          {isMobile ? (
            <div className=" pt-2">
              <main className="px-2 h-[calc(100vh-72px)] overflow-y-auto pb-[72px]">
                <div className="max-w-4xl mx-auto w-full">
                  {/* Profile Header mobile */}
                  {/* <ProfileHeader
                    name={userData?.name || ""}
                    email={userData?.email || ""}
                    phone={userData?.phoneNumber || ""}
                    // birthday={userData?.dob || ""}
                    avatar={userData?.avatar || ""}
                    totalOrders={userData?.statistics?.totalOrders || 0}
                    totalSpent={userData?.statistics?.totalSpent || 0}
                    memberSince={userData?.statistics.memberSince}
                  /> */}
                  {children}
                </div>
              </main>
              <MobileBottomNav/>
            </div>
          ) : (
            <div className="flex flex-col min-h-[90vh] text-foreground">
              {/* ✅ Profile header full width */}
              <div className="px-6 pt-6">
                <div className="w-full lg:max-w-[1280px] xl:max-w-[1440px] mx-auto rounded-xl">
                  <ProfileHeader
                    name={userData?.name || ""}
                    email={userData?.email || ""}
                    phone={userData?.phoneNumber || ""}
                    // birthday={userData?.dob || ""}
                    avatar={userData?.avatar || ""}
                    totalOrders={userData?.statistics?.totalOrders || 0}
                    totalSpent={userData?.statistics?.totalSpent || 0}
                    memberSince={userData?.statistics.memberSince}
                  />
                </div>
              </div>

              {/* Sidebar + children */}
              <div className="flex flex-1 gap-3 px-6 pb-6">
                <aside className="w-[320px] min-w-[280px] pt-4">
                  <Sidebar />
                </aside>
                <main className="flex-1 overflow-hidden pt-4">
                  <div className="w-full lg:max-w-[1280px] xl:max-w-[1440px] mx-auto space-y-6">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          )}
        </div>
      </ClientLayoutWrapper>
    </UserMobileHeaderProvider>
  );
}
