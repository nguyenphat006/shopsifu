'use client'

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function ScrollLock() {
  const pathname = usePathname()
  
  useEffect(() => {
    if (pathname === '/user') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [pathname])

  return null
}