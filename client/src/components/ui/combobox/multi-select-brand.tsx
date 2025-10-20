"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, X, Search, Loader2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCbbBrand } from '@/hooks/combobox/useCbbBrand';

interface BrandOption {
  value: string;
  label: string;
  image?: string | null;
}

interface MultiSelectBrandProps {
  selectedBrands: BrandOption[];
  onSelectionChange: (brands: BrandOption[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectBrand({
  selectedBrands = [],
  onSelectionChange,
  placeholder = "Chọn thương hiệu...",
  className,
  disabled = false
}: MultiSelectBrandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { brands, loading } = useCbbBrand();
  
  // Filter brands based on search term
  const filteredBrands = brands.filter(brand =>
    brand.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (brand: BrandOption) => {
    const isSelected = selectedBrands.find(item => item.value === brand.value);
    
    if (isSelected) {
      // Remove from selection
      const newSelection = selectedBrands.filter(item => item.value !== brand.value);
      onSelectionChange(newSelection);
    } else {
      // Add to selection
      onSelectionChange([...selectedBrands, brand]);
    }
  };

  const handleRemove = (brandValue: string) => {
    const newSelection = selectedBrands.filter(item => item.value !== brandValue);
    onSelectionChange(newSelection);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[40px] p-2"
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedBrands.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {selectedBrands.slice(0, 3).map((brand) => (
                    <Badge
                      key={brand.value}
                      variant="secondary"
                      className="text-xs flex items-center gap-1"
                    >
                      {brand.image && (
                        <img
                          src={brand.image}
                          alt={brand.label}
                          className="w-3 h-3 rounded-full object-cover"
                        />
                      )}
                      {brand.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(brand.value);
                        }}
                      />
                    </Badge>
                  ))}
                  {selectedBrands.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedBrands.length - 3} khác
                    </Badge>
                  )}
                </>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Tìm kiếm thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <CommandList className="max-h-60">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
                </div>
              ) : (
                <>
                  {selectedBrands.length > 0 && (
                    <div className="p-2 border-b">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Xóa tất cả ({selectedBrands.length})
                      </Button>
                    </div>
                  )}
                  <CommandGroup>
                    {filteredBrands.length === 0 ? (
                      <CommandEmpty>Không tìm thấy thương hiệu nào.</CommandEmpty>
                    ) : (
                      filteredBrands.map((brand) => {
                        const isSelected = selectedBrands.find(item => item.value === brand.value);
                        return (
                          <CommandItem
                            key={brand.value}
                            value={brand.value}
                            onSelect={() => handleSelect(brand)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}>
                              <Check className="h-3 w-3" />
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              {brand.image ? (
                                <img
                                  src={brand.image}
                                  alt={brand.label}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Tag className="w-3 h-3 text-gray-500" />
                                </div>
                              )}
                              <span className="flex-1">{brand.label}</span>
                            </div>
                          </CommandItem>
                        );
                      })
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Display selected brands below */}
      {selectedBrands.length > 0 && (
        <div className="mt-2 space-y-2">
          <div className="text-sm text-muted-foreground">
            Đã chọn {selectedBrands.length} thương hiệu:
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedBrands.map((brand) => (
              <Badge
                key={brand.value}
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                {brand.image && (
                  <img
                    src={brand.image}
                    alt={brand.label}
                    className="w-3 h-3 rounded-full object-cover"
                  />
                )}
                {brand.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => handleRemove(brand.value)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
