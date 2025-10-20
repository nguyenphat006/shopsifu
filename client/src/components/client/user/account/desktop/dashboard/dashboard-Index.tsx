"use client";

import { useResponsive } from "@/hooks/useResponsive";
import DashboardOrders from "./dashboard-Orders";

import { useUserData } from "@/hooks/useGetData-UserLogin";
import ProfileHeader from "../../profile/profile-Header";

export default function DashboardIndex() {
  const { isMobile } = useResponsive();
  const userData = useUserData();

  return (
    <div className="bg-[#f5f5f7] h-full space-y-4">
      {isMobile && (
        <ProfileHeader
          name={userData?.name ?? ""}
          email={userData?.email ?? ""}
          phone={userData?.phoneNumber ?? ""}
          // birthday={userData?.dob ?? ""}
          avatar={userData?.avatar ?? ""}
          totalOrders={userData?.statistics?.totalOrders ?? 0}
          totalSpent={userData?.statistics?.totalSpent ?? 0}
          memberSince={userData?.statistics?.memberSince ?? ""}
        />
      )}
      <DashboardOrders />
    </div>
  );
}
