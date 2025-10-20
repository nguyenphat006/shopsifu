"use client";
import { Globe, ChevronDown } from "lucide-react";
import { useChangeLang } from "@/hooks/useChangeLang";
import { useTranslations } from "next-intl";

const LanguageDropdown = () => {
  const { showLangMenu, toggleMenu, changeLanguage, currentLangName } = useChangeLang();
  const t = useTranslations();

  return (
    <div className="relative flex items-center">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 text-black px-2 py-1 rounded hover:bg-gray-100 transition"
      >
        <Globe size={18} />
        <span>{currentLangName}</span>
        <ChevronDown size={16} />
      </button>

      {showLangMenu && (
        <div className="absolute top-full mt-2 w-32 bg-white shadow-md rounded border z-60">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => changeLanguage("vi")}
          >
            {t('language.vi')}
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => changeLanguage("en")}
          >
            {t('language.en')}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
