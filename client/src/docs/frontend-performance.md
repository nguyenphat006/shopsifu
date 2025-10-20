# Hiệu Suất Frontend và Xử Lý Các Vấn Đề Phổ Biến

## Vấn Đề `_next/js_original-stack-frames`

### Nguyên Nhân

Các yêu cầu `_next/js_original-stack-frames` xuất hiện khi Next.js phát hiện ra lỗi trong quá trình render hoặc khi có vấn đề với React. Cụ thể:

1. **Error Overlay**: Đây là một phần của Fast Refresh trong Next.js để hiển thị lỗi khi phát triển. Khi có lỗi, nó gửi yêu cầu để lấy thông tin stack trace.

2. **Kết hợp với API chậm**: Khi các API mất quá nhiều thời gian để phản hồi, React có thể kích hoạt một số cơ chế bảo vệ, dẫn đến việc hiển thị error overlay.

3. **React StrictMode**: Trong chế độ dev, React StrictMode sẽ render component hai lần để phát hiện các vấn đề tiềm ẩn. Điều này có thể làm trầm trọng thêm vấn đề khi kết hợp với API chậm.

4. **Suspense và Error Boundary**: Khi sử dụng Suspense hoặc gặp lỗi không được bắt đúng cách, Next.js sẽ hiển thị error overlay.

### Giải Pháp Đã Triển Khai

Chúng ta đã triển khai các giải pháp sau để giảm thiểu vấn đề:

1. **Timeout và AbortSignal**: Thêm timeout 8 giây và AbortSignal cho tất cả các yêu cầu API để tránh chờ đợi vô thời hạn.
   
2. **Memoized Callbacks**: Sử dụng `useCallback` và `useRef` để đảm bảo các hàm callback ổn định qua các lần render.

3. **Disable StrictMode**: Đã tắt StrictMode trong `next.config.ts` để giảm số lượng render kép.

### Giải Pháp Bổ Sung

Nếu vấn đề vẫn tiếp diễn, xem xét:

1. **Custom Error Boundary**: Thêm Error Boundary để bắt và xử lý lỗi đúng cách, ngăn không cho Next.js hiển thị overlay lỗi mặc định.

2. **Tối ưu hóa Webpack**: Điều chỉnh cấu hình webpack để tắt một số plugin không cần thiết trong môi trường phát triển.

3. **Production Preview**: Sử dụng `next build && next start` để kiểm tra trong môi trường giống production hơn, không có các công cụ phát triển.

4. **Sử dụng Suspense có kiểm soát**: Bọc các phần tải dữ liệu bằng Suspense với các fallback phù hợp.

5. **Xem xét React Query hoặc SWR**: Các thư viện quản lý trạng thái và bộ nhớ đệm như React Query hoặc SWR có thể giúp quản lý dữ liệu hiệu quả hơn.

## Tối Ưu Hóa DataTable và API Calls

### Các Kỹ Thuật Đã Triển Khai

1. **Debounce Search**: Tìm kiếm với debounce để giảm số lượng yêu cầu API.

2. **Abort Previous Requests**: Hủy yêu cầu trước đó khi có yêu cầu mới.

3. **Request Timeout**: Tự động hủy yêu cầu nếu kéo dài quá 8 giây.

4. **Memoized Callback**: Đảm bảo các hàm callback ổn định để tránh gọi API không cần thiết.

5. **Optimistic UI Updates**: Cập nhật UI trước khi yêu cầu API hoàn thành (đối với create/update/delete).

### Khuyến Nghị Bổ Sung

1. **Lazy Loading Modules**: Xem xét tải từng module theo nhu cầu thông qua Next.js dynamic imports.

2. **Pagination với Bộ Nhớ Đệm**: Lưu kết quả đã tải để tránh tải lại khi người dùng quay lại trang đã xem.

3. **State Management**: Xem xét Redux hoặc Zustand nếu ứng dụng phức tạp để quản lý trạng thái tốt hơn.

4. **API Connection Pool**: Đảm bảo máy chủ có kết nối pool đủ lớn để xử lý nhiều yêu cầu đồng thời.

5. **Monitoring & Analytics**: Thêm công cụ giám sát như Sentry để theo dõi lỗi frontend và hiệu suất API.

## Cấu Hình Hữu Ích

### Tắt StrictMode Trong Development

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ...other config
  reactStrictMode: false, // Tắt strict mode trong development
};
```

### Custom Error Boundary

```tsx
// components/ErrorBoundary.tsx
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong. Please try again.</div>;
    }

    return this.props.children;
  }
}
```

### Thêm Memory Caching để Tránh API Lặp Lại

```typescript
// Ví dụ với một cache đơn giản
const apiCache = new Map();

export async function cachedApiCall(key, apiFn) {
  if (apiCache.has(key)) {
    return apiCache.get(key);
  }
  
  const result = await apiFn();
  apiCache.set(key, result);
  return result;
}
```
