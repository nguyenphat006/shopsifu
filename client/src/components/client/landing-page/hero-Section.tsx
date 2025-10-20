'use client';

import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious, 
  type CarouselApi 
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useIsMobile } from '@/hooks/use-mobile';
import { heroImages, serviceItems } from './landing-Mockdata';

interface HeroSectionProps {
  className?: string;
}

// 1. Tách ServiceItem thành component riêng để tối ưu re-render
const ServiceItem = memo(({ item }: { item: typeof serviceItems[0] }) => (
  <a 
    href="#" 
    className="flex flex-col items-center text-center group flex-shrink-0 w-[72px] sm:w-auto"
  >
    <div className="flex items-center justify-center w-[52px] h-[52px] bg-white rounded-2xl transition-all duration-300 group-hover:-translate-y-1">
      <Image 
        src={item.icon} 
        alt={item.label} 
        width={46} 
        height={46}
        className="object-contain"
        loading="lazy" // Lazy load cho service icons
      />
    </div>
    <p className="text-xs sm:text-[13px] text-gray-800 leading-tight h-10 flex items-center justify-center">
      {item.label}
    </p>
  </a>
));

ServiceItem.displayName = 'ServiceItem';

// 2. Tách CarouselImage thành component riêng
const CarouselImage = memo(({ src, index, isMobile }: { 
  src: string; 
  index: number; 
  isMobile: boolean;
}) => (
  <CarouselItem 
    key={index} 
    className={cn("relative", isMobile ? "h-[220px]" : "h-[350px]")}
  >
    <Image
      src={src}
      alt={`Hero image ${index + 1}`}
      fill
      style={{ objectFit: 'cover' }}
      className="z-0"
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
      priority={index === 0} // Chỉ priority cho image đầu tiên
      loading={index === 0 ? "eager" : "lazy"} // Lazy load cho các image khác
    />
  </CarouselItem>
));

CarouselImage.displayName = 'CarouselImage';

function HeroSectionComponent({ className }: HeroSectionProps) {
  const isMobile = useIsMobile();
  
  // 3. Memoize plugin để tránh tạo lại mỗi render
  const plugin = useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: true }),
    []
  );

  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  // 4. Memoize carousel options
  const carouselOpts = useMemo(() => ({
    loop: true,
  }), []);

  // 5. Optimize useEffect dependencies
  useEffect(() => {
    if (!api) return;

    const updateSlideInfo = () => {
      setSlideCount(api.scrollSnapList().length);
      setCurrentSlide(api.selectedScrollSnap());
    };

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    updateSlideInfo();
    api.on("select", onSelect);
    api.on("reInit", updateSlideInfo);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", updateSlideInfo);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  // 6. Memoize style classes
  const containerClass = useMemo(() => cn(
    "relative rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_5px_rgba(0,0,0,0.1)] transition-shadow duration-300 ease-in-out",
    isMobile ? "h-[220px]" : "h-[350px]"
  ), [isMobile]);

  const rightColumnClass = useMemo(() => cn(
    "relative w-full rounded-2xl overflow-hidden border border-transparent hover:border-[#ccc] shadow transition-all duration-300 ease-in-out hover:shadow-[8px_8px_120px_rgba(1,0,0,0.2)]",
    isMobile ? "h-[200px]" : "h-[350px]"
  ), [isMobile]);

  // 7. Memoize dot indicators để tránh re-render
  const dotIndicators = useMemo(() => {
    if (slideCount === 0) return null;
    
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {Array.from({ length: slideCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              currentSlide === index ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  }, [slideCount, currentSlide, scrollTo]);

  // 8. Memoize carousel images
  const carouselImages = useMemo(() => 
    heroImages.map((src, index) => (
      <CarouselImage 
        key={src} // Sử dụng src làm key thay vì index
        src={src} 
        index={index} 
        isMobile={isMobile} 
      />
    )), 
    [isMobile]
  );

  // 9. Memoize service items
  const serviceItemsList = useMemo(() => 
    serviceItems.map((item) => (
      <ServiceItem key={item.label} item={item} />
    )), 
    []
  );

  return (
    <section className={cn("w-full bg-white py-6 shadow-sm", className)}>
      <div className="container mx-auto px-4 justify-start max-w-[1250px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - 8 cols */}
          <div className="lg:col-span-8">
            <div className={containerClass}>
              <Carousel
                plugins={[plugin]}
                opts={carouselOpts}
                setApi={setApi}
                className="w-full h-full"
              >
                <CarouselContent className="h-full">
                  {carouselImages}
                </CarouselContent>
                
                {/* Navigation Buttons */}
                {!isMobile && (
                  <>
                    <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 border-none disabled:bg-black/10 disabled:text-white/50 h-10 w-10" />
                    <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 border-none disabled:bg-black/10 disabled:text-white/50 h-10 w-10" />
                  </>
                )}
              </Carousel>
              
              {/* Dot Indicators */}
              {dotIndicators}

              {/* Overlay content */}
              {!isMobile && (
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 to-transparent z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Bộ sưu tập mới nhất
                  </h2>
                  <p className="text-white mb-4 max-w-lg">
                    Khám phá những xu hướng thời trang mới nhất cho mùa này
                  </p>
                  <Button className="w-fit">Khám phá ngay</Button>
                </div>
              )}
            </div>
          </div>

          {/* Right column - 4 cols */}
          {!isMobile && (
            <div className="lg:col-span-4">
              <div className={rightColumnClass}>
                <div className="absolute inset-0">
                  <Image
                    src="/images/demo/etsy.webp"
                    alt="Secondary image"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="z-0"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    loading="lazy" // Lazy load cho secondary image
                  />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Phong cách đặc biệt
                  </h2>
                  <p className="text-white mb-3">
                    Tìm kiếm phong cách riêng của bạn
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-fit bg-transparent border-white text-white hover:bg-white/20"
                  >
                    Xem thêm
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Service Icons Section */}
        <div className="mt-6">
          <div className="flex sm:grid sm:grid-cols-6 items-start justify-start sm:justify-center gap-x-4 sm:gap-y-2 overflow-y-hidden overflow-x-auto scrollbar-hide py-2 sm:py-0">
            {serviceItemsList}
          </div>
        </div>
      </div>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);