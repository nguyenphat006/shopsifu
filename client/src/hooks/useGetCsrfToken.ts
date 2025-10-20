import { useCallback, useState } from 'react';
import { authService } from '@/services/auth/authService';

export const useGetCsrfToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCsrfToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.getCsrfToken();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get CSRF token'));
      console.error('Error getting CSRF token:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getCsrfToken,
    isLoading,
    error,
  };
};
