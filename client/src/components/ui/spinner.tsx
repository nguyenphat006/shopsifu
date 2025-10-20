'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function Spinner({ size = 'default', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin text-muted-foreground',
        {
          'h-4 w-4': size === 'sm',
          'h-5 w-5': size === 'default',
          'h-6 w-6': size === 'lg',
        },
        className
      )}
    />
  );
}
