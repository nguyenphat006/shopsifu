"use client";

import { ScrollLock } from "@/components/client/layout/ScrollLock";
import { Footer } from "@/components/client/layout/footer/footer"
import HeroSectionWrapper from "@/components/client/landing-page/wrapper/hero-Wrapper";
import HeaderWrapper from "@/components/client/layout/header/header-Wrapper";
import DesktopCommit from "@/components/client/layout/header/desktop/desktop-Commit";
import { useCheckDevice } from "@/hooks/useCheckDevices";
import { cn } from "@/lib/utils";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideCommit?: boolean;
  hideHero?: boolean;
  hideFooter?: boolean;
  topContent?: React.ReactNode;
  maxWidth?: string | number;
  className?: string;
}

export default function ClientLayoutWrapper({
  children,
  hideHeader = false,
  hideCommit = false,
  hideHero = false,
  hideFooter = false,
  topContent,
  maxWidth = "1250px",
  className,
}: ClientLayoutWrapperProps) {
  const deviceType = useCheckDevice();

  // Convert maxWidth to string with px if it's a number
  const maxWidthValue = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ScrollLock />

      {/* Header */}
      {!hideHeader && <HeaderWrapper />}

      {/* DesktopCommit: Chỉ hiện khi không bị ẩn và không phải mobile */}
      {!hideCommit && deviceType !== "mobile" && <DesktopCommit />}

      {/* Top content nếu có */}
      {topContent && <div className="w-full">{topContent}</div>}

      {/* Main content */}
      <main className="flex-grow bg-[#F5F5FA]">
        {!hideHero && <HeroSectionWrapper />}
        <div
          className={cn(
            "w-full mx-auto",
            deviceType !== "mobile" ? "px-4 sm:px-6" : "",
            className
          )}
          style={{ maxWidth: maxWidthValue }}
        >
          {children}
        </div>
      </main>

      {/* Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
}
