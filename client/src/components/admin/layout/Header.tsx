'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Bell,
  Search,
  Settings,
  User,
  ChevronDown,
  Store,
  Globe,
  LogOut,
  Menu,
  Check,
} from 'lucide-react'
import { useResponsive } from '@/hooks/useResponsive'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useLogout } from '@/hooks/useLogout'
import { Button } from '@/components/ui/button'
import { useChangeLang } from '@/hooks/useChangeLang'
import { SearchItem } from './SearchItem'
import { useTranslations } from 'next-intl'
import { NotificationSheet } from './Notification-Sheet'
import { useState } from 'react'

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { isMobile } = useResponsive()
  const { handleLogout, loading: logoutLoading } = useLogout()
  const { changeLanguage, currentLangName, currentSelectedLang } = useChangeLang()
  const t  = useTranslations()
  const [notificationOpen, setNotificationOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 h-16 z-30">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Logo + Hamburger */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button onClick={onToggleSidebar} className="text-gray-700 bg-white">
              <Menu className="w-6 h-6" />
            </Button>
          )}
          <Link href="/admin" className="items-center hidden lg:flex">
            <Image 
              src="/images/logo/png-jpeg/Logo-Full-Red.png" 
              alt="Shopsifu Logo" 
              width={116} 
              height={66} 
              className="mr-2"
            />
          </Link>
        </div>

        {/* Search bar */}
        {!isMobile && (
          <SearchItem />
        )}

        {/* Right section */}
        <div className="flex items-center space-x-4">
          <Button className="p-2 rounded-full hover:bg-gray-100 relative bg-[#fff]" onClick={() => setNotificationOpen(true)} aria-label={t('admin.notifications.title')}>
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 bg-red-600 rounded-full w-2 h-2"></span>
          </Button>

          {/* Dropdown Profile */}
          {/* {
            isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer space-x-2 px-2 py-1 hover:bg-gray-100 rounded-md">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  Hello, tung63soi
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 mr-4">
              <div className="flex flex-col items-center py-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-sm font-medium">tung63soi</p>
              </div>
              
              <DropdownMenuItem>
                <Store className="w-4 h-4 mr-2" />
                {t('admin.profileDropdown.shopProfile')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2 text-gray-500" />
                {t('admin.profileDropdown.shopSettings')}
              </DropdownMenuItem>
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Globe className="w-4 h-4 mr-2" />
                  <span>Ngôn ngữ: {currentLangName}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => changeLanguage('vi')}>
                    <div className="flex items-center justify-between w-full">
                      <span>Tiếng Việt</span>
                      {currentSelectedLang === 'vi' && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    <div className="flex items-center justify-between w-full">
                      <span>English</span>
                      {currentSelectedLang === 'en' && <Check className="w-4 h-4 text-green-500" />}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              

              <DropdownMenuItem 
                className="text-red-600" 
                onClick={handleLogout} 
                disabled={logoutLoading}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {logoutLoading ? t('admin.profileDropdown.logging out') : t('admin.profileDropdown.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            )
          } */}
          <NotificationSheet open={notificationOpen} onOpenChange={setNotificationOpen} />
        </div>
      </div>
    </header>
  )
}