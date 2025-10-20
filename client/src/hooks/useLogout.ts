import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { showToast } from '@/components/ui/toastify';
import { ROUTES } from '@/constants/route';
import { authService } from '@/services/auth/authService';
import { clearClientState } from '@/utils/stateManager';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // 1. Gọi API logout ở phía server trước
      await authService.logout({});
    } catch (error) {
      // Ghi lại lỗi API nhưng không dừng quá trình đăng xuất phía client
      console.error('API logout failed, proceeding with client-side cleanup:', error);
    } finally {
      // 2. Dọn dẹp toàn bộ trạng thái phía client bất kể API thành công hay thất bại
      await clearClientState();

      // 3. Lấy CSRF token mới để chuẩn bị cho lần đăng nhập tiếp theo
      try {
        await authService.getCsrfToken();
      } catch (error) {
        console.error('Failed to fetch new CSRF token after logout:', error);
      }

      // 4. Hiển thị thông báo thành công và điều hướng
      showToast('Đăng xuất thành công!', 'success');

      // 5. Điều hướng về trang đăng nhập bằng cách tải lại trang
      // Điều này đảm bảo dọn dẹp triệt để mọi trạng thái còn sót lại trong bộ nhớ
      window.location.href = ROUTES.AUTH.SIGNIN;
    }
  };

  return { handleLogout, loading };
}
