import { api } from "./config";
import "./interceptor";
import { ApiResponse } from "../../types/api";

export const usersApi = {
  getById: (id: string): Promise<ApiResponse<any>> =>
    api.get(`auth/users/${id}`).then((res) => res.data),

  create: (data: any): Promise<ApiResponse<any>> =>
    api.post("auth/users", data).then((res) => res.data),
};
