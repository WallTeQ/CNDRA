import { api } from "./config";
import "./interceptor";
import { ApiResponse, PaginatedResponse } from "../../types/api";

export const governanceApi = {
  // News endpoints
  news: {
    create: (data: any): Promise<ApiResponse<any>> => {
      // If already FormData, use it directly
      if (data instanceof FormData) {
        return api
          .post("/governance/news", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => res.data);
      }

      // If plain object with files, convert to FormData
      if (data.files && data.files.length > 0) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);

        data.files.forEach((file: File) => {
          formData.append("files", file);
        });

        return api
          .post("/governance/news", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => res.data);
      }

      // Plain JSON request
      return api.post("/governance/news", data).then((res) => res.data);
    },

    getPublished: (params?: any): Promise<ApiResponse<PaginatedResponse<any>>> =>
      api.get("/governance/news", { params }).then((res) => res.data),

    getAll: (params?: any): Promise<ApiResponse<PaginatedResponse<any>>> =>
      api.get("/governance/news/admin", { params }).then((res) => res.data),

    getById: (id: string): Promise<ApiResponse<any>> =>
      api.get(`/governance/news/${id}`).then((res) => res.data),

    update: (id: string, data: any): Promise<ApiResponse<any>> => {
      // Handle FormData for file uploads
      if (data instanceof FormData || data.files) {
        const formData = new FormData();
        if (data.title) formData.append("title", data.title);
        if (data.content) formData.append("content", data.content);

        if (data.files && data.files.length > 0) {
          data.files.forEach((file: File) => {
            formData.append("files", file);
          });
        }

        return api
          .put(`/governance/news/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => res.data);
      }

      return api.put(`/governance/news/${id}`, data).then((res) => res.data);
    },

    publish: (data: any): Promise<ApiResponse<any>> =>
      api.post("/governance/news/publish", data).then((res) => res.data),

    unpublish: (data: any): Promise<ApiResponse<any>> =>
      api.post("/governance/news/unpublish", data).then((res) => res.data),

    delete: (id: string): Promise<ApiResponse> =>
      api.delete(`/governance/news/${id}`).then((res) => res.data),
  },

  // Notice endpoints
  notices: {
    create: (data: any): Promise<ApiResponse<any>> =>
      api.post("/governance/notice", data).then((res) => res.data),

    getPublished: (params?: any): Promise<ApiResponse<PaginatedResponse<any>>> =>
      api.get("/governance/notice", { params }).then((res) => res.data),

    getAll: (params?: any): Promise<ApiResponse<PaginatedResponse<any>>> =>
      api.get("/governance/notice/admin", { params }).then((res) => res.data),

    getById: (id: string): Promise<ApiResponse<any>> =>
      api.get(`/governance/notice/${id}`).then((res) => res.data),

    update: (id: string, data: any): Promise<ApiResponse<any>> =>
      api.put(`/governance/notice/${id}`, data).then((res) => res.data),

    publish: (data: { noticeId: string }): Promise<ApiResponse<any>> =>
      api.post("/governance/notice/publish", data).then((res) => res.data),

    unpublish: (data: { noticeId: string }): Promise<ApiResponse<any>> =>
      api.post("/governance/notice/unpublish", data).then((res) => res.data),

    delete: (id: string): Promise<ApiResponse> =>
      api.delete(`/governance/notice/${id}`).then((res) => res.data),
  },

  // Event endpoints
  events: {
    create: (data: any): Promise<ApiResponse<any>> =>
      api.post("/governance/event", data).then((res) => res.data),

    getPublished: (params?: any): Promise<ApiResponse<PaginatedResponse<any>>> =>
      api.get("/governance/event", { params }).then((res) => res.data),

    getAll: (params?: any): Promise<ApiResponse<PaginatedResponse<any>>> =>
      api.get("/governance/event/admin", { params }).then((res) => res.data),

    getById: (id: string): Promise<ApiResponse<any>> =>
      api.get(`/governance/event/${id}`).then((res) => res.data),

    update: (id: string, data: any): Promise<ApiResponse<any>> =>
      api.put(`/governance/event/${id}`, data).then((res) => res.data),

    publish: (data: { eventId: string }): Promise<ApiResponse<any>> =>
      api.post("/governance/event/publish", data).then((res) => res.data),

    unpublish: (data: { eventId: string }): Promise<ApiResponse<any>> =>
      api.post("/governance/event/unpublish", data).then((res) => res.data),

    delete: (id: string): Promise<ApiResponse> =>
      api.delete(`/governance/event/${id}`).then((res) => res.data),
  },
};
