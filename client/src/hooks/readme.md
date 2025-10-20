✅ Hook là nơi bạn xử lý logic “React-specific” (dùng useState, useEffect, useSelector, useDispatch, v.v.)
❌ Hook không nên là nơi định nghĩa logic gọi API thô → cái đó phải ở /services
❌ Hook không nên lưu trữ dữ liệu → để đó cho Redux hoặc component dùng useState
Ví dụ flow của useProducts():
Component → useProducts() → productService.getAll() → trả dữ liệu
Flow của useCart():
Component → useCart() → Redux dispatch addToCart() → Redux store cập nhật
