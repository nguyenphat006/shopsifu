'use client';
import dynamic from "next/dynamic";

const SuggestSectionDynamic = dynamic(() => import("../suggest-Section").then(mod => mod.default), { ssr: false });

export default function SuggestSectionWrapper() {
  return <SuggestSectionDynamic />;
}
