'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useCheckout } from './hooks/useCheckout'
import Link from 'next/link'
import { ShoppingCart, Banknote, Info } from 'lucide-react'

export type CheckoutStep = 'cart' | 'information' | 'payment'

interface CheckoutStepsProps {
  activeStep: CheckoutStep
  onStepChange?: (step: CheckoutStep) => void
  className?: string
}

interface StepItem {
  id: CheckoutStep
  label: string
  href?: string
  icon?: React.ElementType
}

export function CheckoutSteps({
  activeStep,
  onStepChange,
  className,
}: CheckoutStepsProps) {
  const { state } = useCheckout()
  const [canNavigateToPayment, setCanNavigateToPayment] = useState(false)

  const steps: StepItem[] = [
    { id: 'cart', label: 'Giỏ hàng', href: '/cart', icon: ShoppingCart },
    { id: 'information', label: 'Thông tin', icon: Info },
    { id: 'payment', label: 'Thanh toán', icon: Banknote },
  ]

  useEffect(() => {
    if (
      state.receiverInfo?.name &&
      state.receiverInfo?.phone &&
      state.receiverInfo?.address
    ) {
      setCanNavigateToPayment(true)
    } else {
      setCanNavigateToPayment(false)
    }
  }, [state.receiverInfo])

  const handleStepClick = (step: CheckoutStep) => {
    if (step === 'payment' && !canNavigateToPayment) return
    if (step === 'cart') return
    onStepChange?.(step)
  }

  return (
    <div className={cn('flex items-center justify-center lg:justify-start', className)}>
      {steps.map((step, index) => {
        const isActive = activeStep === step.id
        const isDisabled = step.id === 'payment' && !canNavigateToPayment
        const isCartStep = step.id === 'cart'

        const commonClass = cn(
          'flex items-center gap-2 px-3 py-1.5 lg:py-2 rounded-full transition-colors text-sm lg:text-base',
          isActive
            ? 'text-primary bg-primary/10 border border-primary font-medium'
            : isDisabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:text-gray-900'
        )

        return (
          <div key={step.id} className="flex items-center">
            {index > 0 && (
              <div className="w-8 lg:w-10 h-[2px] bg-gray-300 mx-2 lg:mx-3"></div>
            )}
            {isCartStep ? (
              <Link href="/cart" className={commonClass}>
                {step.icon && <step.icon className="h-4 w-4 lg:h-4.5 lg:w-4.5" />}
                <span className="hidden sm:inline">{step.label}</span>
              </Link>
            ) : (
              <button
                onClick={() => handleStepClick(step.id)}
                disabled={isDisabled}
                className={commonClass}
              >
                {step.icon && <step.icon className="h-4 w-4 lg:h-4.5 lg:w-4.5" />}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
