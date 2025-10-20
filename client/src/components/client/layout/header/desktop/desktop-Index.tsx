'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { SearchInput } from './desktop-SearchInput';
import { CartDropdown } from './desktop-Cart';
import { Categories } from './desktop-Categories';
import { DropdownProvider, useDropdown } from '../dropdown-context';
import { ProfileDropdown } from './desktop-Profile';
import { ChangeLangs } from './desktop-ChangeLangs';
import DesktopCommit from "./desktop-Commit";
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { TopBar } from './header-TopBar';
import '../style.css';
function HeaderLayout() {
  const showHeader = useScrollHeader();
  const { openDropdown, setOpenDropdown } = useDropdown();
  // Determine if the overlay should be shown. Exclude 'cart' and 'none'.
  const showOverlay = openDropdown !== 'none' && openDropdown !== 'cart';

  // Close all dropdowns when header is hidden
  useEffect(() => {
    if (!showHeader && openDropdown !== 'none') {
      setOpenDropdown('none');
    }
  }, [showHeader, openDropdown, setOpenDropdown]);// Remove scroll-locking effect
  useEffect(() => {
    document.body.style.overflow = ''; // Always ensure scrolling is enabled
  }, []);

  return (
    <>
      <header
        className={`text-white max-h-[125px] h-[75px] text-[13px] relative z-50 
          bg-gradient-to-r from-red-700 via-red-600 to-red-700 shadow-lg 
          transition-all duration-500 ease-in-out hidden md:block
          ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="max-w-[1350px] mx-auto h-full header-container">
          <div className="px-4 h-full flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 header-logo">
              <div className="rounded-xl overflow-hidden">
                <Image
                  src="/images/logo/png-jpeg/Logo-Full-White.png"
                  alt="Shopsifu Logo"
                  width={125}
                  height={40}
                  priority
                  className="object-contain rounded-xl"
                />
              </div>
            </Link>
            <div className="flex-1 max-w-[1000px] flex flex-col">
              <div className="flex items-center gap-4">
                <div className="header-item transition-all duration-300 ease-in-out">
                  <Categories />
                </div>
                <div className="header-item flex-1 transition-all duration-300 ease-in-out">
                  <SearchInput />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="header-item transition-all duration-300 ease-in-out">
                <ProfileDropdown />
              </div>
              <div className="header-item transition-all duration-300 ease-in-out">
                <ChangeLangs />
              </div>
              <div className="header-item transition-all duration-300 ease-in-out">
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <DesktopCommit /> */}
      <div className="body-overlay" />
    </>
  );
}
export function Header() {
  return (
    <>
      <TopBar />
      <DropdownProvider>
        <HeaderLayout />
      </DropdownProvider>
    </>
  );
}
