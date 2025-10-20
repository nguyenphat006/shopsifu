import Cookies from 'js-cookie';
import { logOut } from '@/store/features/auth/authSlide';
import { clearProfile } from '@/store/features/auth/profileSlide';
import { getStore } from '@/store/store';

/**
 * Hàm tiện ích để dọn dẹp toàn bộ trạng thái phía client.
 * Có thể được gọi từ bất kỳ đâu, không cần trong React component.
 */
export async function clearClientState() {
  console.log('Bắt đầu dọn dẹp toàn bộ trạng thái ứng dụng...');
  // Lấy store và persistor trực tiếp, không cần hook
  const { store, persistor } = getStore();

  // 1. Dọn dẹp Redux state bằng cách dispatch actions
  store.dispatch(logOut());
  store.dispatch(clearProfile());
  console.log('Trạng thái Redux đã được dọn dẹp.');

  // 2. Dọn dẹp Redux Persist
  try {
    await persistor.purge();
    console.log('Redux Persist đã được dọn dẹp.');
  } catch (error) {
    console.error('Lỗi khi dọn dẹp Redux Persist:', error);
  }

  // 3. Dọn dẹp cookies ngoại trừ XSRF-TOKEN
  const allCookies = Cookies.get();
  for (const cookieName in allCookies) {
    if (cookieName !== 'csrf_token') {
      Cookies.remove(cookieName, { path: '/' });
    }
  }
  console.log('Cookies đã được dọn dẹp (ngoại trừ csrf_token).');

  // 4. Dọn dẹp localStorage
  if (typeof window !== 'undefined') {
    localStorage.clear();
    console.log('localStorage đã được dọn dẹp.');
  }

  // 5. Dọn dẹp sessionStorage
  if (typeof window !== 'undefined') {
    sessionStorage.clear();
    console.log('sessionStorage đã được dọn dẹp.');
  }

  console.log('Toàn bộ trạng thái client đã được dọn dẹp hoàn tất.');
}