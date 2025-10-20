'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Loại dropdown còn lại
export type DropdownType = 'search' | 'none';

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

// Provider chỉ quản lý search dropdown
export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>('none');

  useEffect(() => {
    const overlayElement = document.querySelector('.body-overlay');
    const shouldShowOverlay = openDropdown === 'search';

    if (shouldShowOverlay) {
      overlayElement?.classList.add('overlay-active');
    } else {
      overlayElement?.classList.remove('overlay-active');
    }
  }, [openDropdown]);

  // Close dropdown when click outside search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideClick = !(
        event.target instanceof Element &&
        event.target.closest('.search-container')
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

// Hook dùng để truy cập dropdown context
export function useDropdown() {
  return useContext(DropdownContext);
}
