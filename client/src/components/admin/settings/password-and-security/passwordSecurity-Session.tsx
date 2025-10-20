'use client'

import { SettingTable } from '@/components/ui/settings-component/settings-table'
import { ChevronLeft, Monitor, MoreHorizontal, CheckCircle, Loader2, LogOut, Trash2, ShieldX } from 'lucide-react'
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
import { useRouter } from 'next/navigation'
import { usePasswordSecuritySession } from './usePasswordSecurity-Session'
import { Pagination } from '@/components/ui/data-table-component/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export function PasswordSecuritySession() {
  const router = useRouter()
  const {
    groupedDevices,
    loading,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    handlePageChange,
    handleLimitChange,
    isRevoking,
    handleRevokeAllSessions,
    selectedSessionIds,
    selectedDeviceIds,
    toggleSessionSelection,
    toggleDeviceSelection,
    handleRevoke,
  } = usePasswordSecuritySession()
  const [keepCurrentSession, setKeepCurrentSession] = useState(true)

  const displayedSessionsCount = groupedDevices.reduce((acc, group) => acc + group.totalSessions, 0)

  return (
    <SettingTable
      title={
        <Button variant="ghost" className="flex items-center gap-2 p-0 -ml-2 px-2" onClick={() => router.push('/admin/settings/password-and-security')}>
          <ChevronLeft className="w-5 h-5" />
          <span>Thiết bị đăng nhập</span>
        </Button>
      }
      subtitle={`${displayedSessionsCount} sessions on all devices`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="text-white justify-end" variant="destructive" disabled={isRevoking}>
                  {isRevoking ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Revoke All
                </Button>
              </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out everywhere else?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will terminate all your active sessions on other computers, phones, and tablets.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex items-center space-x-2 my-4">
                <Checkbox
                  id="keep-current-session"
                  checked={keepCurrentSession}
                  onCheckedChange={checked => setKeepCurrentSession(checked as boolean)}
                />
                <Label
                  htmlFor="keep-current-session"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep me signed in on this device
                </Label>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRevokeAllSessions(keepCurrentSession)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

            {selectedSessionIds.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isRevoking}>
                    <ShieldX className="w-4 h-4 mr-2" />
                    Revoke Selected ({selectedSessionIds.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke Selected Sessions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to revoke {selectedSessionIds.length} selected session(s). This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRevoke({ sessionIds: selectedSessionIds })}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirm Revoke
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <p className="ml-2">Loading sessions...</p>
        </div>
      )}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}
      {!loading && !error && (
        <Accordion type="multiple" className="w-full">
          {groupedDevices.map(group => (
            <AccordionItem key={group.os} value={group.os}>
              <AccordionTrigger className="flex items-center justify-between gap-4 py-4 px-6 w-full rounded-none hover:bg-gray-50 transition-colors data-[state=open]:border-b data-[state=open]:border-gray-200">
                <div className="flex items-center gap-4">
                  <Monitor className="w-6 h-6 text-gray-600 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="text-base font-semibold text-gray-900">
                      {group.os} ({group.devices.length} {group.devices.length > 1 ? 'devices' : 'device'})
                    </div>
                    <div className="text-sm text-gray-500">
                      {group.totalSessions} {group.totalSessions === 1 ? 'session' : 'sessions'}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pt-2 pb-4 bg-gray-50/50">
                {group.totalSessions > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {group.devices.map(
                      device =>
                        // Only render the device if it has active sessions
                        device.sessions &&
                        device.sessions.length > 0 && (
                          <div key={device.deviceId} className="px-6 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`device-${device.deviceId}`}
                                  checked={selectedDeviceIds.includes(device.deviceId)}
                                  onCheckedChange={() => toggleDeviceSelection(device)}
                                />
                                <div className="text-sm font-semibold text-gray-800">
                                  {device.name} ({device.browser} on {device.os})
                                </div>
                                {device.isCurrent && (
                                  <span className="px-2 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                    This Device
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="pl-4 mt-2 space-y-2">
                              {device.sessions.map(session => (
                                <div key={session.id} className="flex items-center justify-between py-2">
                                  <div className="flex items-center gap-3 flex-1">
                                    <Checkbox
                                      id={`session-${session.id}`}
                                      checked={selectedSessionIds.includes(session.id)}
                                      onCheckedChange={() => toggleSessionSelection(session.id)}
                                      disabled={session.isCurrent} // Cannot revoke current session individually
                                    />
                                    <div className="flex-1">
                                      <div className="text-sm text-gray-700">
                                        {session.location}
                                        {session.isCurrent && (
                                        <span className="text-xs text-green-600 ml-2 font-semibold">
                                          (Current Session)
                                        </span>
                                      )}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        <span>IP: {session.ip}</span> &middot;{' '}
                                        <span>Last active: {new Date(session.lastActive).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="w-8 h-8" disabled={session.isCurrent}>
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        className="text-red-600 hover:!text-red-600 hover:!bg-red-50"
                                        onClick={() => handleRevoke({ sessionIds: [session.id] })}
                                        disabled={session.isCurrent}
                                      >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Revoke session
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  <div className="px-6 py-4 text-sm text-gray-500">No active sessions on this device type.</div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {/* {!loading && !error && totalPages > 1 && (
        <div className="p-4">
          <Pagination
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalRecords={totalItems}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      )} */}
    </SettingTable>
  );
}
