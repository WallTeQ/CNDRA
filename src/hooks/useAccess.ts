import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accessApi } from "../services/api";
import {
  AccessRequest,
  ChatMessage,
  ChatRoom,
  Communication,
  SubmitAccessRequestData,
  UpdateRequestStatusData,
  SendChatMessageData,
  AccessRequestFilters,
} from "../types/access";

// Query keys
export const accessKeys = {
  all: ["access"] as const,

  // Access request keys
  requests: () => [...accessKeys.all, "requests"] as const,
  requestsList: (filters: AccessRequestFilters) =>
    [...accessKeys.requests(), "list", { filters }] as const,
  requestsOverdue: () => [...accessKeys.requests(), "overdue"] as const,
  requestDetail: (id: string) =>
    [...accessKeys.requests(), "detail", id] as const,

  // Communication keys
  communications: () => [...accessKeys.all, "communications"] as const,
  communicationsList: (requestId: string) =>
    [...accessKeys.communications(), "list", requestId] as const,
  communicationsDetailed: (requestId: string) =>
    [...accessKeys.communications(), "detailed", requestId] as const,

  // Chat keys
  chat: () => [...accessKeys.all, "chat"] as const,
  chatRooms: () => [...accessKeys.chat(), "rooms"] as const,
  chatMessages: (requestId: string) =>
    [...accessKeys.chat(), "messages", requestId] as const,
  chatUnread: (requestId: string) =>
    [...accessKeys.chat(), "unread", requestId] as const,
  chatUnreadCount: (requestId: string) =>
    [...accessKeys.chat(), "unread-count", requestId] as const,
};

// ============================================================================
// ACCESS REQUEST HOOKS
// ============================================================================

export const useAccessRequests = (
  filters?: AccessRequestFilters
): UseQueryResult<AccessRequest[], Error> => {
  return useQuery({
    queryKey: accessKeys.requestsList(filters || {}),
    queryFn: () => accessApi.getAll(filters),
    select: (data): AccessRequest[] => data.data || [],
  });
};

export const useAccessRequest = (
  id: string,
  enabled = true
): UseQueryResult<AccessRequest | undefined, Error> => {
  return useQuery({
    queryKey: accessKeys.requestDetail(id),
    queryFn: () => accessApi.getById(id),
    select: (data): AccessRequest => data.data,
    enabled: !!id && enabled,
  });
};

export const useOverdueRequests = (): UseQueryResult<
  AccessRequest[],
  Error
> => {
  return useQuery({
    queryKey: accessKeys.requestsOverdue(),
    queryFn: () => accessApi.getOverdue(),
    select: (data): AccessRequest[] => data.data || [],
  });
};

