'use client';

import Link from 'next/link';
import { Facebook, Instagram, Bell, HelpCircle, ShoppingCart } from 'lucide-react';

export function TopBar() {

  return (
    <div className="bg-white">
  <div className="max-w-[1300px] mx-auto px-4">
    <div className="flex justify-between items-center h-12 text-xs text-black gap-16">

      {/* Left Column - Marquee Text (limited width) */}
      <div className="w-full max-w-[600px] overflow-hidden">
        <style jsx>{`
          .marquee {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 20s linear infinite;
            white-space: nowrap;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .marquee-container:hover .marquee {
            animation-play-state: paused;
          }
        `}</style>
        <div className="marquee-container">
          <span className="marquee text-[13px] font-medium text-gray-700">
            Chào mừng bạn đến với Shopsifu! Khám phá hàng ngàn sản phẩm chất lượng cao với giá ưu đãi. Mua sắm ngay hôm nay!
          </span>
        </div>
      </div>

      {/* Right Column - Links */}
      <div className="flex items-center space-x-6 shrink-0">
        <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 hover:underline transition-opacity text-[13px] font-medium">
          <Bell className="h-4 w-4" />
          <span>Thông báo</span>
        </Link>
        <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 hover:underline transition-opacity text-[13px] font-medium">
          <HelpCircle className="h-4 w-4" />
          <span>Hỗ trợ</span>
        </Link>
        <Link href="#" className="flex items-center gap-1.5 hover:opacity-70 hover:underline transition-opacity text-[13px] font-medium">
          <ShoppingCart className="h-4 w-4" />
          <span>Đăng ký bán hàng</span>
        </Link>
      </div>
    </div>
  </div>
</div>

  );
} 