import { BaseResponse, PaginationRequest } from '../base.interface'

// Defines the structure for a single login session
export interface Session {
  id: string
  createdAt: string
  lastActive: string
  ip: string
  location: string
  browser: string
  browserVer: string
  app: string
  os: string
  osVer: string
  type: string
  active: boolean
  inactiveDuration: string
  isCurrent: boolean
}

// Defines the structure for a device, which can have multiple sessions
export interface Device {
  deviceId: number
  name: string
  type: string
  os: string
  osVer: string
  browser: string
  browserVer: string
  trusted: boolean
  trustExp: string | null
  lastActive: string
  location: string
  activeSessions: number
  totalSessions: number
  isCurrent: boolean
  status: string
  riskLevel: string
  daysSinceLastUse: number
  sessions: Session[]
}

// Defines the response structure for the API call that gets all sessions
export interface SessionGetALLResponse extends BaseResponse, PaginationRequest {
  data: Device[]
}

// Interfaces for revoking sessions
export interface SessionRevokeAllRequest {
  excludeCurrentSession?: boolean
}

export interface SessionRevokeAllResponse extends BaseResponse {
    verificationType: string;
}

export interface SessionRevokeRequest {
  sessionIds?: string[]
  deviceIds?: number[]
  excludeCurrentSession?: string
}

export interface SessionRevokeResponse extends BaseResponse {}