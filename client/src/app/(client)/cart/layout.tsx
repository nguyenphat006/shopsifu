"use client";

import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import { useResponsive } from "@/hooks/useResponsive";

interface CartLayoutProps {
  children: React.ReactNode;
}

export default function CartLayout({ children}: CartLayoutProps) {
  const { isMobile } = useResponsive();

  return (
    <ClientLayoutWrapper
      hideHeader={isMobile}
      hideCommit
      hideHero
      hideFooter={isMobile}
      // topContent={topContent}
    >
      <div className={`w-full ${isMobile ? "min-h-screen flex flex-col" : "min-h-screen"}`}>
        <main className={`flex-1 ${isMobile ? "" : "pb-4"}`}>
          <div className="w-full">{children}</div>
        </main>
      </div>
    </ClientLayoutWrapper>
  );
}
