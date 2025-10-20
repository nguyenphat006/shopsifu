'use client'
import dynamic from "next/dynamic";

const PermissionsDynamic = dynamic(() => import("./permissions-Table").then(mod => mod.PermissionsTable), { ssr: false });

export default function PermissionsWrapper() {
  return <PermissionsDynamic />;
}