"use client";

import { useEffect } from "react";

export default function ChunkErrorHandler() {
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      if (e.message?.includes("ChunkLoadError")) {
        window.location.reload();
      }
    };

    window.addEventListener("error", handler);
    return () => {
      window.removeEventListener("error", handler);
    };
  }, []);

  return null;
}
