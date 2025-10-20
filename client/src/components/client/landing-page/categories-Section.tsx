'use client';

import Link from 'next/link';
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCbbCategory } from '@/hooks/combobox/useCbbCategory';
import { BannerSection } from './banner-Section';
import { createCategorySlug } from '@/utils/slugify';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}

// 1. Tách CategoryItem thành component riêng với memo
const CategoryItem = memo(({ category }: { category: CategoryOption }) => (
  <CarouselItem key={category.value} className="pl-4 basis-auto">
    <Link
      href={createCategorySlug(category.label, category.value)}
      className="group/item transition-transform duration-300 block"
      prefetch={false} // Không prefetch để giảm network requests
    >
      <motion.div
        className="px-6 py-3 rounded-full border border-gray-300 hover:border-red-500 hover:bg-white hover:shadow-md transition-all duration-300"
        whileHover={{ scale: 1.02 }} // Micro animation thay vì CSS transform
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm font-medium text-gray-600 whitespace-nowrap group-hover/item:text-red-500 transition-colors duration-300 tracking-wide">
          {category.label}
        </span>
      </motion.div>
    </Link>
  </CarouselItem>
));

CategoryItem.displayName = 'CategoryItem';

// 2. Tách SkeletonLoader thành component riêng
const SkeletonLoader = memo(() => (
  <>
    {Array.from({ length: 8 }).map((_, index) => (
      <CarouselItem key={`skeleton-${index}`} className="pl-4 basis-auto">
        <div className="px-6 py-3 rounded-full border border-gray-300">
          <Skeleton className="h-4 w-20" />
        </div>
      </CarouselItem>
    ))}
  </>
));

SkeletonLoader.displayName = 'SkeletonLoader';

// 3. Tách EmptyState thành component riêng
const EmptyState = memo(() => (
  <CarouselItem className="pl-4 basis-auto">
    <div className="px-6 py-3 text-gray-500">
      Không có danh mục nào
    </div>
  </CarouselItem>
));

EmptyState.displayName = 'EmptyState';

// 4. Tách NavigationButtons thành component riêng
const NavigationButtons = memo(() => (
  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed" />
    <CarouselNext className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed" />
  </div>
));

NavigationButtons.displayName = 'NavigationButtons';

function CategoriesSectionComponent() {
  // Sử dụng hook để lấy danh mục cấp cao nhất (parentCategoryId = null)
  const { categories, loading } = useCbbCategory(null);

  // 5. Memoize carousel options
  const carouselOpts = useMemo(() => ({
    align: "start" as const,
    dragFree: true,
  }), []);

  // 6. Memoize category items để tránh re-render
  const categoryItems = useMemo(() => {
    if (loading) return <SkeletonLoader />;
    
    if (categories.length === 0) return <EmptyState />;
    
    return categories.map((category: CategoryOption) => (
      <CategoryItem key={category.value} category={category} />
    ));
  }, [categories, loading]);

  // 7. Memoize title component
  const sectionTitle = useMemo(() => (
    <h2 className="text-lg font-bold text-gray-800 mb-3.5 flex items-center justify-center gap-1.5">
      <span className="tracking-tight relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-red-500/20">
        KHÁM PHÁ DANH MỤC
      </span>
    </h2>
  ), []);

  return (
    <section className="w-full pt-8">
      <div className="container mx-auto">
        <BannerSection />

        {/* Categories Section */}
        <div className="mt-5">
          {sectionTitle}
          
          <div className="mt-6">
            <Carousel
              opts={carouselOpts}
              className="w-full relative group"
            >
              <CarouselContent className="-ml-4">
                {categoryItems}
              </CarouselContent>
              
              <NavigationButtons />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}

// 8. Export component với memo
export const CategoriesSection = memo(CategoriesSectionComponent);