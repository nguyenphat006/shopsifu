"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShopInfoProps {
  shop: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastActive?: string;
    rating?: number;
    responseRate?: number;
    responseTime?: string;
    followers?: number;
    joinedDate?: string;
    productsCount?: number;
  };
  className?: string;
}

export default function ProductShopInfo({ shop, className }: ShopInfoProps) {
  // Kiểm tra xem hiện tại có đang ở chế độ mobile hay không
  const isMobile = useIsMobile();
  
  // Tạo dữ liệu tĩnh cho UI demo
  const defaultShop = {
    id: "cool-crew-12345",
    name: "Cool Crew",
    avatar: "/images/logo/coolcrew-logo.png", // Đường dẫn hình ảnh mặc định
    isOnline: true,
    lastActive: "1 giờ trước",
    rating: 3.7,
    responseRate: 100,
    responseTime: "trong vài giờ",
    followers: 5500,
    joinedDate: "9 tháng trước",
    productsCount: 86
  };
  
  // Kết hợp dữ liệu mặc định với dữ liệu từ props
  const demoShop = { ...defaultShop, ...shop };

  return (
    <div className={cn(
      "bg-white rounded-sm overflow-hidden", 
      isMobile ? "mt-2" : "border",
      className
    )}>
      <div className={cn(
        "flex items-center border-b",
        isMobile ? "p-3" : "p-5"
      )}>
        {/* Avatar shop */}
        <div className={cn(
          "relative rounded-full overflow-hidden",
          isMobile ? "w-10 h-10 mr-3" : "w-16 h-16 mr-4"
        )}>
          <Image 
            src={demoShop.avatar || "/images/placeholder.png"}
            alt={demoShop.name}
            width={isMobile ? 40 : 64}
            height={isMobile ? 40 : 64}
            className="object-cover"
          />
          {demoShop.isOnline && (
            <span className={cn(
              "absolute bottom-0 right-0 bg-green-500 rounded-full",
              isMobile ? "w-2 h-2 border" : "w-3 h-3 border-2 border-white"
            )}></span>
          )}
        </div>

        {/* Shop name and status */}
        <div className="flex-1">
          <h3 className={cn(
            "font-medium",
            isMobile ? "text-sm" : "text-lg"
          )}>{demoShop.name}</h3>
          <p className={cn(
            "text-muted-foreground",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {demoShop.isOnline ? "Online" : `${demoShop.lastActive}`} • {demoShop.joinedDate}
          </p>
        </div>

        {/* Action buttons */}
        {isMobile ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 h-8 px-2 text-xs"
            asChild
          >
            <Link href={`/shop/${demoShop.id}`}>
              <Store className="w-3 h-3 mr-1" />
              Xem Shop
            </Link>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
              asChild
            >
              <Link href={`/chat/${demoShop.id}`}>
                <MessageSquare className="w-4 h-4 mr-1" />
                Chat Ngay
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              asChild
            >
              <Link href={`/shop/${demoShop.id}`}>
                <Store className="w-4 h-4 mr-1" />
                Xem Shop
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Shop metrics */}
      <div className={cn(
        "grid grid-cols-4 text-center",
        isMobile ? "py-2.5 text-xs" : "border-y py-4"
      )}>
        <div className={cn(
          "border-r",
          isMobile ? "px-2" : "px-4"
        )}>
          <div className={cn(
            "text-red-500 font-medium",
            isMobile ? "" : "text-lg"
          )}>{isMobile ? demoShop.rating : `${demoShop.rating}k`}</div>
          <div className={cn(
            "text-muted-foreground",
            isMobile ? "text-[10px]" : "text-sm"
          )}>Đánh Giá</div>
        </div>
        
        <div className={cn(
          "border-r",
          isMobile ? "px-2" : "px-4"
        )}>
          <div className={cn(
            "font-medium",
            isMobile ? "" : "text-lg"
          )}>{demoShop.productsCount}</div>
          <div className={cn(
            "text-muted-foreground",
            isMobile ? "text-[10px]" : "text-sm"
          )}>{isMobile ? "Sản Phẩm" : "Sản Phẩm"}</div>
        </div>
        
        <div className={cn(
          "border-r",
          isMobile ? "px-2" : "px-4"
        )}>
          <div className={cn(
            "font-medium",
            isMobile ? "text-[10px] leading-tight" : "text-lg"
          )}>trong vài giờ</div>
          <div className={cn(
            "text-muted-foreground",
            isMobile ? "text-[10px]" : "text-sm"
          )}>{isMobile ? "T.Gian P.Hồi" : "Thời Gian Phản Hồi"}</div>
        </div>
        
        <div className={cn(
          isMobile ? "px-2" : "px-4"
        )}>
          <div className={cn(
            "font-medium",
            isMobile ? "" : "text-lg"
          )}>{demoShop.responseRate}%</div>
          <div className={cn(
            "text-muted-foreground",
            isMobile ? "text-[10px]" : "text-sm"
          )}>{isMobile ? "Tỉ Lệ P.Hồi" : "Tỉ Lệ Phản Hồi"}</div>
        </div>
      </div>

      {/* Shop details */}
      <div className={cn(
        isMobile ? "flex justify-between text-xs px-3 py-2 border-t" : "grid grid-cols-2 text-sm px-5 py-3"
      )}>
        <div className={cn(
          "flex items-center",
          isMobile ? "gap-1" : "gap-2"
        )}>
          <span className={cn(
            "text-muted-foreground",
            isMobile ? "text-[10px]" : ""
          )}>Tham Gia:</span>
          <span className={cn(
            "font-medium",
            isMobile ? "text-[10px]" : ""
          )}>{demoShop.joinedDate}</span>
        </div>
        
        <div className={cn(
          "flex items-center",
          isMobile ? "gap-1" : "gap-2 justify-end"
        )}>
          <span className={cn(
            "text-muted-foreground",
            isMobile ? "text-[10px]" : ""
          )}>Người Theo Dõi:</span>
          <span className={cn(
            "font-medium text-red-500",
            isMobile ? "text-[10px]" : ""
          )}>{demoShop.followers.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
