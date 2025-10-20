'use client';
import dynamic from "next/dynamic";

const HeroSectionDynamic = dynamic(() => import("../hero-Section").then(mod => mod.HeroSection), { ssr: false });

export default function HeroSectionWrapper() {
  return <HeroSectionDynamic />;
}