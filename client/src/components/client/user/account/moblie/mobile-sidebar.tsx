"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { sidebarItems } from "@/components/client/user/account/desktop/desktop-MockSidebar";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md rounded-t-2xl border-t border-gray-200">
      <div className="flex justify-around py-2">
        {sidebarItems
          .filter(
            (item) =>
              !item.target && // bỏ chính sách (target="_blank") khỏi nav
              item.href !== "/policy"
          )
          .map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center flex-1 py-1"
              >
                <span
                  className={`${
                    isActive ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "text-red-500 font-medium" : "text-gray-500"
                  }`}
                >
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
