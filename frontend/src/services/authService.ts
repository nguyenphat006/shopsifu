//Đây là nơi sẽ tổ chức logic API end Point cho từng loại API ví dụ:
// src/services/authService.ts
import { fetcher } from "../app/utils/fetcher";

export const signIn = async (credentials: any) => {
  const response = await fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, true);

  return response;
};

export const signUp = async (credentials: any) => {
  const response = await fetcher("/users/", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, true);

  return response;
};

export const resetPassword = async (credentials: any) => {  // chưa có resetPassword
  const response = await fetcher("/users/", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, true);

  return response;
};

export const forgotPassword = async (credentials: any) => { // chưa có forgotPassword
  const response = await fetcher("/users/", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, true);

  return response;
};

export const verifyOtpEmail = async (credentials: any) => { // chưa có verifyOtp
  const response = await fetcher("/users/", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, true);

  return response;
};

export const resendVerificationEmail = async (credentials: any) => { // chưa có resendVerificationCode
  const response = await fetcher("/users/", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, true);

  return response;
};

export const verifyOtpCode = async (credentials: any) => { // chưa có verifyOtp
  const response = await fetcher("/users/", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, true);

  return response;
};

export const resendVerificationCode = async (credentials: any) => { // chưa có resendVerificationCode
  const response = await fetcher("/users/", {
    method: "POST",
    body: JSON.stringify(credentials),
  }, true);

  return response;
};