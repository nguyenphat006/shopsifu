'use client';

import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { logOut } from '@/store/features/auth/authSlide';
import { clearProfile } from '@/store/features/auth/profileSlide';
import { AppDispatch, getStore } from '@/store/store';
import { useCallback } from 'react';

/**
 * Custom hook để cung cấp một hàm để dọn dẹp toàn bộ trạng thái của ứng dụng,
 * bao gồm trạng thái Redux và tất cả cookie của ứng dụng.
 */
export function useClearGlobalState() {
  const dispatch = useDispatch<AppDispatch>();

  const clearState = useCallback(async () => {
    console.log('Bắt đầu dọn dẹp toàn bộ trạng thái ứng dụng...');

    // 1. Dọn dẹp Redux state bằng cách dispatch actions
    dispatch(logOut());
    dispatch(clearProfile());
    console.log('Trạng thái Redux đã được dọn dẹp.');

    // 2. Dọn dẹp Redux Persist (trạng thái lưu trữ cục bộ)
    try {
      const { persistor } = getStore();
      await persistor.purge();
      console.log('Redux Persist đã được dọn dẹp.');
    } catch (error) {
      console.error('Lỗi khi dọn dẹp Redux Persist:', error);
    }

    // 3. Dọn dẹp tất cả cookies ngoại trừ xsrf-token
    const allCookies = Cookies.get();
    for (const cookieName in allCookies) {
      if (cookieName !== 'XSRF-TOKEN') {
        Cookies.remove(cookieName, { path: '/' }); // Đảm bảo xóa cookie trên toàn bộ path
      }
    }
    console.log('Tất cả cookies ngoại trừ XSRF-TOKEN đã được xóa.');

  }, [dispatch]);

  return { clearState };
}
