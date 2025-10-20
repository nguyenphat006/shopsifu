'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCbbBrand } from '@/hooks/combobox/useCbbBrand';

interface BrandCbbProps {
  value?: string | null;
  onChange: (value: string | null) => void;
}

export function BrandCbb({ value, onChange }: BrandCbbProps) {
  const [open, setOpen] = React.useState(false);
  const { brands, loading } = useCbbBrand();

  // Không chuyển đổi sang Number nữa vì giờ id là string
  const selectedValue = value || null;
  
  // Tìm brand đã chọn dựa trên id string
  const selectedBrand = React.useMemo(() => 
    brands.find((brand) => brand.value === selectedValue),
    [brands, selectedValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải...
            </span>
          ) : selectedBrand ? (
            <span className="flex items-center">
              {selectedBrand.image && (
                <img 
                  src={selectedBrand.image} 
                  alt={selectedBrand.label}
                  className="h-5 w-5 mr-2 rounded-full object-contain"
                />
              )}
              {selectedBrand.label}
            </span>
          ) : (
            'Chọn thương hiệu...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Tìm thương hiệu..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy thương hiệu.</CommandEmpty>
            <CommandGroup>
              {brands.map((brand) => (
                <CommandItem
                  key={brand.value}
                  value={brand.label} // Command uses this for searching
                  onSelect={() => {
                    // Trả về đúng kiểu string, không chuyển đổi
                    const newValue = brand.value === selectedValue ? null : brand.value;
                    console.log("Selected brand:", brand.label, "ID:", brand.value);
                    onChange(newValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedValue === brand.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center">
                    {brand.image && (
                      <img 
                        src={brand.image} 
                        alt={brand.label}
                        className="h-5 w-5 mr-2 rounded-full object-contain"
                      />
                    )}
                    <span>{brand.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
