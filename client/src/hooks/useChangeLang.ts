"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { setLanguage, toggleLanguage } from "@/store/features/lang/langSlice";

export const useChangeLang = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const currentLanguage = useSelector((state: RootState) => state.langShopsifu.language);
  const currentLangName = currentLanguage === "vi" ? "Tiếng Việt" : "English";

  const toggleMenu = () => setShowLangMenu(prev => !prev);

  const handleChangeLanguage = (lang: "vi" | "en") => {
    dispatch(setLanguage(lang));
    router.refresh();
    setShowLangMenu(false);
  };

  const handleToggleLanguage = () => {
    const newLang = currentLanguage === "vi" ? "en" : "vi";
    dispatch(toggleLanguage());
    router.refresh();
    setShowLangMenu(false);
  };

  return {
    showLangMenu,
    toggleMenu,
    changeLanguage: handleChangeLanguage,
    toggleLanguage: handleToggleLanguage,
    currentLangName,
    currentSelectedLang: currentLanguage,
  };
};

export default useChangeLang;