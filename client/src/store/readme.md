📄 README.md

# 🧠 Redux Store Setup (Next.js + Redux Toolkit + Persist + Encryption)

Hệ thống Redux trong dự án này được cấu hình đầy đủ để hỗ trợ:

- Quản lý trạng thái xác thực (`authSlice`)
- Lưu giữ state xuyên suốt phiên làm việc với `redux-persist`
- Mã hoá dữ liệu Redux bằng `redux-persist-transform-encrypt`
- Dễ mở rộng với nhiều slice mới như: cart, UI, language, orders...

---

## 📁 Cấu trúc thư mục

src/
└── lib/
└── store/
├── store.ts
├── StoreProvider.tsx
└── features/
└── auth/
└── authSlice.ts

---

## 🔧 1. `store.ts`

### ✅ Vai trò:

- Kết hợp các slice vào root reducer
- Kết hợp `redux-persist` để lưu lại Redux state
- Mã hoá `auth` slice bằng `encryptTransform`
- Export `getStore()` để dùng được ở toàn app

### 🔐 Encryption:

```ts
const encryptor = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_REDUX_ENCRYPTION_KEY || '',
  onError: (err) => console.error('Encrypt error:', err),
});

🧩 2. StoreProvider.tsx

✅ Vai trò:

Bao bọc toàn bộ ứng dụng bằng Redux Provider

Sử dụng PersistGate để chờ state được khôi phục xong

📦 Dùng trong layout:

<StoreProvider>
  {children}
</StoreProvider>

🔐 3. authSlice.ts

✅ Quản lý:

user (object)

token (string)

Action: setCredentials, logOut, logOutAndRevertAll

🧾 Interface:

interface AuthState {
  user: { id: string; name: string } | null;
  token: string;
}

⚙️ 4. Sử dụng trong Component

📥 Đọc Redux:

const user = useSelector((state: RootState) => state.auth.user);

📤 Cập nhật Redux:

dispatch(setCredentials({ user, token }));
dispatch(logOutAndRevertAll());

✅ Tính năng sẵn có

Tính năng

Có

Quản lý token, user

✅

Lưu Redux state sau reload

✅

Mã hoá state bằng secret key

✅

Reset toàn bộ Redux khi logout

✅

Dễ mở rộng thêm slice khác

✅

🚀 Mở rộng sau này

cartSlice – quản lý giỏ hàng

uiSlice – quản lý modal/sidebar/theme

languageSlice – quản lý đa ngôn ngữ

orderSlice – theo dõi đơn hàng
```
