'use client'
import dynamic from "next/dynamic";

const PasswordSecurityDynamic = dynamic(() => import("./passwordSecurity-Table").then(mod => mod.PasswordSecurityTable), { ssr: false });
const PasswordSecuritySessionDynamic = dynamic(() => import("./passwordSecurity-Session").then(mod => mod.PasswordSecuritySession), { ssr: false });

export function PasswordSecurityWrapper() {
  return <PasswordSecurityDynamic />;
}

export function PasswordSecuritySessionWrapper() {
  return <PasswordSecuritySessionDynamic />;
}
