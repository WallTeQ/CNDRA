// import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
// import {
//   ApiResponse,
//   SignupRequestData,
//   VerifyOtpData,
//   CompleteRegistrationData,
//   LoginData,
//   AuthUser,
//   AuthResponse,
// } from "../types/api";
// import {
//   SubmitAccessRequestData,
//   UpdateRequestStatusData,
//   SendChatMessageData,
//   AccessRequestFilters,
//   AccessRequest,
//   Communication,
//   ChatRoom,
//   ChatMessage,
// } from "../types/access";

// // API Configuration
// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// // Create axios instance
// const api: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL, 
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Token management
// const TOKEN_KEY = "auth_token";
// const TEMP_TOKEN_KEY = "temp_auth_token";
// let forceLogout = false;

// export const tokenManager = {
//   getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
//   getTempToken: (): string | null => localStorage.getItem(TEMP_TOKEN_KEY),
//   setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
//   setTempToken: (token: string): void =>
//     localStorage.setItem(TEMP_TOKEN_KEY, token),
//   removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
//   removeTempToken: (): void => localStorage.removeItem(TEMP_TOKEN_KEY),
//   clearAll: (): void => {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(TEMP_TOKEN_KEY);
//   },
// };

// const setForceLogout = (value: boolean) => {
//   forceLogout = value;
// }

// // ✅ Public endpoints that should NOT have Authorization headers
// const PUBLIC_ENDPOINTS = [
//   "/auth/login",
//   "/auth/signup/request-otp",
//   "/auth/signup/verify-otp",
// ];

// export const forceUserLogout = () => {
//   if (!forceLogout) {
//     setForceLogout(true);
//     tokenManager.clearAll();
//     window.location.href = "/login";
//   }
// }

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = tokenManager.getToken();
//     const tempToken = tokenManager.getTempToken();

//     // ✅ Check if this is a public endpoint
//     const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
//       config.url?.includes(endpoint)
//     );

