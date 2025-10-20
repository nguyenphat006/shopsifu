'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  onClick: () => void
}

export const HamburgerButton = ({ onClick }: Props) => (
  <Button onClick={onClick} className="fixed top-20 left-4 z-20 p-2 text-gray-900 hover:text-primary md:hidden">
    <Menu className="w-6 h-6" />
  </Button>
)
