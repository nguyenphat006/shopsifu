import { BaseResponse } from "../base.interface";

/**
 * Kiểu dữ liệu người dùng đã được làm phẳng, thân thiện với client.
 * Đây là mô hình chuẩn để sử dụng trong toàn bộ ứng dụng (Redux, components, hooks).
 */
export interface Address {
  id: string;
  name: string;
  recipient?: string;
  phoneNumber?: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  addressType: "HOME" | "OFFICE";
  isDefault: boolean;
  provinceId: number;
  districtId: number;
  wardCode: string;
  createdById: string;
  updatedById: string | null;
  deletedById: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ---------------------- CREATE ---------------------- */
export interface AddAddressRequest {
  name: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  addressType: "HOME" | "OFFICE";
  phoneNumber?: string;
  recipient?: string;
  isDefault: boolean;
  // Thêm các trường mới
  provinceId: number;
  districtId: number;
  wardCode: string;
}

export interface AddAddressResponse {
  message: string;
  data: Address;
}

/* ---------------------- UPDATE ---------------------- */
export interface UpdateAddressRequest {
  name: string;
  province?: string;
  district?: string;
  ward?: string;
  street?: string;
  addressType?: "HOME" | "OFFICE";
  phoneNumber?: string;
  recipient?: string;
  isDefault?: boolean;
  // Thêm các trường mới
  provinceId?: number;
  districtId?: number;
  wardCode?: string;
}

export interface UpdateAddressResponse {
  message: string;
  data: Address;
}

/* ---------------------- GET ---------------------- */
export interface AddressGetByIdResponse {
  message: string;
  data: Address;
}

export interface AddressGetAllResponse {
  message: string;
  data: Address[];
}

/* ---------------------- DELETE ---------------------- */
export interface DeleteAddressResponse {
  message: string;
}


export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
    permissions: any[]; // hoặc định nghĩa kỹ hơn nếu cần
  };
  status: string;
  twoFactorEnabled: boolean;
  googleId: string | null;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  addresses: Address[];
  statistics: {
    totalOrders: number;
    totalSpent: number;
    memberSince: string;
  };
}

/**
 * Kiểu dữ liệu gốc trả về từ API get-profile.
 * Chỉ sử dụng trong service và hook `useGetProfile` để chuyển đổi.
 */
export interface UserProfileResponse extends BaseResponse {
  data: {
    id: string;
    email: string;
    name: string;
    role: {
      id: number;
      name: string;
      permissions: any[]; // hoặc định nghĩa kỹ hơn nếu cần
    };
    avatar: string | null;
    status: string;
    twoFactorEnabled: boolean;
    googleId: string | null;
    createdAt: string;
    updatedAt: string;
    phoneNumber: string | null;
    userProfile?: {
      firstName: string;
      lastName: string;
      username: string;
      avatar: string | null;
    };
    addresses: Address[];
    statistics: {
      totalOrders: number;
      totalSpent: number;
      memberSince: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string | null;
  avatar?: string | null;
}

export interface UpdateProfileResponse extends BaseResponse {
  data: {
    id: number;
    email: string;
    name: string;
    role: string;
    status: string;
    avatar: string | null;
    twoFactorEnabled: boolean;
    googleId: string | null;
    createdAt: string;
    updatedAt: string;
    userProfile: {
      firstName: string;
      lastName: string;
      username: string;
      phoneNumber: string | null;
      avatar: string | null;
    };
  };
}

// ĐỔI MẬT KHẨU TÀI KHOẢN ĐÃ ĐĂNG NHẬP - CHANGE PASSWORD
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  revokeOtherSessions?: boolean;
}
export interface ChangePasswordResponse extends BaseResponse {
  message: string;
  verificationType?: string;
}

//Đổi mật khẩu profile
export interface ChangePasswordProfileRequest {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
  revokeOtherSessions?: boolean;
}
export interface ChangePasswordProfileResponse extends BaseResponse {
  message: string;
  verificationType?: string;
}
