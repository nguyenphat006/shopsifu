'use client'

import { useState, useEffect, useCallback } from 'react'
import { sessionService } from '@/services/auth/sessionService'
import { SessionGetALLResponse, Device, SessionRevokeRequest } from '@/types/auth/session.interface'
import { toast } from 'sonner'
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/route';

export interface GroupedDevice {
  os: string
  totalSessions: number
  devices: Device[]
}

export const usePasswordSecuritySession = () => {
  const [groupedDevices, setGroupedDevices] = useState<GroupedDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // Default limit
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [isRevoking, setIsRevoking] = useState(false)
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([])
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<number[]>([])
  const router = useRouter();

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      // The PaginationRequest interface was modified to represent response metadata.
      // We pass page and limit directly, casting to `any` to bypass the type mismatch
      // as the backend expects top-level `page` and `limit` query parameters.
      const response = await sessionService.getAll({ page, limit } as any)

      // The response data is now strictly typed as Device[]
      const devicesFromApi: Device[] = response.data || []

      const groups: { [key: string]: GroupedDevice } = {}

      devicesFromApi.forEach(device => {
        const osKey = device.os || 'Unknown'
        if (!groups[osKey]) {
          groups[osKey] = { os: osKey, totalSessions: 0, devices: [] }
        }
        groups[osKey].devices.push(device)
        // Use the totalSessions from the device data, or count the sessions array
        groups[osKey].totalSessions += device.totalSessions || device.sessions?.length || 0
      })

      setGroupedDevices(Object.values(groups))

      if (response.metadata) {
        setTotalPages(response.metadata.totalPages || 0)
        setTotalItems(response.metadata.totalItems || 0)
      }
    } catch (err) {
      setError('Failed to fetch session data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to page 1 when limit changes
  }

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessionIds(prev =>
      prev.includes(sessionId) ? prev.filter(id => id !== sessionId) : [...prev, sessionId]
    )
  }

  const toggleDeviceSelection = (device: Device) => {
    const deviceId = device.deviceId
    const sessionIds = device.sessions.map(s => s.id)
    const isDeviceSelected = selectedDeviceIds.includes(deviceId)

    setSelectedDeviceIds(prev =>
      isDeviceSelected ? prev.filter(id => id !== deviceId) : [...prev, deviceId]
    )

    // When selecting a device, select all its sessions. When deselecting, deselect them.
    setSelectedSessionIds(prev => {
      const otherSessionIds = prev.filter(id => !sessionIds.includes(id))
      return isDeviceSelected ? otherSessionIds : [...otherSessionIds, ...sessionIds]
    })
  }

  const handleRevoke = async (params: SessionRevokeRequest) => {
    setIsRevoking(true)
    try {
      const response = await sessionService.revoke(params)
      toast.success(response.message || 'Successfully revoked selected items.')
      // Clear selections and refetch
      setSelectedSessionIds([])
      setSelectedDeviceIds([])
      await fetchSessions()
    } catch (error: any) {
      const errorMessage = parseApiError(error)
      toast.error(errorMessage)
    } finally {
      setIsRevoking(false)
    }
  }

  async function handleRevokeAllSessions(excludeCurrent: boolean) {
    setIsRevoking(true)
    try {
      const response = await sessionService.revokeAll({ excludeCurrentSession: excludeCurrent })
      if (response.verificationType === 'OTP') {
        router.push(`${ROUTES.AUTH.VERIFY_2FA}?type=OTP&revokeAll=true`)
        // showToast(response.message, 'info')
        return
      }
      if (response.verificationType === '2FA') {
        router.push(`${ROUTES.AUTH.VERIFY_2FA}?type=TOTP&revokeAll=true`)
        // showToast(response.message, 'info')
        return
      }

      await fetchSessions()
    } catch (error: any) {
      const errorMessage = parseApiError(error)
      toast.error(errorMessage)
    } finally {
      setIsRevoking(false)
    }
  }

  return {
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
    // Selections
    selectedSessionIds,
    selectedDeviceIds,
    toggleSessionSelection,
    toggleDeviceSelection,
    handleRevoke,
  }
}