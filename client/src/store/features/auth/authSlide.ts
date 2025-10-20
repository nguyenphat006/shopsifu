import { createAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '@/store/store';

export const revertAll = createAction('REVERT_ALL');

export interface AuthState {
  user: { id: string; name: string } | null;
  accessToken: string; // access token
  refreshToken: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: '',
  refreshToken: '',
};

const authSlice = createSlice({
  name: 'authShopsifu',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      console.log('action.payload', action.payload);
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken; // access token
      state.refreshToken = action.payload.refreshToken;
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = '';
      state.refreshToken = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});


export const { setCredentials, logOut } = authSlice.actions;

export const logOutAndRevertAll = () => (dispatch: AppDispatch) => {
  dispatch(logOut());
  dispatch(revertAll());
};

export default authSlice.reducer;
