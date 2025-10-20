"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, X, Search, Loader2, Grid3X3, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCbbCategory } from '@/hooks/combobox/useCbbCategory';

interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}

interface MultiSelectCategoryProps {
  selectedCategories: CategoryOption[];
  onSelectionChange: (categories: CategoryOption[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectCategory({
  selectedCategories = [],
  onSelectionChange,
  placeholder = "Chọn danh mục...",
  className,
  disabled = false
}: MultiSelectCategoryProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
  
  // Get parent categories (level 1)
  const { categories: parentCategories, loading: loadingParent } = useCbbCategory(null);
  
  // Get child categories based on selected parent
  const { categories: childCategories, loading: loadingChild } = useCbbCategory(selectedParentCategory);
  
  // Combine all categories for filtering
  const allCategories = [...parentCategories, ...childCategories];
  
  // Filter categories based on search term
  const filteredCategories = allCategories.filter(category =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (category: CategoryOption) => {
    const isSelected = selectedCategories.find(item => item.value === category.value);
    
    if (isSelected) {
      // Remove from selection
      const newSelection = selectedCategories.filter(item => item.value !== category.value);
      onSelectionChange(newSelection);
    } else {
      // Add to selection
      onSelectionChange([...selectedCategories, category]);
    }
  };

  const handleRemove = (categoryValue: string) => {
    const newSelection = selectedCategories.filter(item => item.value !== categoryValue);
    onSelectionChange(newSelection);
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const handleParentCategoryClick = (parentId: string) => {
    if (selectedParentCategory === parentId) {
      setSelectedParentCategory(null); // Collapse if already selected
    } else {
      setSelectedParentCategory(parentId); // Expand new parent
    }
  };

  const renderCategoryItem = (category: CategoryOption) => {
    const isSelected = selectedCategories.find(item => item.value === category.value);
    const isParent = !category.parentCategoryId;
    const hasChildren = parentCategories.find(p => p.value === category.value) && 
                       selectedParentCategory !== category.value;

    return (
      <CommandItem
        key={category.value}
        value={category.value}
        onSelect={() => {
          if (isParent && hasChildren) {
            handleParentCategoryClick(category.value);
          } else {
            handleSelect(category);
          }
        }}
        className={cn(
          "flex items-center gap-2 cursor-pointer",
          !isParent && "pl-6" // Indent child categories
        )}
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
          {category.icon ? (
            <img
              src={category.icon}
              alt={category.label}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Grid3X3 className="w-3 h-3 text-gray-500" />
            </div>
          )}
          <span className="flex-1">{category.label}</span>
          {isParent && hasChildren && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </CommandItem>
    );
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
              {selectedCategories.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {selectedCategories.slice(0, 3).map((category) => (
                    <Badge
                      key={category.value}
                      variant="secondary"
                      className="text-xs flex items-center gap-1"
                    >
                      {category.icon && (
                        <img
                          src={category.icon}
                          alt={category.label}
                          className="w-3 h-3 rounded-full object-cover"
                        />
                      )}
                      {category.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(category.value);
                        }}
                      />
                    </Badge>
                  ))}
                  {selectedCategories.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedCategories.length - 3} khác
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
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <CommandList className="max-h-60">
              {loadingParent ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
                </div>
              ) : (
                <>
                  {selectedCategories.length > 0 && (
                    <div className="p-2 border-b">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Xóa tất cả ({selectedCategories.length})
                      </Button>
                    </div>
                  )}
                  <CommandGroup>
                    {filteredCategories.length === 0 ? (
                      <CommandEmpty>Không tìm thấy danh mục nào.</CommandEmpty>
                    ) : (
                      // Show parent categories first, then their children if expanded
                      <>
                        {parentCategories
                          .filter(parent => 
                            searchTerm === "" || 
                            parent.label.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((parentCategory) => (
                            <div key={parentCategory.value}>
                              {renderCategoryItem(parentCategory)}
                              {selectedParentCategory === parentCategory.value && (
                                <>
                                  {loadingChild ? (
                                    <div className="flex items-center justify-center py-2 pl-8">
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      <span className="ml-2 text-xs text-muted-foreground">Đang tải...</span>
                                    </div>
                                  ) : (
                                    childCategories
                                      .filter(child => 
                                        searchTerm === "" || 
                                        child.label.toLowerCase().includes(searchTerm.toLowerCase())
                                      )
                                      .map(childCategory => renderCategoryItem(childCategory))
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                      </>
                    )}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Display selected categories below */}
      {selectedCategories.length > 0 && (
        <div className="mt-2 space-y-2">
          <div className="text-sm text-muted-foreground">
            Đã chọn {selectedCategories.length} danh mục:
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map((category) => (
              <Badge
                key={category.value}
                variant="outline"
                className="text-xs flex items-center gap-1"
              >
                {category.icon && (
                  <img
                    src={category.icon}
                    alt={category.label}
                    className="w-3 h-3 rounded-full object-cover"
                  />
                )}
                {category.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-500"
                  onClick={() => handleRemove(category.value)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
