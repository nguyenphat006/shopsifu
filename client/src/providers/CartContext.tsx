'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useCart as useCartHook } from '@/components/client/cart/hooks/use-Cart';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const cartHook = useCartHook({ autoFetch: true });
  
  // Lấy các function từ cartHook
  const { 
    addToCart: originalAddToCart, 
    fetchCart: originalFetchCart,
    updateCartItem: originalUpdateCartItem,
    removeItems: originalRemoveItems,
    selectAllItems: originalSelectAllItems,
    ...rest 
  } = cartHook;
  
  // Override addToCart để cập nhật lastUpdated
  const addToCart = useCallback(async (data: any, showNotification: boolean = true) => {
    const result = await originalAddToCart(data, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalAddToCart]);
  
  // Override fetchCart để có thể refresh khi cần
  const fetchCart = useCallback(async (params?: string) => {
    const result = await originalFetchCart(params);
    setLastUpdated(Date.now());
    return result;
  }, [originalFetchCart]);
  
  // Override updateCartItem để cập nhật lastUpdated
  const updateCartItem = useCallback(async (itemId: string, data: any, showNotification: boolean = false) => {
    const result = await originalUpdateCartItem(itemId, data, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalUpdateCartItem]);
  
  // Override removeItems để cập nhật lastUpdated
  const removeItems = useCallback(async (cartItemIds: string[], showNotification: boolean = true) => {
    const result = await originalRemoveItems(cartItemIds, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalRemoveItems]);
  
  // Override selectAllItems để cập nhật lastUpdated
  const selectAllItems = useCallback(async (isSelected: boolean, showNotification: boolean = false) => {
    const result = await originalSelectAllItems(isSelected, showNotification);
    if (result) {
      setLastUpdated(Date.now());
    }
    return result;
  }, [originalSelectAllItems]);
  
  // Hàm force refresh cart
  const forceRefresh = useCallback(async () => {
    await originalFetchCart();
    setLastUpdated(Date.now());
  }, [originalFetchCart]);

  // Hàm mới để update và refresh
  const updateCartItemAndRefresh = useCallback(async (itemId: string, data: any, showNotification: boolean = false) => {
    const result = await originalUpdateCartItem(itemId, data, showNotification);
    if (result) {
      await forceRefresh(); // Gọi forceRefresh để đảm bảo re-render
    }
    return result;
  }, [originalUpdateCartItem, forceRefresh]);

  // Hàm để select specific cart item
  const selectSpecificItem = useCallback(async (itemId: string, isSelected: boolean = true, showNotification: boolean = false) => {
    try {
      // Tìm item hiện tại để lấy skuId và quantity
      const currentCartData = rest.shopCarts;
      if (!currentCartData || currentCartData.length === 0) {
        console.warn('No cart data found for selecting item');
        return false;
      }

      let currentItem = null;
      for (const shopCart of currentCartData) {
        currentItem = shopCart.cartItems.find(item => item.id === itemId);
        if (currentItem) break;
      }

      if (!currentItem) {
        console.warn(`Item with id ${itemId} not found in current cart`);
        return false;
      }

      // Update item với isSelected mới, giữ nguyên skuId và quantity
      const result = await originalUpdateCartItem(itemId, { 
        skuId: currentItem.sku.id,
        quantity: currentItem.quantity,
        isSelected 
      }, showNotification);
      
      if (result) {
        // Force refresh để đảm bảo UI được cập nhật
        await forceRefresh();
        console.log(`Successfully updated selection for item ${itemId} to ${isSelected}`);
      }
      return result;
    } catch (error) {
      console.error('Error selecting specific item:', error);
      throw error;
    }
  }, [originalUpdateCartItem, rest.shopCarts, forceRefresh]);

  // Hàm helper để tìm và select item vừa thêm vào cart dựa trên skuId và quantity
  const findAndSelectNewItem = useCallback(async (skuId: string, quantity: number) => {
    try {
      // 1. Refresh cart để có data mới nhất
      await forceRefresh();
      
      // 2. Đợi thêm để đảm bảo state được cập nhật
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 3. Lấy cart data từ current state
      const { shopCarts: currentCartData } = rest;
      
      if (!currentCartData || currentCartData.length === 0) {
        console.warn('No cart data found after refresh');
        return false;
      }

      // 4. Tìm item có skuId và quantity matching
      let foundItem = null;
      for (const shopCart of currentCartData) {
        for (const item of shopCart.cartItems) {
          if (item.sku.id === skuId && item.quantity === quantity) {
            foundItem = item;
            break;
          }
        }
        if (foundItem) break;
      }

      if (!foundItem) {
        console.warn(`Item with skuId ${skuId} and quantity ${quantity} not found in cart`);
        return false;
      }

      // 5. Select item đó
      // 5a. Ngay lập tức update UI để có response tức thì
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('forceSelectItem', { 
          detail: { itemId: foundItem.id, isSelected: true } 
        }));
      }
      
      // 5b. Thực hiện API call để sync với backend
      const selectResult = await selectSpecificItem(foundItem.id, true, false);
      if (selectResult) {
        console.log(`Successfully selected item ${foundItem.id} for Buy Now`);
        return foundItem.id;
      }
      
      return false;
    } catch (error) {
      console.error('Error in findAndSelectNewItem:', error);
      return false;
    }
  }, [forceRefresh, rest, selectSpecificItem]);
  
  // Hàm mới để manually trigger UI update cho specific item (dùng cho Buy Now flow)
  const forceSelectItemInUI = useCallback((itemId: string) => {
    // Emit event để cart component có thể manually update state
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('forceSelectItem', { 
        detail: { itemId, isSelected: true } 
      }));
    }
  }, []);
  
  return (
    <CartContext.Provider value={{
      ...rest,
      addToCart,
      fetchCart,
      updateCartItem,
      removeItems,
      selectAllItems,
      lastUpdated,
      forceRefresh,
      updateCartItemAndRefresh,
      selectSpecificItem,
      findAndSelectNewItem,
      forceSelectItemInUI
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};