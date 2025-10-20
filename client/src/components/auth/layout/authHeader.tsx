"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import LanguageDropdown from "@/components/ui/languagedropdown"; // Đảm bảo đúng đường dẫn
import "@/i18n/i18n";
import { useTranslations } from "next-intl";

export function AuthHeader() {
  const t = useTranslations();

  return (
    <header className="w-full py-2 px-6 md:px-40 lg:px-90 flex items-center justify-between bg-white/80 backdrop-blur-sm fixed top-0 z-50 border-b">
      {/* Logo + Đăng nhập bên trái */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <a href="/" className="flex items-center">
          <Image
            src="/images/logo/png-jpeg/Logo-Full-Red.png"
            alt="Shopsifu Logo"
            width={200}
            height={200}
            className="h-10 w-auto"
            priority
          />
        </a>
        <h1 className="text-2xl font-small text-black whitespace-nowrap hidden md:inline">
          {/* {t("Đăng nhập")} */}
        </h1>
      </motion.div>

      {/* Hỗ trợ bên phải */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-6 text-sm text-primary cursor-pointer"
      >
        {/* {t("Bạn cần giúp đỡ?")} */}

        {/* Ngôn ngữ */}
        <LanguageDropdown />
      </motion.div>
    </header>
  );
}
