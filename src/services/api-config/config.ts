import axios, { AxiosInstance } from "axios";

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Public endpoints that should NOT have Authorization headers
export const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/signup/request-otp",
  "/auth/signup/verify-otp",
];
