"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarItems } from "./desktop-MockSidebar";
import { useTranslations } from "next-intl";
import { LogOut, ChevronRight } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const { handleLogout, loading: logoutLoading } = useLogout();

  return (
    <aside className="bg-gradient-to-br from-white via-gray-50/30 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full md:w-[320px] h-full flex flex-col border border-gray-100 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/5 to-transparent rounded-full translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-600/5 to-transparent rounded-full -translate-x-12 translate-y-12"></div>
      </div>

      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-100/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Tài khoản</h3>
            <p className="text-sm text-gray-500">Quản lý thông tin cá nhân</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col py-2 flex-grow relative z-10">
        {sidebarItems.map((item, index) => {
          const isActive = pathname === item.href;
          const isPolicy = item.labelKey === "user.account.profile.policy";

          return (
            <div key={item.href} className="px-3 mb-1">
              <Link
                href={item.href}
                {...(isPolicy && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                <div
                  className={cn(
                    "relative flex items-center justify-between px-4 py-4 text-base font-medium transition-all duration-200 group rounded-xl",
                    isActive
                      ? "bg-gradient-to-r from-red-500/10 via-red-600/5 to-transparent text-red-600 shadow-sm border border-red-500/20"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-red-500/5 hover:via-red-600/3 hover:to-transparent hover:text-red-600 hover:shadow-sm"
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-r-full shadow-sm"></div>
                  )}

                  <div className="flex items-center flex-1">
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-red-500/80 group-hover:to-red-600/80 group-hover:text-white group-hover:shadow-md group-hover:scale-105"
                      )}
                    >
                      <div className="text-lg">{item.icon}</div>
                    </div>
                    <span
                      className={cn(
                        "font-semibold transition-all duration-200",
                        isActive 
                          ? "text-red-600" 
                          : "text-gray-700 group-hover:text-red-600"
                      )}
                    >
                      {t(item.labelKey)}
                    </span>
                  </div>

                  {/* Arrow Indicator */}
                  <ChevronRight 
                    className={cn(
                      "w-5 h-5 transition-all duration-200",
                      isActive
                        ? "text-red-600 translate-x-1"
                        : "text-gray-400 group-hover:text-red-600 group-hover:translate-x-1"
                    )}
                  />

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="px-3 pb-6 mt-4 border-t border-gray-100/80 pt-4 relative z-10">
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutLoading}
          className={cn(
            "relative flex items-center justify-between w-full px-4 py-4 h-auto text-base font-medium transition-all duration-200 group rounded-xl",
            "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:via-red-25 hover:to-transparent hover:text-red-600 hover:shadow-sm",
            logoutLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl mr-4 bg-gray-100 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-red-600 group-hover:text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
              {logoutLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <LogOut className="w-5 h-5" strokeWidth={2} />
              )}
            </div>
            <span className="font-semibold transition-colors duration-200 group-hover:text-red-600">
              {logoutLoading ? "Đang đăng xuất..." : t("auth.common.logout")}
            </span>
          </div>

          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-200" />

          {/* Hover Glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-50 to-red-25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
        </Button>
      </div>
    </aside>
  );
} 