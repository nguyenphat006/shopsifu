import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { profileService } from '@/services/auth/profileService';
import { setProfile, clearProfile } from '@/store/features/auth/profileSlide';
import { UserProfile, UserProfileResponse } from '@/types/auth/profile.interface';
import { toast } from 'react-toastify';

export const useGetProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    setLoading(true);
    setError(null);
    try {
      const response: UserProfileResponse = await profileService.getProfile();
      // console.log('PROFILE RESPONSE:', response);

      // Validate response data
      if (!response?.data) {
        throw new Error('Invalid profile data received');
      }

      // Safely extract and flatten profile data with optional chaining
      const flattenedProfile: UserProfile = {
        id: response.data?.id,
        email: response.data?.email,
        role: response.data?.role,
        status: response.data?.status,
        name: response.data?.name,
        twoFactorEnabled: response.data?.twoFactorEnabled ?? false,
        googleId: response.data?.googleId ?? null,
        createdAt: response.data?.createdAt,
        updatedAt: response.data?.updatedAt,
        firstName: response.data?.userProfile?.firstName ?? '',
        lastName: response.data?.userProfile?.lastName ?? '',
        username: response.data?.userProfile?.username ?? '',
        phoneNumber: response.data?.phoneNumber ?? null,
        avatar: response.data?.avatar ?? '',
        addresses: response.data?.addresses,
        statistics: response.data?.statistics
      };

      // Validate required fields
      if (!flattenedProfile.id || !flattenedProfile.email) {
        throw new Error('Missing required profile data');
      }

      dispatch(setProfile(flattenedProfile));
      return flattenedProfile;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch profile';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Clear profile on critical errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        dispatch(clearProfile());
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { fetchProfile, loading, error };
};
