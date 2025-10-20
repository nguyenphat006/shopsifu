"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Plus, Trash2, ChevronDown } from 'lucide-react';
import { CartItem, ShopCart } from '@/types/cart.interface';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useCartAction } from '../hooks/use-CartAction';
import { Separator } from '@/components/ui/separator';
import { getProductUrl } from "@/components/client/products/shared/routes";
import { useCart } from '@/providers/CartContext';
import { SelectedVariants, findMatchingSku, Sku } from '@/utils/productUtils';
import { cn } from '@/lib/utils';

interface CartItemsProps {
  item: CartItem;
  checked: boolean;
  onCheckedChange: () => void;
  onRemove: () => void;
  onVariationChange: (itemId: string, newSkuId: string) => void;
  quantity: number;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export default function CartItems({ 
  item,
  checked,
  onCheckedChange,
  onRemove,
  quantity,
  onQuantityChange,
}: CartItemsProps) {
  // 1. Call all hooks at the top level
  const { updateCartItem, isUpdating, updateItemQuantity, shopCarts } = useCart();
  const { productDetails, isLoading, error, fetchProductDetails } = useCartAction();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const currentItem = useMemo(() => {
    return shopCarts
      .flatMap((shop: ShopCart) => shop.cartItems)
      .find((cartItem: CartItem) => cartItem.id === item.id) || item;
  }, [shopCarts, item]);

  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({});
  const [currentSku, setCurrentSku] = useState<Sku | null>(null);

  useEffect(() => {
    // This effect synchronizes the popover's selected variants with the current item
    // whenever the popover is opened or the underlying item data changes.
    if (isPopoverOpen && productDetails) {
      // Re-implement the logic to get initial variants based on the current item's SKU
      const initialVariants: SelectedVariants = {};
      const currentSkuValueParts = currentItem.sku.value.split('-').map((part: string) => part.trim());
      productDetails.variants.forEach((group, index) => {
        if (currentSkuValueParts[index]) {
          initialVariants[group.value] = currentSkuValueParts[index];
        }
      });
      setSelectedVariants(initialVariants);

      // Convert SkuDetail[] to Sku[] by mapping productId to a string to resolve type mismatch.
      const compatibleSkus = productDetails.skus.map(sku => ({
        ...sku,
        productId: String(sku.productId),
      }));

      // Find the currently matching SKU based on the determined variants, with correct argument order
      const matchingSku = findMatchingSku(initialVariants, compatibleSkus, productDetails.variants);
      setCurrentSku(matchingSku);
    }
  }, [isPopoverOpen, productDetails, currentItem.sku.value]);

  useEffect(() => {
    if (productDetails) {
      // Safely convert SkuDetail[] to Sku[] to match the utility function's requirement
      const skusForMatching: Sku[] = productDetails.skus.map(s => ({
        id: s.id,
        value: s.value,
        price: s.price,
        stock: s.stock,
        image: s.image || '', // Ensure image is always a string
        productId: String(s.productId), // Convert productId from number to string
      }));

      const matchingSku = findMatchingSku(selectedVariants, skusForMatching, productDetails.variants);
      setCurrentSku(matchingSku);
    }
  }, [selectedVariants, productDetails]);

  const handleVariantSelect = (variantType: string, option: string) => {
    // Create new variants object, allowing for deselection
    const newSelectedVariants = {
      ...selectedVariants,
      [variantType]: selectedVariants[variantType] === option ? null : option,
    };
    setSelectedVariants(newSelectedVariants);

    // Immediately find the matching SKU for the new selection and update the state
    if (productDetails) {
      const compatibleSkus = productDetails.skus.map(sku => ({ ...sku, productId: String(sku.productId) }));
      const matchingSku = findMatchingSku(newSelectedVariants, compatibleSkus, productDetails.variants);
      setCurrentSku(matchingSku);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!currentSku || currentSku.id === currentItem.sku.id) {
      setIsPopoverOpen(false);
      return;
    }

    // Gọi API với SKU mới, không phụ thuộc vào state cũ
    const result = await updateCartItem(currentItem.id, {
      skuId: currentSku.id,
      quantity: currentItem.quantity, 
    }, true);

    // Sau khi API chạy (thành công hay thất bại), hook `useCart` đã cập nhật lại state
    // và component sẽ re-render với dữ liệu mới. Chỉ cần đóng Popover.
    setIsPopoverOpen(false);
  };



  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(newQuantity, currentItem.sku.stock));
    if (clampedQuantity !== quantity) {
        onQuantityChange(item.id, clampedQuantity);
    }
  };

  // Use useEffect to call the update API when quantity changes
  useEffect(() => {
    // Avoid running on initial mount or if quantity hasn't changed from the prop value
    if (quantity === currentItem.quantity) {
      return;
    }

    const handler = setTimeout(() => {
      // Always use the most up-to-date IDs from currentItem
      updateItemQuantity(currentItem.id, currentItem.sku.id, quantity);
    }, 500); // Debounce requests by 500ms

    // Cleanup function to cancel the timeout if quantity changes again before the timeout fires
    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity, currentItem.id, currentItem.sku.id]);

  if (!currentItem || !currentItem.sku || !currentItem.sku.product) {
    return null;
  }

  return (
    <div className="flex items-center px-3 py-4 border-b">
      <div className="flex items-center gap-2 w-[45%]">
        <Checkbox
          className="ml-[30px]"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <Link href={getProductUrl(item.sku.product.name, item.sku.product.id)} className="relative w-20 h-20 mr-4 flex-shrink-0">
            <Image
              src={currentItem.sku.image || "/images/placeholder.png"}
              alt={currentItem.sku.product.name}
              fill
              sizes="80px"
              className="object-cover rounded border"
            />
        </Link>
        <div className="flex-1">
            <Link href={getProductUrl(currentItem.sku.product.name, currentItem.sku.product.id)}>
                <p className="line-clamp-2 text-sm leading-5 hover:text-primary transition-colors">
                {currentItem.sku.product.name}
                </p>
            </Link>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                <button 
                    className="text-sm text-muted-foreground mt-1 bg-gray-50 p-1 rounded-sm inline-flex items-center gap-1 hover:bg-gray-100"
                    onClick={(e) => {
                        fetchProductDetails(currentItem.sku.product.id);
                    }}
                >
                    Phân loại: {currentItem.sku.value} <ChevronDown className="w-4 h-4" />
                </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                    <h4 className="font-medium leading-none">Chọn phân loại</h4>
                    <p className="text-sm text-muted-foreground">
                        Chọn biến thể sản phẩm bạn muốn.
                    </p>
                    </div>
                    <Separator />
                    {isLoading && <p>Đang tải...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {productDetails && (
                    <div className="space-y-4">
                        {productDetails.variants.map(variant => (
                        <div key={variant.value} className="grid gap-2">
                            <label className="font-medium">{variant.value}</label>
                            <div className="flex flex-wrap gap-2">
                            {variant.options.map(option => {
                              const isSelected = selectedVariants[variant.value] === option;
                              const isAvailable = productDetails.skus.some(sku => sku.value.includes(option));

                              return (
                                <button
                                  key={option}
                                  onClick={() => handleVariantSelect(variant.value, option)}
                                  className={cn(
                                    "relative px-3 py-1.5 border rounded-md text-sm transition-all", // Adjusted padding for smaller size
                                    "hover:border-primary hover:text-primary",
                                    isSelected
                                      ? "border-primary text-primary bg-primary/5"
                                      : "border-input text-foreground",
                                    (!isAvailable || isUpdating) && "opacity-50 cursor-not-allowed"
                                  )}
                                  disabled={!isAvailable || isUpdating}
                                >
                                  {option}
                                  {isSelected && (
                                    <span className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full flex items-center justify-center w-4 h-4">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                    <Separator />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsPopoverOpen(false)} disabled={isUpdating}>Trở lại</Button>
                      <Button onClick={handleConfirmUpdate} disabled={!currentSku || currentSku.id === currentItem.sku.id || isUpdating}>
                        {isUpdating ? 'Đang cập nhật...' : 'Xác nhận'}
                      </Button>
                    </div>
                </div>
                </PopoverContent>
            </Popover>
        </div>
      </div>

      {/* Unit Price: w-[15%] */}
      <div className="w-[15%] text-center">
        {item.sku.product.virtualPrice > item.sku.price && (
          <span className="line-through text-muted-foreground text-sm mr-2">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.sku.product.virtualPrice)}
          </span>
        )}
        <span className="text-base">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.sku.price)}
        </span>
      </div>

      {/* Quantity: w-[15%] */}
      <div className="w-[15%] flex items-center justify-center">
        <button 
          onClick={() => handleQuantityChange(quantity - 1)} 
          className="p-1 border rounded-l disabled:opacity-50"
          disabled={quantity <= 1 || isUpdating}
        >
          <Minus size={16} />
        </button>
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)} 
          disabled={isUpdating}
          className="w-12 text-center border-t border-b outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50"
        />
        <button 
          onClick={() => handleQuantityChange(quantity + 1)} 
          className="p-1 border rounded-r disabled:opacity-50"
          disabled={quantity >= currentItem.sku.stock || isUpdating}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Total Price: w-[15%] */}
      <div className="w-[15%] text-center font-semibold text-primary">
        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.sku.price * quantity)}
      </div>

      {/* Actions: w-[10%] */}
      <div className="w-[10%] text-center">
        <button onClick={onRemove} className="text-muted-foreground hover:text-red-500">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
