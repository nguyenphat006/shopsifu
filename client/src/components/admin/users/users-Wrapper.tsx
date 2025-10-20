'use client'
import dynamic from "next/dynamic";

const UsersDynamic = dynamic(() => import("./users-Table").then(mod => mod.default), { ssr: false });

export default function UsersWrapper() {
  return <UsersDynamic />;
}