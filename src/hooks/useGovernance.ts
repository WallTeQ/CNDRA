import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { governanceApi } from "../services/api";
import { ApiResponse } from "../types/api";
import {
  News,
  Notice,
  Event,
  CreateNewsRequest,
  UpdateNewsRequest,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  CreateEventRequest,
  UpdateEventRequest,
  PublishRequest,
} from "../types/governance";

// Query keys
export const governanceKeys = {
  all: ["governance"] as const,

  // News keys
  news: () => [...governanceKeys.all, "news"] as const,
  newsList: (filters: Record<string, any>) =>
    [...governanceKeys.news(), "list", { filters }] as const,
  newsPublished: (filters: Record<string, any>) =>
    [...governanceKeys.news(), "published", { filters }] as const,
  newsAdmin: (filters: Record<string, any>) =>
    [...governanceKeys.news(), "admin", { filters }] as const,
  newsDetail: (id: string) => [...governanceKeys.news(), "detail", id] as const,

  // Notice keys
  notices: () => [...governanceKeys.all, "notices"] as const,
  noticesList: (filters: Record<string, any>) =>
    [...governanceKeys.notices(), "list", { filters }] as const,
  noticesPublished: (filters: Record<string, any>) =>
    [...governanceKeys.notices(), "published", { filters }] as const,
  noticesAdmin: (filters: Record<string, any>) =>
    [...governanceKeys.notices(), "admin", { filters }] as const,
  noticesDetail: (id: string) =>
    [...governanceKeys.notices(), "detail", id] as const,

  // Event keys
  events: () => [...governanceKeys.all, "events"] as const,
  eventsList: (filters: Record<string, any>) =>
    [...governanceKeys.events(), "list", { filters }] as const,
  eventsPublished: (filters: Record<string, any>) =>
    [...governanceKeys.events(), "published", { filters }] as const,
  eventsAdmin: (filters: Record<string, any>) =>
    [...governanceKeys.events(), "admin", { filters }] as const,
  eventsDetail: (id: string) =>
    [...governanceKeys.events(), "detail", id] as const,
};

// ============================================================================
// NEWS HOOKS
// ============================================================================

export const usePublishedNews = (
  filters?: Record<string, any>
): UseQueryResult<News[], Error> => {
  return useQuery({
    queryKey: governanceKeys.newsPublished(filters || {}),
    queryFn: () => governanceApi.news.getPublished(filters),
    select: (data): News[] => Array.isArray(data.data) ? data.data : [],
  });
};

export const useAllNews = (
  filters?: Record<string, any>
): UseQueryResult<News[], Error> => {
  return useQuery({
    queryKey: governanceKeys.newsAdmin(filters || {}),
    queryFn: () => governanceApi.news.getAll(filters),
    select: (data): News[] => Array.isArray(data.data) ? data.data : [],
  });
};

export const useNews = (
  id: string,
  enabled = true
): UseQueryResult<News | undefined, Error> => {
  return useQuery({
    queryKey: governanceKeys.newsDetail(id),
    queryFn: () => governanceApi.news.getById(id),
    select: (data): News => data.data,
    enabled: !!id && enabled,
  });
};

export const useCreateNews = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  CreateNewsRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNewsRequest) => {
      // Create FormData for file uploads if files are present
      if (data.files && data.files.length > 0) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);

        data.files.forEach((file: File) => {
          formData.append("files", file);
        });

        return governanceApi.news.create(formData);
      }

      return governanceApi.news.create(data);
    },
    onSuccess: () => {
      // Invalidate and refetch news lists
      queryClient.invalidateQueries({ queryKey: governanceKeys.news() });
    },
    onError: (error: any) => {
      console.error("Create news error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

export const useUpdateNews = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { id: string; data: UpdateNewsRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsRequest }) => {
      return governanceApi.news.update(id, data);
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific news and lists
      queryClient.invalidateQueries({
        queryKey: governanceKeys.newsDetail(id),
      });
      queryClient.invalidateQueries({ queryKey: governanceKeys.news() });
    },
    onError: (error: any) => {
      console.error("Update news error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

export const usePublishNews = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { newsId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { newsId: string }) => governanceApi.news.publish(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.news() });
    },
  });
};

export const useUnpublishNews = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { newsId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { newsId: string }) =>
      governanceApi.news.unpublish(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.news() });
    },
  });
};

export const useDeleteNews = (): UseMutationResult<ApiResponse<any>, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => governanceApi.news.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: governanceKeys.newsDetail(id) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.news() });
    },
  });
};

