import { api } from "./config";
import "./interceptor";
import {
  ApiResponse,
  SignupRequestData,
  VerifyOtpData,
  CompleteRegistrationData,
  LoginData,
  AuthUser,
  AuthResponse,
} from "../../types/api";

export const authApi = {
  // Step 1: Request OTP
  requestOtp: (data: SignupRequestData): Promise<ApiResponse> =>
    api.post("/auth/signup/request-otp", data).then((res) => res.data),

  // Step 2: Verify OTP
  verifyOtp: (data: VerifyOtpData): Promise<ApiResponse<{ token: string }>> =>
    api.post("/auth/signup/verify-otp", data).then((res) => res.data),

  // Step 3: Complete Registration
  completeRegistration: (
    data: CompleteRegistrationData
  ): Promise<ApiResponse<AuthResponse>> =>
    api.post("/auth/signup/complete", data).then((res) => res.data),

  // Login
  login: (data: LoginData): Promise<ApiResponse<AuthResponse>> =>
    api.post("/auth/login", data).then((res) => res.data),

  // Get Profile
  getProfile: (): Promise<ApiResponse<AuthUser>> =>
    api.get("/auth/profile").then((res) => res.data),

  // Logout
  logout: (): Promise<ApiResponse> =>
    api.post("/auth/logout").then((res) => res.data),
};
