"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  Eye,
  EyeOff,
  Receipt,
  Crown,
  Star,
} from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  avatar?: string;
  totalOrders?: number;
  totalSpent?: number;
  memberSince?: string;
  createdAt?: string;
}

export default function ProfileHeader({
  name,
  email,
  phone,
  birthday,
  avatar,
  createdAt,
  totalOrders = 0,
  totalSpent = 0,
  memberSince,
}: ProfileHeaderProps) {
  const [showPhone, setShowPhone] = useState(false);

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 7) return phone;
    return phone.slice(0, 3) + "*".repeat(5) + phone.slice(-2);
  };

  const formattedMemberSince = memberSince
    ? new Date(memberSince).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const getUserLevel = (totalSpent: number) => {
    if (totalSpent >= 10000000)
      return {
        level: "VIP Diamond",
        color: "from-purple-500 to-pink-500",
        icon: Crown,
      };
    if (totalSpent >= 5000000)
      return {
        level: "VIP Gold",
        color: "from-yellow-500 to-orange-500",
        icon: Star,
      };
    if (totalSpent >= 2000000)
      return {
        level: "VIP Silver",
        color: "from-gray-400 to-gray-600",
        icon: Star,
      };
    return {
      level: "Thành viên",
      color: "from-blue-500 to-cyan-500",
      icon: User,
    };
  };

  const userLevel = getUserLevel(totalSpent);
  const LevelIcon = userLevel.icon;

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col lg:flex-row min-h-[200px] overflow-hidden items-center border border-gray-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#D70018] to-[#FF6B35] rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#D70018]/20 to-[#FF6B35]/20 rounded-full translate-x-20 translate-y-20"></div>
      </div>

      {/* Avatar + Info Section */}
      <div className="flex flex-1 items-center gap-6 p-6 sm:p-8 w-full relative z-10">
        {/* Avatar with Status Ring */}
        {/* Avatar with Status Ring */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#D70018] to-[#FF6B35] flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg border-4 border-white">
              {name?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          {/* User Level Badge – Căn giữa tuyệt đối */}
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                px-3 py-1 rounded-full text-xs font-bold text-white
                bg-gradient-to-r ${userLevel.color}
                shadow-lg flex items-center gap-1 whitespace-nowrap z-10`}
          >
            <LevelIcon className="w-3 h-3 shrink-0" />
            <span>{userLevel.level}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-[#D70018]/10 transition-colors">
              <User className="w-4 h-4 text-[#D70018]" />
            </div>
            <div>
              <h2 className="font-bold text-lg sm:text-xl text-gray-800 flex items-center gap-2">
                {name}
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">
                    Đã xác minh
                  </span>
                </div>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                <Mail className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm text-gray-600 truncate">{email}</span>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                <Phone className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm text-gray-600">
                {showPhone ? phone : maskPhone(phone)}
              </span>
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="ml-1 p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                {showPhone ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {birthday && (
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">{birthday}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Elegant Separator */}
      <div className="hidden lg:block relative">
        <div className="h-32 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-300 rounded-full"></div>
      </div>

      {/* Statistics Section */}
      <div className="flex flex-col lg:flex-row flex-1 w-full">
        {/* Total Orders */}
        <div className="flex flex-1 items-center gap-4 p-6 sm:p-8 w-full border-t lg:border-t-0 border-gray-100 group hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent transition-all duration-300">
          <div className="relative">
            <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-red-100 to-white flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {totalOrders > 99 ? "99+" : totalOrders}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-gray-800 leading-none mb-1">
              {totalOrders.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              Tổng đơn hàng
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Đã mua thành công
            </span>
          </div>
        </div>

        {/* Mini Separator */}
        <div className="hidden lg:block relative">
          <div className="h-24 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
        </div>

        {/* Total Spent */}
        <div className="flex flex-1 items-center gap-4 p-6 sm:p-8 w-full border-t lg:border-t-0 border-gray-100 group hover:bg-gradient-to-br hover:from-emerald-50 hover:to-transparent transition-all duration-300">
          <div className="relative">
            <div className="w-12 h-12 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-red-100 to-white flex items-center justify-center">
              <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            </div>
            {totalSpent >= 1000000 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#D70018] to-[#FF6B35] bg-clip-text text-transparent leading-none mb-1">
              {totalSpent.toLocaleString()}đ
            </span>
            <span className="text-sm text-gray-500 font-medium">
              Tổng tích lũy
            </span>
            {createdAt && (
              <span className="text-xs text-gray-400 mt-1">Từ {createdAt}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
