'use client';

import { useBrand } from '../useBrand';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

export default function SearchBrand() {
  const { data: brands, loading } = useBrand();

  // Hàm tạo brand item hoặc skeleton item
  const renderBrandItem = (brand: any, i: number) => {
    // Nếu đang loading, hiển thị skeleton
    if (loading) {
      return (
        <div key={`skeleton-${i}`} className="h-[113px] w-full bg-gray-100 animate-pulse" />
      );
    }

    // Xác định brand từ dữ liệu thật
    const typedBrand = brand as {
      id: string;
      name: string;
      logo?: string;
      brandTranslations?: { name: string }[];
    };

    const name = typedBrand.brandTranslations?.[0]?.name || typedBrand.name;

    return (
      <TooltipProvider key={typedBrand.id || i}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-[113px] w-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 bg-white p-2">
              {typedBrand.logo ? (
                <div className="w-full h-full relative">
                  <Image
                    src={typedBrand.logo}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-600 font-medium text-center">{name}</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Chuẩn bị dữ liệu
  const allItems = loading
    ? Array.from({ length: 12 }).map((_, i) => i) // Tạo mảng chỉ số từ 0-11 cho skeleton
    : brands.slice(0, 12);

  return (
    <div className="mb-6 bg-white p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-800 text-lg font-semibold">THƯƠNG HIỆU NỔI BẬT</h2>
        <Link href="/brands" className="text-sm text-primary hover:underline whitespace-nowrap flex items-center gap-1">
          Xem tất cả
          <span className="text-xs">&#8250;</span>
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 6 // Scroll qua 6 item mỗi lần
        }}
        className="w-full"
      >
        <CarouselContent>
          {/* Một CarouselItem duy nhất chứa cả 12 brands được chia thành 2 dòng */}
          <CarouselItem className="basis-full p-0">
            {/* Container với border tổng thể */}
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* Row 1: 6 items đầu tiên */}
              <div className="grid grid-cols-6">
                {allItems.slice(0, 6).map((item, i) => (
                  <div 
                    key={`row1-${i}`} 
                    className={`
                      ${i < 5 ? 'border-r border-gray-200' : ''} 
                      border-b border-gray-200
                    `}
                  >
                    {renderBrandItem(item, i)}
                  </div>
                ))}
              </div>
              
              {/* Row 2: 6 items tiếp theo */}
              <div className="grid grid-cols-6">
                {allItems.slice(6, 12).map((item, i) => (
                  <div 
                    key={`row2-${i}`}
                    className={`
                      ${i < 5 ? 'border-r border-gray-200' : ''}
                    `}
                  >
                    {renderBrandItem(item, i + 6)}
                  </div>
                ))}
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </div>
      </Carousel>
    </div>
  );
}