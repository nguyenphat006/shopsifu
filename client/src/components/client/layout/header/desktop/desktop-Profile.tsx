"use client";
import Link from "next/link";
import {
  User,
  LogOut,
  ShoppingCart,
  LucideIcon,
  LayoutDashboard,
} from "lucide-react";
import React, { useRef } from "react";
import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDropdown } from "../dropdown-context";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import Image from "next/image";
import { useGetProfile } from "@/hooks/useGetProfile";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  requireDivider?: boolean;
}

export function ProfileDropdown() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { handleLogout, loading: logoutLoading } = useLogout();
  const router = useRouter();
  const { openDropdown, setOpenDropdown } = useDropdown();
  const user = useUserData();
  const isOpen = openDropdown === "profile";
  const fetchProfile = useGetProfile(); // Hàm để fetch lại dữ liệu người dùng

  // Kiểm tra role từ user data
  const isAdmin = user?.role?.name === 'ADMIN' || user?.role?.name === 'Super Admin' || user?.role?.name === 'SELLER';

  const menuItems: MenuItemProps[] = [
    {
      icon: User,
      label: "Tài khoản của tôi",
      onClick: async () => {
        // Fetch profile data before navigation
        await fetchProfile.fetchProfile();
        router.push(ROUTES.CLIENT.USER.BASE);
      },
    },
    {
      icon: ShoppingCart,
      label: "Giỏ hàng của bạn",
      onClick: () => router.push('/cart'),
    },
    {
      icon: ShoppingCart,
      label: "Đơn hàng mua",
      onClick: () => router.push(ROUTES.CLIENT.USER.ORDERS),
      requireDivider: true,
    },
    {
      icon: LogOut,
      label: logoutLoading ? "Đang xử lý..." : "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  if (!user) {
    return (
      <span
        onClick={() => router.push(ROUTES.AUTH.SIGNIN)}
        className="cursor-pointer inline-flex items-center justify-center px-4 py-3 text-white font-semibold text-[13px]"
      >
        Đăng nhập
      </span>
    );
  }

  const name = user.name || '';
  const email = user.email || '';
  const avatar = user.avatar || '';

  // Tạo avatar từ chữ cái đầu tên nếu không có ảnh
  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const avatarText = getInitials(name);

  const AvatarComponent = () => {
    if (avatar) {
      return (
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="100%"
            className="object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = avatarText;
            }}
          />
        </div>
      );
    }
    return <span>{avatarText}</span>;
  };

  return (
    <div className="relative group profile-container" ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        className="cursor-pointer relative whitespace-nowrap inline-flex items-center gap-2 px-4 py-3 text-white font-semibold text-sm"
        onClick={() => setOpenDropdown(isOpen ? "none" : "profile")}
        onMouseEnter={() => setOpenDropdown("profile")}
      >
        {/* Backdrop blur effect */}
        <motion.div
          className="absolute inset-0 rounded-full backdrop-blur-sm"
          initial={{
            backgroundColor: "rgba(233, 233, 233, 0)",
            scaleX: 0.5,
            scaleY: 0.8,
          }}
          animate={{
            backgroundColor: isOpen
              ? "rgba(233, 233, 233, 0.4)"
              : "rgba(233, 233, 233, 0)",
            boxShadow: isOpen
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : "none",
            scaleX: isOpen ? 1 : 0.5,
            scaleY: isOpen ? 1 : 0.8,
          }}
          whileHover={{
            backgroundColor: "rgba(233, 233, 233, 0.4)",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            scaleX: [0.8, 1.1, 1],
            scaleY: [0.9, 1.05, 1],
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 12,
            backgroundColor: { duration: 0.15 },
            boxShadow: { duration: 0.15 },
            scaleX: { duration: 0.35, ease: "easeOut" },
            scaleY: { duration: 0.25, ease: "easeOut" },
          }}
        />

        {/* Content layer */}
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold flex-shrink-0 text-black z-10">
          <AvatarComponent />
        </div>
        <span className="text-[13px] z-10 relative">Hello, {name}</span>
      </div>

      {/* Invisible gap to prevent dropdown from closing when moving cursor to dropdown */}
      <div className="absolute h-2 w-full top-full"></div>

      {/* Dropdown Menu */}
      <motion.div
        className={cn(
          "absolute top-[calc(100%+3px)] right-0 w-72 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50",
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        )}
        onMouseEnter={() => setOpenDropdown("profile")}
        onMouseLeave={() => setOpenDropdown("none")}
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -10,
          transition: {
            duration: 0.2,
            ease: "easeOut",
          },
        }}
      >
        {/* Bubble arrow pointing to the title */}
        <div className="absolute right-4 top-[-7px] w-3 h-3 bg-white transform rotate-45 border-t-1 border-l-1 border-gray-200 z-1"></div>

        {/* Header with avatar and user info */}
        <div className="flex items-center justify-center pt-6 pb-4 w-full">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold mr-3 flex-shrink-0 text-gray-700">
            <AvatarComponent />
          </div>
          <div className="flex flex-col max-w-[175px]">
            <div className="font-medium text-[16px] text-gray-900 truncate">
              {name}
            </div>
            <div className="text-[11px] text-gray-500 truncate">{email}</div>
          </div>
        </div>
        {/* Divider */}
        <div className="h-px bg-gray-200 mx-6 my-1"></div>
        {/* Menu Items */}
        <div>
          {isAdmin && (
            <>
              <Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center px-5 py-2 hover:bg-gray-50 cursor-pointer text-[14px] text-gray-800">
                <LayoutDashboard className="w-4.5 h-4.5 mr-2 text-gray-800" />
                Trang quản trị
              </Link>
              <div className="h-px bg-gray-200 mx-6 my-1"></div>
            </>
          )}
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <div
                className="flex items-center px-5 py-2 hover:bg-gray-50 cursor-pointer text-[14px] text-gray-800"
                onClick={item.onClick}
              >
                <item.icon className="w-4.5 h-4.5 mr-2 text-gray-800" />
                {item.label}
              </div>
              {item.requireDivider && (
                <div className="h-px bg-gray-200 mx-6 my-1"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
