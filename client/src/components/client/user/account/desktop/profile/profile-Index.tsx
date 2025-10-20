"use client";

import { useResponsive } from "@/hooks/useResponsive";
import AddressBook from "./profile-Address";
import ProfileInfo from "./profile-Info";
import LinkedAccounts from "./profile-LinkAccounts";
import PasswordSection from "./profile-Password";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import ProfileHeader from "../../profile/profile-Header";

export default function ProfilePage() {
  const { isMobile } = useResponsive();
  const userData = useUserData();

  return (
    <div className="space-y-4 h-full">
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

      <ProfileInfo />
      <AddressBook />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordSection />
        <LinkedAccounts />
      </div>
    </div>
  );
}
