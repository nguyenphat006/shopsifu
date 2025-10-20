import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { authService } from '@/services/auth/authService';
import { setPermissions } from '@/store/features/auth/profileSlide';
import { AppDispatch } from '@/store/store';

/**
 * Custom hook to fetch and manage user abilities (permissions).
 * It handles loading and error states and dispatches the permissions to the Redux store.
 */
export const useGetAbility = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAbility = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getAbility();
      if (response && response.data && response.data.permissions) {
        dispatch(setPermissions(response.data.permissions));
      } else {
        // This case might happen if the API response is not as expected
        throw new Error('Invalid response structure for permissions');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch abilities';
      setError(errorMessage);
      console.error('useGetAbility Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { fetchAbility, loading, error };
};
