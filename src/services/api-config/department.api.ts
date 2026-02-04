import { api } from "./config";
import "./interceptor";
import { ApiResponse } from "../../types/api";
import { PaginatedDepartmentsResponse } from "../../types/departments";

export const departmentsApi = {
  getAll: (params?: any): Promise<ApiResponse<PaginatedDepartmentsResponse>> =>
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
