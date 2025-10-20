'use client'
import dynamic from "next/dynamic";

const BrandsDynamic = dynamic(() => import("./brand-Table").then(mod => mod.BrandTable), { ssr: false });

export default function BrandsWrapper() {
  return <BrandsDynamic />;
}