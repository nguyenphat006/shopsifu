'use client'

import { useEffect } from 'react';
import { authService } from '@/services/auth/authService';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        await authService.getCsrfToken();
      } catch (error) {
        console.error('Failed to get CSRF token:', error);
      }
    };

    getCsrfToken();
  }, []);

  return <>{children}</>;
} 