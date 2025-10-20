// src/contexts/UserMobileHeaderContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type UserMobileHeaderContextType = {
  title: string
  setTitle: (value: string) => void
}

const UserMobileHeaderContext = createContext<UserMobileHeaderContextType | undefined>(undefined)

export const UserMobileHeaderProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState('')

  return (
    <UserMobileHeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </UserMobileHeaderContext.Provider>
  )
}

export const useUserMobileHeader = () => {
  const ctx = useContext(UserMobileHeaderContext)
  if (!ctx) throw new Error('useUserMobileHeader must be used within UserMobileHeaderProvider')
  return ctx
}
