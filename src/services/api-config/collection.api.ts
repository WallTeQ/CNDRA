import { api } from "./config";
import "./interceptor";
import { ApiResponse, PaginatedResponse } from "../../types/api";

export const collectionsApi = {
  getAll: (params?: any): Promise<ApiResponse<PaginatedResponse<any>>> =>
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
