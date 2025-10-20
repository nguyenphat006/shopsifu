"use client";

import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
import { useResponsive } from "@/hooks/useResponsive";
import { CheckoutProvider } from "@/providers/CheckoutContext";

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export default function CheckoutLayout({ children}: CheckoutLayoutProps) {
  const { isMobile } = useResponsive();

  return (
    <CheckoutProvider>
      <ClientLayoutWrapper
        hideCommit
        hideHero
        hideFooter
        topContent
        maxWidth={1650}
      >
        <div className={`w-full ${isMobile ? "min-h-screen flex flex-col" : "min-h-screen"}`}>
          <main className={`flex-1 ${isMobile ? "" : "pb-4"}`}>
            <div className="w-full">{children}</div>
          </main>
        </div>
      </ClientLayoutWrapper>
    </CheckoutProvider>
  );
}
