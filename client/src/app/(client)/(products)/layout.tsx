"use client";

import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import { useResponsive } from "@/hooks/useResponsive";

interface SearchLayoutProps {
  children: React.ReactNode;
}

export default function SearchLayout({ children}: SearchLayoutProps) {
  const { isMobile } = useResponsive();

  return (
    <ClientLayoutWrapper
      hideCommit
      hideHero
      hideFooter={isMobile}
      maxWidth={1450}
    >
      <div className={`w-full ${isMobile ? "min-h-screen flex flex-col" : "min-h-screen"}`}>
        <main className={`flex-1 ${isMobile ? "" : "pb-4"}`}>
          <div className="w-full">{children}</div>
        </main>
      </div>
    </ClientLayoutWrapper>
  );
}
