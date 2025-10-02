import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  ApiResponse,
  SignupRequestData,
  VerifyOtpData,
  CompleteRegistrationData,
  LoginData,
  AuthUser,
  AuthResponse,
} from "../types/api";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, 
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

// ✅ Public endpoints that should NOT have Authorization headers
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/signup/request-otp",
  "/auth/signup/verify-otp",
];

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    const tempToken = tokenManager.getTempToken();

    // ✅ Check if this is a public endpoint
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // ✅ Only add Authorization header if NOT a public endpoint
    if (!isPublicEndpoint) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (tempToken && config.url?.includes("/auth/signup/complete")) {
        config.headers.Authorization = `Bearer ${tempToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("API error:", error.response?.status, error.config?.url);
    if (error.response?.status === 401) {
      console.log("401 detected - clearing tokens and redirecting");
      // Only clear tokens and redirect if we're not already on public pages
      const isPublicPage = window.location.pathname === "/login" || 
                          window.location.pathname.startsWith("/signup");
      
      if (!isPublicPage) {
        tokenManager.clearAll();
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

// Records API
export const recordsApi = {
  getAll: (params?: any): Promise<ApiResponse<any[]>> =>
    api.get('/records', { params }).then(res => res.data),

  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`/records/${id}`).then(res => res.data),

  create: (data: FormData | any): Promise<ApiResponse<any>> => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return api.post('/records', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.data);
    }
    // Handle regular JSON data
    return api.post('/records', data).then(res => res.data);
  },

  update: (id: string, data: FormData | any): Promise<ApiResponse<any>> => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return api.put(`/records/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.data);
    }
    // Handle regular JSON data
    return api.put(`/records/${id}`, data).then(res => res.data);
  },

  delete: (id: string): Promise<ApiResponse> =>
    api.delete(`/records/${id}`).then(res => res.data),

  getRestricted: (): Promise<ApiResponse<any[]>> =>
    api.get('/records/restricted').then(res => res.data),

  getConfidential: (): Promise<ApiResponse<any[]>> =>
    api.get('/records/confidential').then(res => res.data),
};

// Users API
export const usersApi = {
  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`auth/users/${id}`).then((res) => res.data),

  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("auth/users", data).then((res) => res.data),
};

//departments API
export const departmentsApi = {
  getAll: (params?: any): Promise<ApiResponse<any[]>> =>
    api.get("/departments", { params }).then((res) => res.data),

  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`/departments/${id}`).then((res) => res.data),

  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("/departments", data).then((res) => res.data),

  update: (id: string, data: any): Promise<ApiResponse<any>> =>
    api.put(`/departments/${id}`, data).then((res) => res.data),

  delete: (id: string): Promise<ApiResponse> =>
    api.delete(`/departments/${id}`).then((res) => res.data),
};

//collections API
export const collectionsApi = {
  getAll: (params?: any): Promise<ApiResponse<any[]>> =>
    api.get("/collections", { params }).then((res) => res.data),

  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`/collections/${id}`).then((res) => res.data),

  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("/collections", data).then((res) => res.data),

  update: (id: string, data: any): Promise<ApiResponse<any>> =>
    api.put(`/collections/${id}`, data).then((res) => res.data),

  delete: (id: string): Promise<ApiResponse> =>
    api.delete(`/collections/${id}`).then((res) => res.data),
};
export default api;
