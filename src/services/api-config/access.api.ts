import { api } from "./config";
import "./interceptor";
import { ApiResponse } from "../../types/api";
import {
  SubmitAccessRequestData,
  UpdateRequestStatusData,
  SendChatMessageData,
  AccessRequestFilters,
  AccessRequest,
  Communication,
  ChatRoom,
  ChatMessage,
} from "../../types/access";

export const accessApi = {
  // Access Request Management
  submit: (
    data: SubmitAccessRequestData
  ): Promise<ApiResponse<AccessRequest>> =>
    api.post("/access/submit", data).then((res) => res.data),

  getAll: (
    filters?: AccessRequestFilters
  ): Promise<ApiResponse<AccessRequest[]>> =>
    api.get("/access", { params: filters }).then((res) => res.data),

  getById: (id: string): Promise<ApiResponse<AccessRequest>> =>
    api.get(`/access/${id}`).then((res) => res.data),

  updateStatus: (
    requestId: string,
    data: UpdateRequestStatusData
  ): Promise<ApiResponse<AccessRequest>> =>
    api.put(`/access/status/${requestId}`, data).then((res) => res.data),

  getOverdue: (): Promise<ApiResponse<AccessRequest[]>> =>
    api.get("/access/overdue").then((res) => res.data),

  // Communications
  getCommunications: (
    requestId: string
  ): Promise<ApiResponse<Communication[]>> =>
    api.get(`/access/communication/${requestId}`).then((res) => res.data),

  getDetailedCommunications: (
    requestId: string
  ): Promise<ApiResponse<Communication[]>> =>
    api
      .get(`/access/${requestId}/communications/detailed`)
      .then((res) => res.data),

  // Chat functionality
  chat: {
    getRooms: (): Promise<ApiResponse<ChatRoom[]>> =>
      api.get("/access/chat/rooms").then((res) => res.data),

    getMessages: (requestId: string): Promise<ApiResponse<ChatMessage[]>> =>
      api.get(`/access/${requestId}/chat/messages`).then((res) => res.data),

    sendMessage: (
      requestId: string,
      data: SendChatMessageData
    ): Promise<ApiResponse<ChatMessage>> =>
      api
        .post(`/access/${requestId}/chat/message`, data)
        .then((res) => res.data),

    getUnreadMessages: (
      requestId: string
    ): Promise<ApiResponse<ChatMessage[]>> =>
      api
        .get(`/access/${requestId}/chat/unread-messages`)
        .then((res) => res.data),

    markMessageRead: (messageId: string): Promise<ApiResponse<void>> =>
      api
        .post(`/access/chat/message/${messageId}/read`)
        .then((res) => res.data),

    markAllRead: (requestId: string): Promise<ApiResponse<void>> =>
      api
        .post(`/access/${requestId}/chat/mark-all-read`)
        .then((res) => res.data),

    getUnreadCount: (
      requestId: string
    ): Promise<ApiResponse<{ count: number }>> =>
      api.get(`/access/${requestId}/chat/unread-count`).then((res) => res.data),
  },
};
