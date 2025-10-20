import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { UserProfile } from '@/types/auth/profile.interface';
import { Permissions } from '@/types/auth/auth.interface';

// Define a type for the slice state
interface ProfileState {
  data: UserProfile | null;
  permissions: Permissions | null;
}

// Define the initial state
const initialState: ProfileState = {
  data: null,
  permissions: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      // Merge new data into existing user state, or set new user if null
      state.data = state.data ? { ...state.data, ...action.payload } : action.payload as UserProfile;
    },
    setPermissions: (state, action: PayloadAction<Permissions>) => {
      state.permissions = action.payload;
    },
    clearProfile: (state) => {
      state.data = null;
      state.permissions = null;
    },
  },
});

// Export actions
export const { setProfile, setPermissions, clearProfile } = profileSlice.actions;

// Selector to get the user profile from the state
export const selectUserProfile = (state: RootState) => state.profile.data;

// Selector to get the user permissions from the state
export const selectUserPermissions = (state: RootState) => state.profile.permissions;

// Export the reducer
export default profileSlice.reducer;