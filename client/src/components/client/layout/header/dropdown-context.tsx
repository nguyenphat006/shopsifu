'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Các loại dropdown có thể mở
export type DropdownType = 'categories' | 'search' | 'cart' | 'user' | 'profile' | 'language' | 'none';

// Định nghĩa context
interface DropdownContextType {
  openDropdown: DropdownType;
  setOpenDropdown: (type: DropdownType) => void;
}

// Tạo context
const DropdownContext = createContext<DropdownContextType>({
  openDropdown: 'none',
  setOpenDropdown: () => {},
});

// Provider để quản lý state dropdown
export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>('none');

  // Update overlay visibility without locking scroll
  useEffect(() => {
    const overlayElement = document.querySelector('.body-overlay');
    const shouldShowOverlay = openDropdown !== 'none' && openDropdown !== 'cart';
    
    if (shouldShowOverlay) {
      overlayElement?.classList.add('overlay-active');
    } else {
      overlayElement?.classList.remove('overlay-active');
    }
  }, [openDropdown]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideClick = !(
        event.target instanceof Element && 
        (
          event.target.closest('.category-hover-container') || 
          event.target.closest('.search-container') ||
          event.target.closest('.profile-container') ||
          event.target.closest('.language-container') ||
          event.target.closest('.cart-container')
        )
      );

      if (isOutsideClick) {
        setOpenDropdown('none');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ openDropdown, setOpenDropdown }}>
      {children}
    </DropdownContext.Provider>
  );
}

// Hook để sử dụng context
export function useDropdown() {
  return useContext(DropdownContext);
}
