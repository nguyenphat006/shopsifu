'use client';

import { Icon } from '@iconify/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PaymentType } from '@/types/payment.interface';

type PaymentIconConfig = {
  icon: string;
  color: string;
  gradient: string;
};

type PaymentIconConfigMap = {
  [K in Lowercase<PaymentType>]: PaymentIconConfig;
};

const paymentIconConfig: PaymentIconConfigMap = {
  visa: {
    icon: 'logos:visa',
    color: '#1A1F71',
    gradient: 'from-[#1A1F71] to-[#454CA0]'
  },
  mastercard: {
    icon: 'logos:mastercard',
    color: '#FF5F00',
    gradient: 'from-[#FF5F00] to-[#F79E1B]'
  },
  jcb: {
    icon: 'logos:jcb',
    color: '#0F4C97',
    gradient: 'from-[#0F4C97] to-[#1967D2]'
  },
  unionpay: {
    icon: 'logos:unionpay',
    color: '#E21836',
    gradient: 'from-[#E21836] to-[#FF4D6A]'
  },  momo: {
    icon: 'custom:momo',  // This will be used as a flag to render the custom image
    color: '#A50064',
    gradient: 'from-[#A50064] to-[#E0156E]'
  }
};

interface PaymentIconProps {
  type: PaymentType;
  size?: number;
  className?: string;
}

export function ModernPaymentIcon({ type, size = 32, className }: PaymentIconProps) {
  const key = type.toLowerCase() as Lowercase<PaymentType>;
  const config = paymentIconConfig[key];
  if (!config) return null;

  return (    <motion.div
      whileHover={{ 
        scale: 1.03,
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative group rounded-lg bg-white border transition-all duration-300",
        "hover:shadow-[0_8px_20px_-3px_rgba(0,0,0,0.15)] hover:border-primary/30",
        className
      )}
      style={{
        '--payment-color': config.color,
      } as any}
    >
      <div className="relative h-full flex items-center justify-center overflow-hidden rounded-lg">
        <div className="flex items-center justify-center w-full p-2">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {config.icon === 'custom:momo' ? (
              <div className="flex items-center justify-center w-full h-full">
                <Image
                  src="/payment-logos/momo.png"
                  alt="MoMo"
                  width={size * 0.95}
                  height={size * 0.95}
                  className="object-contain rounded-md bg-white p-1"
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>
            ) : (
              <Icon icon={config.icon} width={size} height={size} className="object-contain my-auto relative z-10" />
            )}
          </motion.div>
        </div>
        {/* Background Gradient */}
        <motion.div
          className={cn(
            "absolute inset-0 opacity-0 bg-gradient-to-r",
            config.gradient,
            "group-hover:opacity-5 transition-opacity duration-500"
          )}
        />
        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 -skew-x-12"
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: [0.4, 0, 0.2, 1],
            delay: 0.2,
          }}
        />
        {/* Glow Border */}
        <motion.div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500"
          animate={{
            boxShadow: [
              '0 0 0 1px var(--payment-color)',
              '0 0 0 1.5px var(--payment-color)',
              '0 0 0 1px var(--payment-color)',
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        />
        {/* Inner Shadow */}
        <div className="absolute inset-0 rounded-lg shadow-inner opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>
      {/* Outer Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[var(--payment-color)] to-transparent opacity-0 group-hover:opacity-10 blur-sm rounded-lg transition-opacity duration-500" />
    </motion.div>
  );
}
