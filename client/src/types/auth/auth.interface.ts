import { BaseResponse } from "../base.interface";
import { UserProfile } from "./profile.interface";





// A generic type for actions within a permission subject
type PermissionActions = { [action: string]: boolean };

// The structure for all permissions, based on the API response
export interface Permissions {
  User?: PermissionActions;
  Role?: PermissionActions;
  Permission?: PermissionActions;
  Profile?: PermissionActions;
  TwoFactor?: PermissionActions;
  Password?: PermissionActions;
  Session?: PermissionActions;
  all?: PermissionActions;
  // Allow for other potential keys not explicitly defined
  [key: string]: PermissionActions | undefined;
}

// LẤY DANH SÁCH QUYỀN HẠN - GET ABILITY
export interface GetAbilityResponse extends BaseResponse {
    data: {
        permissions: Permissions;
    }
}


export interface oAuthLoginResponse {
  data:{
    url: string
  }
}
// ĐĂNG XUẤT TÀI KHOẢN - LOGOUT
export interface LogoutRequest {
  refreshToken?: string
}

// ĐĂNG NHẬP TÀI KHOẢN - SIGN-IN
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse extends BaseResponse {
  data:{
    message?: string
    user?: UserProfile
  }
  verificationType?: string
}

export interface RequestDeviceResponse extends BaseResponse{
    data:{
        requiresDeviceVerification: string
        verificationType: string
        verificationRedirectUrl: string
    }
}



// ĐĂNG KÝ TÀI KHOẢN - SIGN-UP
export interface RegisterRequest {
  firstName: string
  lastName: string
  username: string
  password: string
  confirmPassword: string
  phoneNumber: string
}

export interface RegisterResponse extends BaseResponse{
  id: string
  email: string
  name: string
  phoneNumber: string
  roleId: number
  createdAt: string
  updatedAt: string
}

export interface RegisterSendRequest{
  email: string;
}


// ĐỔI MẬT KHẨU TÀI KHOẢN - RESET PASSWORD
export interface ResetPasswordSendRequest{
  email: string
}
export interface ResetPasswordRequest {
  newPassword: string
  confirmPassword: string
  revokeAllSessions?: string
}

export interface ResetPasswordResponse extends BaseResponse{
  message: string
}


// XÁC THỰC & GỬI CODE - VERIFY + SEND CODE
export interface VerifyOTPRequest {
  code: string
}

export interface VerifyOTPResponse extends BaseResponse{
  success: boolean
  data: {
    id: number;
    email: string;
    role: string;
    status: string;
    twoFactorEnabled: boolean;
    googleId: string | null;
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string | null;
    avatar: string | null;
    isDeviceTrustedInSession?: boolean;
  }
}

export interface Verify2faRequest {
  code: string
  method: string
}

export interface Verify2faResponse extends BaseResponse{
  data: {
    id: number;
    roleId: number;
    email: string;
    roleName: string;
    username: string;
    isDeviceTrustedInSession?: boolean;
  }
}

export interface ResendOTPRequest{
  code: string
}

export interface SendOTPRequest {
  code?: string
  email?: string
  type?: string
}
export interface SendOTPResponse {
  email: string
  type: string
  expiresAt: string
  createdAt: string
  message: string
}




// THIẾT LẬP 2FA - SETUP 2FA
export interface Setup2faResponse extends BaseResponse {
  data:{
    secret: string
    qrCode: string
  }
}

export interface Confirm2faRequest {
  code: string
}

export interface Confirm2faResponse {
  message: string
  data:{
    recoveryCodes:[]
  }
  
}


export interface Disable2faRequest {
  code: string
  method: string
}

export interface Disable2faResponse {
  message: string
}

// REFRESH TOKEN
export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}
