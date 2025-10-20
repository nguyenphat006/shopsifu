'use client'

import { ChevronLeft, Monitor, MoreHorizontal, CheckCircle } from 'lucide-react'
import { sessionMockData } from './security-Mockdata'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import {t} from "i18next"

export function PasswordSecuritySession() {
  const devices = sessionMockData;
  const totalSessions = devices.reduce((total, device) => total + device.sessions.length, 0);

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">{t('user.account.security.loggedInDevices')}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {t('user.account.security.total')} {totalSessions} {t('user.account.security.active')} {devices.length} {t('user.account.security.device')}
      </p>

      {/* Danh sách thiết bị */}
      <Accordion type="single" collapsible className="w-full">
        {devices.map((device, deviceIndex) => (
          <AccordionItem
            key={device.deviceId || deviceIndex}
            value={device.deviceId || `device-${deviceIndex}`}
          >
            <AccordionTrigger className="flex items-center justify-between gap-4 py-4 px-0 w-full hover:bg-gray-50 transition-colors data-[state=open]:border-b data-[state=open]:border-gray-200">
              <div className="flex items-center gap-4">
                <Monitor className="w-6 h-6 text-gray-600 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="text-base font-semibold text-gray-900">{device.deviceName}</div>
                  <div className="text-sm text-gray-500">{device.sessions.length} {t('user.account.security.loginSession')}</div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-4">
              <div className="divide-y divide-gray-100">
                {device.sessions.map((session, sessionIndex) => (
                  <div
                    key={session.sessionId || sessionIndex}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{session.deviceName}</div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          {session.isCurrent && <CheckCircle className="w-3 h-3 text-blue-500" />}
                          <span>{session.browser}</span>
                        </div>
                        <div>{session.location}</div>
                        <div>{session.lastActive}</div>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 ml-2">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { /* TODO: handle terminate session */ }}>
                            {t('user.account.security.deleteSession')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
