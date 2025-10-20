'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet';
import { useCbbCategory } from '@/hooks/combobox/useCbbCategory';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { createCategorySlug } from '@/utils/slugify';

interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}


interface MobileCategoriesProps {
  children: React.ReactNode;
}

export function MobileCategories({ children }: MobileCategoriesProps) {
  const [view, setView] = useState<'main' | 'sub'>('main');
  const [selectedParent, setSelectedParent] = useState<CategoryOption | null>(null);

  // Fetch parent categories (level 1)
  const { categories: parentCategories, loading: parentLoading } = useCbbCategory(null);

  // Fetch child categories based on the selected parent category
  const { categories: subCategories, loading: subLoading } = useCbbCategory(selectedParent?.value || null);

  const handleParentClick = (category: CategoryOption) => {
    setSelectedParent(category);
    setView('sub');
  };

  const handleBackClick = () => {
    setView('main');
    setSelectedParent(null);
  };

  const renderSkeletons = () => (
    <div className="grid gap-2 py-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );

  return (
    <Sheet onOpenChange={(open) => !open && handleBackClick()}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          {view === 'main' ? (
            <>
              <SheetTitle>Danh mục sản phẩm</SheetTitle>
              <SheetDescription>Khám phá các sản phẩm theo danh mục.</SheetDescription>
            </>
          ) : (
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBackClick} className="-ml-4 mr-1 px-2 h-auto">
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <SheetTitle>{selectedParent?.label}</SheetTitle>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {view === 'main' && (
            <div className="grid gap-1">
              {parentLoading ? renderSkeletons() : parentCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleParentClick(category)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  {category.label}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {view === 'sub' && (
            <div className="grid gap-1">
              {subLoading ? renderSkeletons() : (
                <>
                  {selectedParent && (
                     <SheetClose asChild>
                        <Link
                          href={createCategorySlug(selectedParent.label, [selectedParent.value])}
                          className="block px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-gray-100 rounded-md"
                        >
                          Xem tất cả {selectedParent.label}
                        </Link>
                      </SheetClose>
                  )}
                  {subCategories.map((category) => (
                    <SheetClose asChild key={category.value}>
                      <Link
                        href={createCategorySlug(category.label, selectedParent?.value ? [selectedParent.value, category.value] : [category.value])}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        {category.label}
                      </Link>
                    </SheetClose>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
