'use client';
import dynamic from "next/dynamic";

const FlashSaleSectionDynamic = dynamic(() => import("../flashsale-Section").then(mod => mod.FlashSaleSection), { ssr: false });

export default function FlashSaleSectionWrapper() {
  return <FlashSaleSectionDynamic />;
}
