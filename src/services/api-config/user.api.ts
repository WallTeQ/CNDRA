import { api } from "./config";
import "./interceptor";
import { ApiResponse } from "../../types/api";
import { User } from "../../types/user";

export const usersApi = {

  getAll: (): Promise<ApiResponse<User[]>> =>
    api.get("/user").then((res) => res.data),

  getById: (id: string): Promise<ApiResponse<User>> =>
    api.get(`/user/${id}`).then((res) => res.data),

  create: (data: User): Promise<ApiResponse<User>> =>
    api.post("/user", data).then((res) => res.data),
};