//     // ✅ Only add Authorization header if NOT a public endpoint
//     if (!isPublicEndpoint) {
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       } else if (tempToken && config.url?.includes("/auth/signup/complete")) {
//         config.headers.Authorization = `Bearer ${tempToken}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle token expiration
// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     console.error("API error:", error.response?.status, error.config?.url);
//     if (error.response?.status === 401) {
//       console.log("401 detected - clearing tokens and redirecting");
//       // Only clear tokens and redirect if we're not already on public pages
//       const isPublicPage = window.location.pathname === "/login" || 
//                           window.location.pathname.startsWith("/signup");
      
//       if (!isPublicPage) {
//         tokenManager.clearAll();
//         window.location.href = "/login";
//       }
//     }

//     // //force logout if 403 forbidden
//     // if (error.response?.status === 403) {
//     //   forceUserLogout();
//     // }

//     return Promise.reject(error);
//   }
// );

// export const authApi = {
//   // Step 1: Request OTP
//   requestOtp: (data: SignupRequestData): Promise<ApiResponse> =>
//     api.post("/auth/signup/request-otp", data).then((res) => res.data),

//   // Step 2: Verify OTP
//   verifyOtp: (data: VerifyOtpData): Promise<ApiResponse<{ token: string }>> =>
//     api.post("/auth/signup/verify-otp", data).then((res) => res.data),

//   // Step 3: Complete Registration
//   completeRegistration: (
//     data: CompleteRegistrationData
//   ): Promise<ApiResponse<AuthResponse>> =>
//     api.post("/auth/signup/complete", data).then((res) => res.data),

//   // Login
//   login: (data: LoginData): Promise<ApiResponse<AuthResponse>> =>
//     api.post("/auth/login", data).then((res) => res.data),

//   // Get Profile
//   getProfile: (): Promise<ApiResponse<AuthUser>> =>
//     api.get("/auth/profile").then((res) => res.data),

//   // Logout
//   logout: (): Promise<ApiResponse> =>
//     api.post("/auth/logout").then((res) => res.data),
// };

// // Records API
// export const recordsApi = {
//   getAll: (params?: any): Promise<ApiResponse<any[]>> =>
//     api.get('/records', { params }).then(res => res.data),

//   getById: (id: string): Promise<ApiResponse<any>> =>
//     api.get(`/records/${id}`).then(res => res.data),

//   create: (data: FormData | any): Promise<ApiResponse<any>> => {
//     // Handle FormData for file uploads
//     if (data instanceof FormData) {
//       return api.post('/records', data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }).then(res => res.data);
//     }
//     // Handle regular JSON data
//     return api.post('/records', data).then(res => res.data);
//   },

//   update: (id: string, data: FormData | any): Promise<ApiResponse<any>> => {
//     // Handle FormData for file uploads
//     if (data instanceof FormData) {
//       return api.put(`/records/${id}`, data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }).then(res => res.data);
//     }
//     // Handle regular JSON data
//     return api.put(`/records/${id}`, data).then(res => res.data);
//   },

//   delete: (id: string): Promise<ApiResponse> =>
//     api.delete(`/records/${id}`).then(res => res.data),

//   getRestricted: (): Promise<ApiResponse<[]>> =>
//     api.get('/records/restricted').then(res => res.data),

//   getPublic: (): Promise<ApiResponse<[]>> =>
//     api.get('/records/public').then(res => res.data),

//   getConfidential: (): Promise<ApiResponse<[]>> =>
//     api.get('/records/confidential').then(res => res.data),
// };

// // Users API
// export const usersApi = {
//   getById: (id: string): Promise<ApiResponse<any>> =>
//     api.get(`auth/users/${id}`).then((res) => res.data),

//   create: (data: any): Promise<ApiResponse<any>> =>
//     api.post("auth/users", data).then((res) => res.data),
// };

// //departments API
// export const departmentsApi = {
//   getAll: (params?: any): Promise<ApiResponse<any[]>> =>
//     api.get("/departments", { params }).then((res) => res.data),

//   getById: (id: string): Promise<ApiResponse<any>> =>
//     api.get(`/departments/${id}`).then((res) => res.data),

//   create: (data: any): Promise<ApiResponse<any>> =>
//     api.post("/departments", data).then((res) => res.data),

//   update: (id: string, data: any): Promise<ApiResponse<any>> =>
//     api.put(`/departments/${id}`, data).then((res) => res.data),

//   delete: (id: string): Promise<ApiResponse> =>
//     api.delete(`/departments/${id}`).then((res) => res.data),
// };

// //collections API
// export const collectionsApi = {
//   getAll: (params?: any): Promise<ApiResponse<any[]>> =>
//     api.get("/collections", { params }).then((res) => res.data),

//   getById: (id: string): Promise<ApiResponse<any>> =>
//     api.get(`/collections/${id}`).then((res) => res.data),

//   create: (data: any): Promise<ApiResponse<any>> =>
//     api.post("/collections", data).then((res) => res.data),

//   update: (id: string, data: any): Promise<ApiResponse<any>> =>
//     api.put(`/collections/${id}`, data).then((res) => res.data),

//   delete: (id: string): Promise<ApiResponse> =>
//     api.delete(`/collections/${id}`).then((res) => res.data),
// };

// // Access Request API
// export const accessApi = {
//   // Access Request Management
//   submit: (data: SubmitAccessRequestData): Promise<ApiResponse<AccessRequest>> =>
//     api.post('/access/submit', data).then(res => res.data),

//   getAll: (filters?: AccessRequestFilters): Promise<ApiResponse<AccessRequest[]>> =>
//     api.get('/access', { params: filters }).then(res => res.data),

//   getById: (id: string): Promise<ApiResponse<AccessRequest>> =>
//     api.get(`/access/${id}`).then(res => res.data),

//   updateStatus: (requestId: string, data: UpdateRequestStatusData): Promise<ApiResponse<AccessRequest>> =>
//     api.put(`/access/status/${requestId}`, data).then(res => res.data),

//   getOverdue: (): Promise<ApiResponse<AccessRequest[]>> =>
//     api.get('/access/overdue').then(res => res.data),

//   // Communications
//   getCommunications: (requestId: string): Promise<ApiResponse<Communication[]>> =>
//     api.get(`/access/communication/${requestId}`).then(res => res.data),

//   getDetailedCommunications: (requestId: string): Promise<ApiResponse<Communication[]>> =>
//     api.get(`/access/${requestId}/communications/detailed`).then(res => res.data),

//   // Chat functionality
//   chat: {
//     getRooms: (): Promise<ApiResponse<ChatRoom[]>> =>
//       api.get('/access/chat/rooms').then(res => res.data),

//     getMessages: (requestId: string): Promise<ApiResponse<ChatMessage[]>> =>
//       api.get(`/access/${requestId}/chat/messages`).then(res => res.data),

//     sendMessage: (requestId: string, data: SendChatMessageData): Promise<ApiResponse<ChatMessage>> =>
//       api.post(`/access/${requestId}/chat/message`, data).then(res => res.data),

//     getUnreadMessages: (requestId: string): Promise<ApiResponse<ChatMessage[]>> =>
//       api.get(`/access/${requestId}/chat/unread-messages`).then(res => res.data),

//     markMessageRead: (messageId: string): Promise<ApiResponse<void>> =>
//       api.post(`/access/chat/message/${messageId}/read`).then(res => res.data),

//     markAllRead: (requestId: string): Promise<ApiResponse<void>> =>
//       api.post(`/access/${requestId}/chat/mark-all-read`).then(res => res.data),

//     getUnreadCount: (requestId: string): Promise<ApiResponse<{ count: number }>> =>
//       api.get(`/access/${requestId}/chat/unread-count`).then(res => res.data),
//   },
// };

// // Governance API
// export const governanceApi = {
//   // News endpoints
//   news: {
//     create: (data: any): Promise<ApiResponse<any>> => {
//       // If already FormData, use it directly
//       if (data instanceof FormData) {
//         return api
//           .post("/governance/news", data, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((res) => res.data);
//       }

//       // If plain object with files, convert to FormData
//       if (data.files && data.files.length > 0) {
//         const formData = new FormData();
//         formData.append("title", data.title);
//         formData.append("content", data.content);

//         data.files.forEach((file: File) => {
//           formData.append("files", file);
//         });

//         return api
//           .post("/governance/news", formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((res) => res.data);
//       }

//       // Plain JSON request
//       return api.post("/governance/news", data).then((res) => res.data);
//     },

//     getPublished: (params?: any): Promise<ApiResponse<any[]>> =>
//       api.get("/governance/news", { params }).then((res) => res.data),

//     getAll: (params?: any): Promise<ApiResponse<any[]>> =>
//       api.get("/governance/news/admin", { params }).then((res) => res.data),

//     getById: (id: string): Promise<ApiResponse<any>> =>
//       api.get(`/governance/news/${id}`).then((res) => res.data),

//     update: (id: string, data: any): Promise<ApiResponse<any>> => {
//       // Handle FormData for file uploads
//       if (data instanceof FormData || data.files) {
//         const formData = new FormData();
//         if (data.title) formData.append("title", data.title);
//         if (data.content) formData.append("content", data.content);

//         if (data.files && data.files.length > 0) {
//           data.files.forEach((file: File) => {
//             formData.append("files", file);
//           });
//         }

//         return api
//           .put(`/governance/news/${id}`, formData, {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           })
//           .then((res) => res.data);
//       }

//       return api.put(`/governance/news/${id}`, data).then((res) => res.data);
//     },

//     publish: (data: any): Promise<ApiResponse<any>> =>
//       api.post("/governance/news/publish", data).then((res) => res.data),

//     unpublish: (data: any): Promise<ApiResponse<any>> =>
//       api.post("/governance/news/unpublish", data).then((res) => res.data),

//     delete: (id: string): Promise<ApiResponse> =>
//       api.delete(`/governance/news/${id}`).then((res) => res.data),
//   },

//   // Notice endpoints
//   notices: {
//     create: (data: any): Promise<ApiResponse<any>> =>
//       api.post("/governance/notice", data).then((res) => res.data),

//     getPublished: (params?: any): Promise<ApiResponse<any[]>> =>
//       api.get("/governance/notice", { params }).then((res) => res.data),

//     getAll: (params?: any): Promise<ApiResponse<any[]>> =>
//       api.get("/governance/notice/admin", { params }).then((res) => res.data),

//     getById: (id: string): Promise<ApiResponse<any>> =>
//       api.get(`/governance/notice/${id}`).then((res) => res.data),

//     update: (id: string, data: any): Promise<ApiResponse<any>> =>
//       api.put(`/governance/notice/${id}`, data).then((res) => res.data),

//     publish: (data: { noticeId: string }): Promise<ApiResponse<any>> =>
//       api.post("/governance/notice/publish", data).then((res) => res.data),

//     unpublish: (data: { noticeId: string }): Promise<ApiResponse<any>> =>
//       api.post("/governance/notice/unpublish", data).then((res) => res.data),

//     delete: (id: string): Promise<ApiResponse> =>
//       api.delete(`/governance/notice/${id}`).then((res) => res.data),
//   },

//   // Event endpoints
//   events: {
//     create: (data: any): Promise<ApiResponse<any>> =>
//       api.post("/governance/event", data).then((res) => res.data),

//     getPublished: (params?: any): Promise<ApiResponse<any[]>> =>
//       api.get("/governance/event", { params }).then((res) => res.data),

//     getAll: (params?: any): Promise<ApiResponse<any[]>> =>
//       api.get("/governance/event/admin", { params }).then((res) => res.data),

//     getById: (id: string): Promise<ApiResponse<any>> =>
//       api.get(`/governance/event/${id}`).then((res) => res.data),

//     update: (id: string, data: any): Promise<ApiResponse<any>> =>
//       api.put(`/governance/event/${id}`, data).then((res) => res.data),

//     publish: (data: { eventId: string }): Promise<ApiResponse<any>> =>
//       api.post("/governance/event/publish", data).then((res) => res.data),

//     unpublish: (data: { eventId: string }): Promise<ApiResponse<any>> =>
//       api.post("/governance/event/unpublish", data).then((res) => res.data),

//     delete: (id: string): Promise<ApiResponse> =>
//       api.delete(`/governance/event/${id}`).then((res) => res.data),
//   },
// };
// export default api;




// Import interceptors to initialize them
// import "../config/api.interceptors";

// Export the api instance
// export { api } from "../config/api.config";

// Export token manager
export { tokenManager, forceUserLogout } from "./api-config/tokenManager";

// Export all API modules
export { authApi } from "./api-config/auth.api";
export { recordsApi } from "./api-config/record.api";
export { usersApi } from "./api-config/user.api";
export { departmentsApi } from "./api-config/department.api";
export { collectionsApi } from "./api-config/collection.api";
export { accessApi } from "./api-config/access.api";
export { governanceApi } from "./api-config/governance.api";

// Default export for backward compatibility
import { api } from "./api-config/config";
export default api;