'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShopCart, CartItem as ApiCartItem } from '@/types/cart.interface';
import { useCart } from '@/providers/CartContext';
import { ROUTES } from '@/constants/route';
import { useAuthGuard } from '@/hooks/useAuthGuard';

// Define the structure for a cart item with UI selection state
interface LocalCartItem extends ApiCartItem {
  selected: boolean;
}

export function CartDropdown() {
  const { isAuthenticated } = useAuthGuard({ silentCheck: true });
  
  // Sử dụng Context để quản lý giỏ hàng toàn cục
  const { 
    shopCarts, 
    cart, 
    isLoading, 
    fetchCart, 
    updateCartItem, 
    removeItems
  } = useCart();
  
  // State cho việc chọn sản phẩm (chỉ ở UI)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  // State cho việc đang cập nhật số lượng
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  // State để quản lý trạng thái mở của dropdown
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Khởi tạo selected items khi có dữ liệu từ API
  useEffect(() => {
    if (shopCarts && shopCarts.length > 0) {
      const initialSelection: Record<string, boolean> = {};
      shopCarts.forEach((shopCart: ShopCart) => {
        shopCart.cartItems.forEach((item: ApiCartItem) => {
          initialSelection[item.id] = true; // Mặc định chọn tất cả
        });
      });
      setSelectedItems(initialSelection);
    }
  }, [shopCarts]);
  
  // Cập nhật giỏ hàng khi mở dropdown và đã đăng nhập
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchCart();
    }
  }, [isOpen, isAuthenticated, fetchCart]);

  // Xử lý thay đổi số lượng sản phẩm
  const handleQuantityChange = async (itemId: string, skuId: string, currentQuantity: number, increment: number) => {
    if (!isAuthenticated) return;
    
    const newQuantity = Math.max(1, currentQuantity + increment);
    if (newQuantity === currentQuantity) return;
    
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
    
    try {
      await updateCartItem(
        itemId, 
        { skuId, quantity: newQuantity },
        false // Không hiển thị thông báo
      );
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (itemId: string) => {
    if (!isAuthenticated) return;
    await removeItems([itemId], true); // Có hiển thị thông báo
  };

  // Xử lý chọn/bỏ chọn một sản phẩm (chỉ ở UI)
  const handleToggleSelect = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Xử lý chọn/bỏ chọn tất cả sản phẩm (chỉ ở UI)
  const handleToggleSelectAll = (checked: boolean | 'indeterminate') => {
    const isSelected = checked === true;
    const newSelection: Record<string, boolean> = {};
    
    shopCarts.forEach((shopCart: ShopCart) => {
      shopCart.cartItems.forEach((item: ApiCartItem) => {
        newSelection[item.id] = isSelected;
      });
    });
    
    setSelectedItems(newSelection);
  };

  // Tính tổng tiền các sản phẩm đã chọn (ở UI)
  const calculateSelectedTotal = () => {
    if (!shopCarts || shopCarts.length === 0) return 0;
    
    let total = 0;
    shopCarts.forEach((shopCart: ShopCart) => {
      shopCart.cartItems.forEach((item: ApiCartItem) => {
        if (selectedItems[item.id]) {
          const price = item.sku.product.basePrice;
          total += price * item.quantity;
        }
      });
    });
    
    return total;
  };

  // Đếm tổng số sản phẩm
  const totalItemsCount = cart?.totalItems || 0;
  
  // Kiểm tra trạng thái chọn
  const getTotalItems = () => {
    if (!shopCarts) return 0;
    let count = 0;
    shopCarts.forEach((shop: ShopCart) => {
      count += shop.cartItems.length;
    });
    return count;
  };
  
  const getTotalSelectedItems = () => {
    if (!shopCarts) return 0;
    return Object.values(selectedItems).filter(Boolean).length;
  };
  
  const allItemsSelected = getTotalItems() > 0 && getTotalItems() === getTotalSelectedItems();
  const isIndeterminate = getTotalSelectedItems() > 0 && !allItemsSelected;
  const noItemsSelected = getTotalSelectedItems() === 0;
  
  // Flatten cart items cho dễ hiển thị
  const allCartItems = shopCarts?.flatMap((shop: ShopCart) => 
    shop.cartItems.map((item: ApiCartItem) => ({...item, shopName: shop.shop.name}))
  ) || [];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="rounded-full cursor-pointer relative whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-3">
          <ShoppingCart className="h-6 w-6 text-white" strokeWidth={1}/>
          {isAuthenticated && totalItemsCount > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-red-600">
              {totalItemsCount}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col rounded-md">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <SheetTitle className="text-lg font-semibold text-gray-900 mb-1">Giỏ hàng của bạn</SheetTitle>
        </SheetHeader>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem giỏ hàng</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href={ROUTES.AUTH.SIGNIN}>
                Đăng nhập
              </Link>
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Loader2 size={48} className="text-gray-300 mb-4 animate-spin" />
            <p className="text-gray-500">Đang tải giỏ hàng...</p>
          </div>
        ) : allCartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 pl-4 border-b border-gray-200 bg-gray-50">
                <label htmlFor="select-all" className="flex items-center space-x-3 cursor-pointer">
                  <Checkbox
                    id="select-all"
                    checked={isIndeterminate ? 'indeterminate' : allItemsSelected}
                    onCheckedChange={handleToggleSelectAll}
                  />
                  <span className="text-sm font-medium">Chọn tất cả ({allCartItems.length} sản phẩm)</span>
                </label>
              </div>
              <div className="divide-y divide-gray-200">
                {allCartItems.map((item: ApiCartItem & { shopName: string }) => {
                  const product = item.sku.product;
                  // const productImage = product.images && product.images.length > 0
                  const productImage = item.sku.image

                    ? item.sku.image
                    : '/images/image-placeholder.jpg';
                  
                  return (
                    <div key={item.id} className="flex items-center p-4">
                      <Checkbox
                        id={`select-item-${item.id}`}
                        checked={selectedItems[item.id]}
                        onCheckedChange={() => handleToggleSelect(item.id)}
                      />
                      <label htmlFor={`select-item-${item.id}`} className="flex items-center ml-4 cursor-pointer">
                        <div className="w-[80px] h-[80px] relative rounded-md overflow-hidden">
                          <Image 
                            src={productImage} 
                            alt={product.name} 
                            fill
                            sizes="80px"
                            className="object-cover" 
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">Phân loại: {item.sku.value}</p>
                          <p className="text-sm text-red-600 font-semibold mt-1">
                            {product.basePrice.toLocaleString('vi-VN')}₫
                          </p>
                          <div className="flex items-center mt-2">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-7 w-7" 
                              onClick={() => handleQuantityChange(item.id, item.skuId, item.quantity, -1)}
                              disabled={updatingItems[item.id]}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 text-sm font-medium">
                              {updatingItems[item.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin inline" />
                              ) : item.quantity}
                            </span>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-7 w-7" 
                              onClick={() => handleQuantityChange(item.id, item.skuId, item.quantity, 1)}
                              disabled={updatingItems[item.id]}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </label>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-4 text-gray-400 hover:text-red-500" 
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <SheetFooter className="p-6 border-t border-gray-200">
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-md font-semibold text-gray-800">Tổng cộng</span>
                  <span className="text-xl font-bold text-red-600">{calculateSelectedTotal().toLocaleString('vi-VN')}₫</span>
                </div>
                {/* <Button 
                  size="lg" 
                  className="w-full bg-red-600 hover:bg-red-700" 
                  disabled={noItemsSelected}
                >
                  Thanh toán ({getTotalSelectedItems()} sản phẩm)
                </Button> */}
                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link href="/cart" className="flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Xem giỏ hàng</span>
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}