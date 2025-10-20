import { CategoriesSection } from "@/components/client/landing-page/categories-Section";
import FlashSaleSectionWrapper from "@/components/client/landing-page/wrapper/flashsale-Wrapper";
import SuggestSectionWrapper from "@/components/client/landing-page/wrapper/suggest-Wrapper";
import ClientLayoutWrapper from "@/components/client/layout/ClientLayoutWrapper";
// import { useResponsive } from "@/hooks/useResponsive";

// const { isMobile } = useResponsive();

export default function HomePage() {
  return (
    <>
    <ClientLayoutWrapper
      maxWidth={1250}
    >
        <main className="flex flex-col min-h-screen">
          <FlashSaleSectionWrapper />
          <CategoriesSection />
          <SuggestSectionWrapper />
        </main>
    </ClientLayoutWrapper>
    </>
  );
}