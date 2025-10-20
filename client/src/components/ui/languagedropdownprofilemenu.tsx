"use client";
import { Globe, ChevronDown } from "lucide-react";
import { useChangeLang } from "@/hooks/useChangeLang";
import {  useTranslations } from "next-intl";

const LanguageDropdown = () => {
  const { showLangMenu, toggleMenu, changeLanguage, currentLangName } = useChangeLang();
  const  t  = useTranslations();

  return (
    <div className="relative w-full">
      <button
        onClick={toggleMenu}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-600" />
          <span>{currentLangName}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {showLangMenu && (
        <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => changeLanguage("vi")}
          >
            <span className="text-base">🇻🇳</span>
            <span>{t('language.vi')}</span>
          </button>

          <div className="border-t border-gray-200" />

          <button
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => changeLanguage("en")}
          >
            <span className="text-base">🇺🇸</span>
            <span>{t('language.en')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
