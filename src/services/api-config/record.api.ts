import { api } from "./config";
import "./interceptor";
import { ApiResponse, PaginatedResponse } from "../../types/api";

export const recordsApi = {
  getAll: (params?: any): Promise<ApiResponse<PaginatedResponse<any>>> =>
    api.get("/records", { params }).then((res) => res.data),

  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`/records/${id}`).then((res) => res.data),

  create: (data: FormData | any): Promise<ApiResponse<any>> => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return api
        .post("/records", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    }
    // Handle regular JSON data
    return api.post("/records", data).then((res) => res.data);
  },

  update: (id: string, data: FormData | any): Promise<ApiResponse<any>> => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return api
        .put(`/records/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    }
    // Handle regular JSON data
    return api.put(`/records/${id}`, data).then((res) => res.data);
  },

  delete: (id: string): Promise<ApiResponse> =>
    api.delete(`/records/${id}`).then((res) => res.data),

  getRestricted: (): Promise<ApiResponse<PaginatedResponse<any>>> =>
    api.get("/records/restricted").then((res) => res.data),

  getPublic: (): Promise<ApiResponse<PaginatedResponse<any>>> =>
    api.get("/records/public").then((res) => res.data),

  getConfidential: (): Promise<ApiResponse<PaginatedResponse<any>>> =>
    api.get("/records/confidential").then((res) => res.data),
};
