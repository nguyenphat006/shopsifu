"use client";

import { PulseLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <PulseLoader color="#FF0000" />
    </div>
  );
}