'use client';
import dynamic from "next/dynamic";

const HeaderDynamic = dynamic(() => import("./header-Main").then(mod => mod.Header), { ssr: false });

export default function HeaderWrapper() {
  return <HeaderDynamic />; 
}