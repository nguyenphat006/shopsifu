"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useSidebarConfig,
  useSettingsSidebarConfig,
  SidebarItem,
} from "@/constants/sidebarConfig";
import {
  ChevronDown,
  X,
  Undo,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";
import { Button } from "@/components/ui/button";
import { ProfileDropdownSidebar } from "./ProfileDropdown-Sidebar";
import { useTranslations } from "next-intl";

interface SidebarProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({
  isOpen: externalOpen,
  onOpenChange,
  onCollapse,
}: SidebarProps) {
  const sidebarConfig = useSidebarConfig();
  const settingsSidebarConfig = useSettingsSidebarConfig();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [internalOpen, setInternalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMobile } = useResponsive();
  const t = useTranslations("");

  const open = externalOpen ?? internalOpen;
  const setOpen = (value: boolean) => {
    setInternalOpen(value);
    onOpenChange?.(value);
  };

  const toggleItem = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      onCollapse?.(newState);
      return newState;
    });
  };

  const isActive = (href: string, item: SidebarItem) => {
    if (pathname === href) return true;
    if (item.subItems) {
      return item.subItems.some(
        (subItem) =>
          pathname === subItem.href || pathname.startsWith(subItem.href + "/")
      );
    }
    if (href === "/admin/product" && pathname.startsWith("/admin/products"))
      return true;
    if (href === "/admin/orders" && pathname.startsWith("/admin/orders"))
      return true;
    if (href === "/admin/system" && pathname.startsWith("/admin/role"))
      return true;
    if (href === "/admin/order" && pathname.startsWith("/admin/order"))
      return true;
    return false;
  };

  const isSettingsPage = pathname.startsWith("/admin/settings");

  const currentSidebarConfig = useMemo(() => {
    return isSettingsPage ? settingsSidebarConfig : sidebarConfig;
  }, [isSettingsPage, settingsSidebarConfig, sidebarConfig]);

  useEffect(() => {
    // Auto expand tất cả items có subItems khi component mount
    const allWithSub = currentSidebarConfig
      .filter((item) => item.subItems && item.subItems.length > 0)
      .map((item) => item.href);
    
    // Chỉ set nếu expandedItems khác với allWithSub để tránh infinite loop
    setExpandedItems(prev => {
      const newItems = allWithSub.filter(item => !prev.includes(item));
      if (newItems.length > 0) {
        return [...prev, ...newItems];
      }
      return prev;
    });
  }, [isSettingsPage]); // Chỉ dependency vào isSettingsPage thay vì currentSidebarConfig

  const renderSettingsSidebar = () => (
    <div>
      {settingsSidebarConfig.map((item, idx) => {
        if (item.isTitle) {
          return (
            <div key={item.href} className="mb-2">
              <Link
                href={item.href}
                className="flex items-center gap-2 py-2 px-4 rounded-lg transition-colors duration-150 text-black hover:bg-gray-100 font-semibold text-sm"
              >
                {item.icon && (
                  <span className="mr-1 text-black">{item.icon}</span>
                )}
                <span>{item.title}</span>
              </Link>
            </div>
          );
        }

        const hasSub = item.subItems && item.subItems.length > 0;

        return (
          <div key={item.href} className="mb-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-black tracking-wide mb-1 mt-2">
                {item.title}
              </div>
            </div>
            {hasSub && (
              <div className="flex flex-col gap-2">
                {item.subItems!.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-normal text-black hover:text-primary transition-colors duration-200",
                      pathname === sub.href &&
                        "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            )}
            {!hasSub && (
              <Link
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium block text-black hover:text-primary transition-colors duration-200",
                  pathname === item.href &&
                    "bg-primary/10 text-primary font-medium"
                )}
              >
                {item.title}
              </Link>
            )}
            {idx < settingsSidebarConfig.length - 1 && (
              <div className="border-t border-dotted border-gray-200 my-3" />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.href);
    const isItemActive = isActive(item.href, item);

    return (
      <div key={item.href} className={cn(level > 0 && "pt-1")}>
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2 rounded-md",
            "transition-colors duration-200 cursor-pointer",
            level === 0 && "hover:bg-primary/10",
            level > 0 && "hover:text-primary",
            isItemActive && level === 0 && "bg-primary/10 text-primary",
            level > 0 && "pl-10"
          )}
          onClick={() => (hasSubItems ? toggleItem(item.href) : undefined)}
        >
          {hasSubItems ? (
            <div className="flex items-center gap-3 flex-1">
              {level === 0 &&
              item.icon &&
              React.isValidElement(item.icon) &&
              item.icon.type
                ? React.createElement(item.icon.type, {
                    className: cn(
                      "w-5 h-5", // Quay lại size cũ
                      isItemActive ? "text-primary" : "text-black"
                    ),
                  })
                : null}
              <span
                className={cn(
                  "text-sm font-semibold text-black", // Quay lại size và font cũ
                  level > 0 && "text-black font-normal hover:text-primary",
                  isItemActive && "text-primary"
                )}
              >
                {item.title}
              </span>
            </div>
          ) : (
            <Link href={item.href} className="flex items-center gap-3 flex-1">
              {level === 0 &&
              item.icon &&
              React.isValidElement(item.icon) &&
              item.icon.type
                ? React.createElement(item.icon.type, {
                    className: cn(
                      "w-5 h-5", // Quay lại size cũ
                      isItemActive ? "text-primary" : "text-black"
                    ),
                  })
                : null}
              <span
                className={cn(
                  "text-sm font-semibold text-black", // Quay lại size và font cũ
                  level > 0 && "text-black font-normal hover:text-primary",
                  isItemActive && "text-primary"
                )}
              >
                {item.title}
              </span>
            </Link>
          )}

          {/* Hiện lại chevron icon để người dùng có thể toggle */}
          {hasSubItems && (
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200 text-muted-foreground",
                isExpanded && "rotate-180"
              )}
            />
          )}
        </div>

        {/* Chỉ hiển thị subItems khi isExpanded = true */}
        {hasSubItems && isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.subItems?.map((subItem) => renderItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-white border-r h-[calc(100vh-4rem)] fixed top-16 flex flex-col transition-all duration-300 z-50",
          {
            "inset-y-0 left-0 z-50 h-screen transition-transform duration-300":
              isMobile,
            "-translate-x-full": isMobile && !open,
            "w-64": !isCollapsed && !isMobile,
            "w-0": isCollapsed && !isMobile,
          }
        )}
      >
        {isMobile && (
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className="flex items-center">
              <Image
                src="/images/logo/png-jpeg/Logo-Full-Red.png"
                alt="Shopsifu Logo"
                width={116}
                height={66}
                className="mr-2"
              />
            </Link>
            <Button
              onClick={() => setOpen(false)}
              className="text-gray-500 bg-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
        <div
          className={cn(
            "h-full overflow-y-auto flex-1",
            isMobile && "h-[calc(100vh-4rem)]",
            isCollapsed && !isMobile && "hidden"
          )}
        >
          <nav className="p-4 space-y-2">
            {isSettingsPage
              ? renderSettingsSidebar()
              : currentSidebarConfig
                  .filter((item) => item.title !== "Cài đặt")
                  .map((item) => renderItem(item))}
          </nav>
        </div>
        {!isSettingsPage && !isCollapsed && (
          <div className="px-4 py-2">
            <Link
              href="/admin/settings/profile"
              className="flex items-center gap-2 py-2 px-4 rounded-lg transition-colors duration-150 text-black hover:bg-primary/10 hover:text-primary font-semibold text-sm"
            >
              <Settings className="w-5 h-5 text-black" />
              <span>{t("admin.sidebar.settings.settings")}</span>
            </Link>
          </div>
        )}
        {!isCollapsed && (
          <div className="p-4 border-t">
            <ProfileDropdownSidebar />
          </div>
        )}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </aside>
    </>
  );
}