// ============================================================================
// NOTICE HOOKS
// ============================================================================

export const usePublishedNotices = (
  filters?: Record<string, any>
): UseQueryResult<Notice[], Error> => {
  return useQuery({
    queryKey: governanceKeys.noticesPublished(filters || {}),
    queryFn: () => governanceApi.notices.getPublished(filters),
    select: (data): Notice[] => Array.isArray(data.data) ? data.data : [],
  });
};

export const useAllNotices = (
  filters?: Record<string, any>
): UseQueryResult<Notice[], Error> => {
  return useQuery({
    queryKey: governanceKeys.noticesAdmin(filters || {}),
    queryFn: () => governanceApi.notices.getAll(filters),
    select: (data): Notice[] => Array.isArray(data.data) ? data.data : [],
  });
};

export const useNotice = (
  id: string,
  enabled = true
): UseQueryResult<Notice | undefined, Error> => {
  return useQuery({
    queryKey: governanceKeys.noticesDetail(id),
    queryFn: () => governanceApi.notices.getById(id),
    select: (data): Notice => data.data,
    enabled: !!id && enabled,
  });
};

export const useCreateNotice = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  CreateNoticeRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoticeRequest) =>
      governanceApi.notices.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.notices() });
    },
    onError: (error: any) => {
      console.error("Create notice error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

export const useUpdateNotice = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { id: string; data: UpdateNoticeRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoticeRequest }) => {
      return governanceApi.notices.update(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: governanceKeys.noticesDetail(id),
      });
      queryClient.invalidateQueries({ queryKey: governanceKeys.notices() });
    },
    onError: (error: any) => {
      console.error("Update notice error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

export const usePublishNotice = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { noticeId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { noticeId: string }) =>
      governanceApi.notices.publish(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.notices() });
    },
  });
};

export const useUnpublishNotice = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { noticeId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { noticeId: string }) =>
      governanceApi.notices.unpublish(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.notices() });
    },
  });
};

export const useDeleteNotice = (): UseMutationResult<ApiResponse<any>, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => governanceApi.notices.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: governanceKeys.noticesDetail(id) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.notices() });
    },
  });
};

// ============================================================================
// EVENT HOOKS
// ============================================================================

export const usePublishedEvents = (
  filters?: Record<string, any>
): UseQueryResult<Event[], Error> => {
  return useQuery({
    queryKey: governanceKeys.eventsPublished(filters || {}),
    queryFn: () => governanceApi.events.getPublished(filters),
    select: (data): Event[] => Array.isArray(data.data) ? data.data : [],
  });
};

export const useAllEvents = (
  filters?: Record<string, any>
): UseQueryResult<Event[], Error> => {
  return useQuery({
    queryKey: governanceKeys.eventsAdmin(filters || {}),
    queryFn: () => governanceApi.events.getAll(filters),
    select: (data): Event[] => Array.isArray(data.data) ? data.data : [],
  });
};

export const useEvent = (
  id: string,
  enabled = true
): UseQueryResult<Event | undefined, Error> => {
  return useQuery({
    queryKey: governanceKeys.eventsDetail(id),
    queryFn: () => governanceApi.events.getById(id),
    select: (data): Event => data.data,
    enabled: !!id && enabled,
  });
};

export const useCreateEvent = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  CreateEventRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => governanceApi.events.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.events() });
    },
    onError: (error: any) => {
      console.error("Create event error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

export const useUpdateEvent = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { id: string; data: UpdateEventRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) => {
      return governanceApi.events.update(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: governanceKeys.eventsDetail(id),
      });
      queryClient.invalidateQueries({ queryKey: governanceKeys.events() });
    },
    onError: (error: any) => {
      console.error("Update event error:", {
        data: error.response?.data,
        status: error.response?.status,
        message: error.message,
      });
    },
  });
};

export const usePublishEvent = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { eventId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { eventId: string }) =>
      governanceApi.events.publish(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.events() });
    },
  });
};

export const useUnpublishEvent = (): UseMutationResult<
  ApiResponse<any>,
  Error,
  { eventId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { eventId: string }) =>
      governanceApi.events.unpublish(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: governanceKeys.events() });
    },
  });
};

export const useDeleteEvent = (): UseMutationResult<ApiResponse<any>, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => governanceApi.events.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: governanceKeys.eventsDetail(id) });
      queryClient.invalidateQueries({ queryKey: governanceKeys.events() });
    },
  });
};
