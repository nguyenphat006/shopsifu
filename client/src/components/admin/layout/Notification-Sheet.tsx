"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useTranslations } from 'next-intl'
import { Bell } from 'lucide-react'

interface NotificationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationSheet({ open, onOpenChange }: NotificationSheetProps) {
  const t  = useTranslations()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-lg w-full p-0 flex flex-col rounded-md ">
        <div className="flex items-center justify-between px-8 pt-5 pb-4 border-b">
          <SheetTitle className="text-lg font-semibold">
            {t('admin.notifications.title')}
          </SheetTitle>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground border rounded px-2 py-0.5 mr-2 select-none">
              {t('admin.notifications.esc')}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-22">
          <Bell className="h-8 w-8 text-black mb-4 mt-12" />
          <div className="font-semibold text-md mb-1">
            {t('admin.notifications.emptyTitle')}
          </div>
          <div className="text-muted-foreground text-[12px] mb-12">
            {t('admin.notifications.emptyDesc')}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 