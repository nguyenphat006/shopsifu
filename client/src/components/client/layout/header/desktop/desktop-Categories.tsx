'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCbbCategory } from '@/hooks/combobox/useCbbCategory';
import { Skeleton } from '@/components/ui/skeleton';
import { useDropdown } from '../dropdown-context';
import { createCategorySlug } from '@/utils/slugify';
import '../style.css';




interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}

export function Categories() {
  const [activeCategory, setActiveCategory] = useState<CategoryOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openDropdown, setOpenDropdown } = useDropdown();

  // Fetch parent categories (level 1)
  const { categories: parentCategories, loading: parentLoading } = useCbbCategory(null);

  // Fetch child categories based on the active parent category
  const { categories: subCategories, loading: subLoading } = useCbbCategory(activeCategory?.value || null);

  const open = openDropdown === 'categories';

  const handleMouseEnter = () => {
    setOpenDropdown('categories');
  };

  const handleMouseLeave = () => {
    setOpenDropdown('none');
    setActiveCategory(null); // Reset active category on leave
  };

  const handleClick = () => {
    setOpenDropdown(open ? 'none' : 'categories');
  };

  useEffect(() => {
    // Set the first category as active by default when dropdown opens and data is loaded
    if (open && !parentLoading && parentCategories.length > 0 && !activeCategory) {
      setActiveCategory(parentCategories[0]);
    }
    // Reset when dropdown closes
    if (!open) {
      setActiveCategory(null);
    }
  }, [open, parentLoading, parentCategories, activeCategory]);
  
  // Đã chuyển sang sử dụng CSS classes để tránh inline styles
  // Xem file header-styles.css
  return (
    <>
      {/* Background overlay when dropdown is open - positioned below header */}      <div 
        className={cn(
          "fixed top-[75px] left-0 right-0 bottom-0 bg-black transition-all duration-300 category-backdrop pointer-events-none",
          open 
            ? "opacity-50 visible z-40" 
            : "opacity-0 invisible"
        )}
        aria-hidden="true"
      />
        {/* Sử dụng kỹ thuật Slot cho container để giảm re-render */}
      <div
        ref={containerRef}
        className="relative z-50 category-hover-container"
      >
        {/* Invisible extended hover area to maintain hover state */}
        {open && (
          <div 
            className="absolute top-0 left-[-20px] w-[260px] h-[calc(100%+18px)] category-hover-area"
            onMouseEnter={handleMouseEnter}
            aria-hidden="true"
          />
        )}
        
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
      <motion.div
        className="absolute inset-0 rounded-full backdrop-blur-sm"
        initial={{ 
          backgroundColor: "rgba(233, 233, 233, 0)", 
          scaleX: 0.5,
          scaleY: 0.8
        }}
        animate={{
          backgroundColor: open ? "rgba(233, 233, 233, 0.4)" : "rgba(233, 233, 233, 0)", // #E9E9E9 khi mở
          boxShadow: open
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            : "none",
          scaleX: open ? 1 : 0.5,
          scaleY: open ? 1 : 0.8
        }}
        whileHover={{
          backgroundColor: "rgba(233, 233, 233, 0.4)", // #E9E9E9 khi hover
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          scaleX: [0.8, 1.1, 1], // Hiệu ứng phóng to từ giữa rồi nảy sang 2 bên
          scaleY: [0.9, 1.05, 1], // Hiệu ứng phóng to và thu nhỏ lại nhẹ
        }}
        transition={{
          type: "spring",
          stiffness: 350, // Tăng độ cứng để phản hồi nhanh hơn
          damping: 12, // Giảm độ giảm dao động để tạo hiệu ứng nảy
          backgroundColor: { duration: 0.15 }, // Chuyển màu nhanh
          boxShadow: { duration: 0.15 }, // Chuyển bóng nhanh
          scaleX: { duration: 0.35, ease: "easeOut" }, // Hiệu ứng phóng ngang
          scaleY: { duration: 0.25, ease: "easeOut" }, // Hiệu ứng phóng dọc
        }}
      />
            {/* Content layer - stays in place */}
          <div 
            className="cursor-pointer relative whitespace-nowrap inline-flex items-center gap-1 px-4 py-3 text-white font-semibold text-sm z-10"
            onClick={handleClick} // Thêm onClick để toggle dropdown
          >
            <Menu className="w-5 h-5"/>
            Danh mục
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </div>
        </div>        {/* Placeholder để dự trữ không gian, giảm CLS */}        <div 
          aria-hidden="true"
          className={cn(
            "hidden absolute left-[-180px] top-[calc(100%+12px)] invisible pointer-events-none dropdown-placeholder", 
            open ? "lg:block" : "lg:hidden"
          )}
        />
        
        <motion.div 
          ref={dropdownRef}
                    className={cn(
            "border-1 border-gray-200 absolute top-[calc(100%+12px)] left-[-180px] min-w-full md:min-w-[950px] bg-white rounded-lg shadow-xl z-50 mb-5 overflow-hidden dropdown-container h-[600px]",
            open ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: open ? 1 : 0, 
            y: open ? 0 : -10,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          layoutId="categories-dropdown" // Giúp Framer Motion theo dõi và tối ưu layout shift
        >
          {/* Bubble arrow pointing to the title */}
          <div className="absolute left-[230px] top-[-7px] w-3 h-3 bg-white transform rotate-45 border-t-1 border-l-1 border-gray-200 z-1"></div>

          <div className="flex h-full w-full relative z-10">            {/* Left: Main categories */}
                                    <div className="h-full w-1/4 bg-white border-r-1 pr-2 py-4 rounded-l-md overflow-y-auto">
              <div role="menu" className="space-y-1">
                {parentLoading ? (
                  // Skeleton loader for parent categories
                  Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between px-3 py-2 h-[38px]">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-4" />
                    </div>
                  ))
                ) : (
                                    parentCategories.map((cat: CategoryOption) => (
                    <div
                      key={cat.value}
                      onMouseEnter={() => setActiveCategory(cat)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-[14px] h-[38px] text-[#333] font-medium cursor-pointer hover:bg-gray-100 transition-colors rounded-md',
                        activeCategory?.value === cat.value && 'bg-gray-100'
                      )}
                      role="menuitem"
                      tabIndex={0}
                    >
                      {cat.label}
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  ))
                )}
              </div>
            </div>{/* Right: Sub categories */}
                        <div className="w-3/4 p-4 bg-white rounded-r-md overflow-y-auto h-full">
              {subLoading ? (
                // Skeleton loader for sub-categories
                <div className="space-y-6">
                   <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-5 w-1/4" />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="group block text-center p-2">
                          <Skeleton className="w-full aspect-square rounded-full mb-2" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      ))}
                    </div>
                </div>
              ) : activeCategory && subCategories.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-800">{activeCategory.label}</h3>
                    <Link 
                      href={createCategorySlug(activeCategory.label, [activeCategory.value])}
                      className="flex items-center text-sm text-red-600 hover:underline font-medium"
                    >
                      Xem tất cả
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                                        {subCategories.map((item: CategoryOption) => (
                      <Link
                        key={item.value}
                        href={createCategorySlug(item.label, [activeCategory.value, item.value])} 
                        className="group block text-center p-2 rounded-lg transition-all duration-200"
                      >
                        <div className="w-full aspect-square relative mb-2 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                          {item.icon ? (
                            <Image
                              src={item.icon}
                              alt={item.label}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="transition-transform duration-300 group-hover:scale-110 object-cover"
                            />
                          ) : (
                             <div className="w-full h-full bg-gray-100"></div>
                          )}
                        </div>
                        <span className="text-[13px] text-[#333] group-hover:text-[#D70018] font-normal leading-tight line-clamp-2 h-10 block">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>{activeCategory ? `Không có danh mục con cho ${activeCategory.label}` : 'Chọn một danh mục để xem chi tiết.'}</p>
                </div>
              )}
            </div>
          </div>        
        </motion.div>
      </div>
    </>
  );
}
