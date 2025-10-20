'use client'
import dynamic from "next/dynamic";

const LanguagesDynamic = dynamic(() => import("./languages-Table").then(mod => mod.LanguagesTable), { ssr: false });

export default function LanguagesWrapper() {
  return <LanguagesDynamic />;
}