export const useSubmitAccessRequest = (): UseMutationResult<
  AccessRequest,
  Error,
  SubmitAccessRequestData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitAccessRequestData) => accessApi.submit(data),
    onSuccess: (response) => {
      // Invalidate and refetch access requests list
      queryClient.invalidateQueries({ queryKey: accessKeys.requests() });
      // Add the new request to cache
      queryClient.setQueryData(accessKeys.requestDetail(response.data.id), {
        data: response.data,
      });
    },
    onError: (error: any) => {
      console.error("Submit access request error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

export const useUpdateRequestStatus = (): UseMutationResult<
  AccessRequest,
  Error,
  { requestId: string; data: UpdateRequestStatusData }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: UpdateRequestStatusData;
    }) => accessApi.updateStatus(requestId, data),
    onSuccess: (response, { requestId }) => {
      // Update specific request in cache
      queryClient.setQueryData(accessKeys.requestDetail(requestId), {
        data: response.data,
      });
      // Invalidate requests list to reflect status change
      queryClient.invalidateQueries({ queryKey: accessKeys.requests() });
      queryClient.invalidateQueries({ queryKey: accessKeys.requestsOverdue() });
    },
    onError: (error: any) => {
      console.error("Update request status error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

// ============================================================================
// COMMUNICATION HOOKS
// ============================================================================

export const useCommunications = (
  requestId: string,
  enabled = true
): UseQueryResult<Communication[], Error> => {
  return useQuery({
    queryKey: accessKeys.communicationsList(requestId),
    queryFn: () => accessApi.getCommunications(requestId),
    select: (data): Communication[] => data.data || [],
    enabled: !!requestId && enabled,
  });
};

export const useDetailedCommunications = (
  requestId: string,
  enabled = true
): UseQueryResult<Communication[], Error> => {
  return useQuery({
    queryKey: accessKeys.communicationsDetailed(requestId),
    queryFn: () => accessApi.getDetailedCommunications(requestId),
    select: (data): Communication[] => data.data || [],
    enabled: !!requestId && enabled,
  });
};

// ============================================================================
// CHAT HOOKS
// ============================================================================

export const useChatRooms = (): UseQueryResult<ChatRoom[], Error> => {
  return useQuery({
    queryKey: accessKeys.chatRooms(),
    queryFn: () => accessApi.chat.getRooms(),
    select: (data): ChatRoom[] => data.data || [],
    // refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

export const useChatMessages = (
  requestId: string,
  enabled = true
): UseQueryResult<ChatMessage[], Error> => {
  return useQuery({
    queryKey: accessKeys.chatMessages(requestId),
    queryFn: () => accessApi.chat.getMessages(requestId),
    select: (data): ChatMessage[] => data.data || [],
    enabled: !!requestId && enabled,
    // refetchInterval: 120000, // Refetch every 120 seconds for real-time chat
  });
};

export const useUnreadMessages = (
  requestId: string,
  enabled = true
): UseQueryResult<ChatMessage[], Error> => {
  return useQuery({
    queryKey: accessKeys.chatUnread(requestId),
    queryFn: () => accessApi.chat.getUnreadMessages(requestId),
    select: (data): ChatMessage[] => data.data || [],
    enabled: !!requestId && enabled,
    // refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useUnreadCount = (
  requestId: string,
  enabled = true
): UseQueryResult<number, Error> => {
  return useQuery({
    queryKey: accessKeys.chatUnreadCount(requestId),
    queryFn: () => accessApi.chat.getUnreadCount(requestId),
    select: (data): number => data.data?.count || 0,
    enabled: !!requestId && enabled,
    // refetchInterval: 10000, // Refetch every 10 seconds
  });
};

export const useSendChatMessage = (): UseMutationResult<
  ChatMessage,
  Error,
  { requestId: string; data: SendChatMessageData }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: SendChatMessageData;
    }) => accessApi.chat.sendMessage(requestId, data),
    onSuccess: (response, { requestId }) => {
      // Add new message to chat messages cache
      queryClient.setQueryData(
        accessKeys.chatMessages(requestId),
        (oldData: any) => {
          if (!oldData) return { data: [response.data] };
          return {
            ...oldData,
            data: [...(oldData.data || []), response.data],
          };
        }
      );

      // Invalidate unread counts and chat rooms
      queryClient.invalidateQueries({
        queryKey: accessKeys.chatUnread(requestId),
      });
      queryClient.invalidateQueries({
        queryKey: accessKeys.chatUnreadCount(requestId),
      });
      queryClient.invalidateQueries({ queryKey: accessKeys.chatRooms() });
      queryClient.invalidateQueries({ queryKey: accessKeys.communications() });
    },
    onError: (error: any) => {
      console.error("Send chat message error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

export const useMarkMessageRead = (): UseMutationResult<
  void,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) =>
      accessApi.chat.markMessageRead(messageId),
    onSuccess: (_, messageId) => {
      // Invalidate all chat-related queries to reflect read status
      queryClient.invalidateQueries({ queryKey: accessKeys.chat() });
    },
  });
};

export const useMarkAllRead = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => accessApi.chat.markAllRead(requestId),
    onSuccess: (_, requestId) => {
      // Update unread counts to 0
      queryClient.setQueryData(accessKeys.chatUnreadCount(requestId), {
        data: { count: 0 },
      });
      queryClient.setQueryData(accessKeys.chatUnread(requestId), { data: [] });

      // Invalidate chat rooms to update unread counts
      queryClient.invalidateQueries({ queryKey: accessKeys.chatRooms() });
    },
  });
};
