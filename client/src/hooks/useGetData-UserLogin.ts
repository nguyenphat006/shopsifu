'use client';

import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { selectUserProfile } from '@/store/features/auth/profileSlide';
import { RootState } from '@/store/store';

/**
 * Custom hook để lấy và định dạng dữ liệu người dùng từ Redux store.
 * Hook này phải được sử dụng trong một component client.
 * @returns Một đối tượng thông tin người dùng đã được định dạng hoặc null nếu chưa đăng nhập.
 */
export const useUserData = () => {
  const user = useSelector((state: RootState) => selectUserProfile(state));

  const userInfo = useMemo(() => {
    // Nếu không có dữ liệu người dùng (chưa đăng nhập), trả về null.
    if (!user) {
      return null;
    }

    // Ghép họ và tên một cách an toàn để tiện sử dụng
    // const name = [user.firstName, user.lastName].filter(Boolean).join(' ');

    // Trả về một đối tượng mới bao gồm tất cả các thuộc tính của user và thuộc tính 'name'
    return {
      ...user,
    };
  }, [user]);

  return userInfo;
};
