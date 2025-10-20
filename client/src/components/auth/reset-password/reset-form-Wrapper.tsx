'use client'
import dynamic from "next/dynamic";

const ResetFormDynamic = dynamic(() => import("./reset-form").then(mod => mod.ResetForm), { ssr: false });

export default function ResetFormWrapper() {
  return <ResetFormDynamic />;
}