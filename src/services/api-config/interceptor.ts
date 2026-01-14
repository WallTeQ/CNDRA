
import { AxiosResponse, AxiosError } from "axios";
import { api, PUBLIC_ENDPOINTS } from "./config";
import { tokenManager } from "./tokenManager";

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    const tempToken = tokenManager.getTempToken();

    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      config.url?.includes(endpoint)
    );

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

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // Handle 401 or 403 - clear tokens and redirect
    if (status === 401 || status === 403) {
      const isPublicPage =
        window.location.pathname === "/login" ||
        window.location.pathname.startsWith("/signup");

      if (!isPublicPage) {
        tokenManager.clearAll();
        window.location.href = "/login?expired=1";
      }
    }

    return Promise.reject(error);
  }
);