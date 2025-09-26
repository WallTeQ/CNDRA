import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { ApiResponse,  
  SignupRequestData, 
  VerifyOtpData,
   CompleteRegistrationData, 
   LoginData, 
    AuthUser, 
    AuthResponse } 
     from "../types/api";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
const TOKEN_KEY = "auth_token";
const TEMP_TOKEN_KEY = "temp_auth_token";

export const tokenManager = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getTempToken: (): string | null => localStorage.getItem(TEMP_TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  setTempToken: (token: string): void =>
    localStorage.setItem(TEMP_TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  removeTempToken: (): void => localStorage.removeItem(TEMP_TOKEN_KEY),
  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TEMP_TOKEN_KEY);
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    const tempToken = tokenManager.getTempToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (tempToken && config.url?.includes("/auth/signup/complete")) {
      config.headers.Authorization = `Bearer ${tempToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenManager.clearAll();
      // Redirect to login page
      if (
        window.location.pathname !== "/login" &&
        !window.location.pathname.startsWith("/signup")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


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

// Documents API
export const documentsApi = {
  getAll: (params?: any): Promise<ApiResponse<any[]>> =>
    api.get("/documents", { params }).then((res) => res.data),

  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`/documents/${id}`).then((res) => res.data),

  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("/documents", data).then((res) => res.data),

  update: (id: string, data: any): Promise<ApiResponse<any>> =>
    api.put(`/documents/${id}`, data).then((res) => res.data),

  delete: (id: string): Promise<ApiResponse> =>
    api.delete(`/documents/${id}`).then((res) => res.data),
};

// Users API
export const usersApi = {
  // getAll: (params?: any): Promise<ApiResponse<any[]>> =>
  //   api.get("/users", { params }).then((res) => res.data),

  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`auth/users/${id}`).then((res) => res.data),

  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("auth/users", data).then((res) => res.data),

  // update: (id: string, data: any): Promise<ApiResponse<any>> =>
  //   api.put(`auth/users/${id}`, data).then((res) => res.data),

  // delete: (id: string): Promise<ApiResponse> =>
  //   api.delete(`auth/users/${id}`).then((res) => res.data),
};

export default api;
