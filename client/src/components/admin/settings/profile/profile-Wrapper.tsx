'use client'
import dynamic from "next/dynamic";

const ProfileDynamic = dynamic(() => import("./profile-Table").then(mod => mod.ProfileSettingsTable), { ssr: false });

export default function ProfileWrapper() {
  return <ProfileDynamic />;
}