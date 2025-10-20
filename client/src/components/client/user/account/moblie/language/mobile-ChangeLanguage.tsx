"use client";

import { useChangeLang } from "@/hooks/useChangeLang";
import { useTranslations } from "next-intl";
import AccountLayout from "@/app/(client)/user/layout";
import { Check, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
];

export default function MobileChangeLanguage() {
  const  t  = useTranslations();
  const { changeLanguage, currentSelectedLang } = useChangeLang();
  const router = useRouter();

  const handleChange = (lang: "vi" | "en") => {
    changeLanguage(lang);
    setTimeout(() => {
      router.push("/user");
    }, 100);
  };

  return (
    <AccountLayout>
      <div className="bg-white divide-y divide-gray-100">
        {LANGUAGES.map((lang) => {
          const isSelected = currentSelectedLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code as "vi" | "en")}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-5 text-lg font-semibold",
                isSelected ? "bg-white text-black" : "bg-white text-gray-800"
              )}
            >
              <span className="text-lg font-semibold">{lang.label}</span>
              {isSelected && <Check className="w-6 h-6 text-black" />}
            </button>
          );
        })}
      </div>
      {/* Floating home icon */}
      <div className="fixed bottom-6 right-4 z-50">
        <Link
          href="/"
          className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
        >
          <Home className="w-5 h-5 text-black" />
        </Link>
      </div>
    </AccountLayout>
  );
}
