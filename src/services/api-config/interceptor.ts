import { AxiosError, AxiosResponse } from "axios";
import { api, PUBLIC_ENDPOINTS } from "./config";
import { tokenManager, forceUserLogout } from "./tokenManager";

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    const tempToken = tokenManager.getTempToken();

    // Check if this is a public endpoint
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Only add Authorization header if NOT a public endpoint
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
      const isPublicPage =
        window.location.pathname === "/login" ||
        window.location.pathname.startsWith("/signup");

      if (!isPublicPage) {
        tokenManager.clearAll();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
