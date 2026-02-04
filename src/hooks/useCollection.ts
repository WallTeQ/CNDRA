import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionsApi } from "../services/api";
import { Collection } from "../../types/collection";

// Query keys
export const collectionsKeys = {
  all: ["collections"] as const,
  lists: () => [...collectionsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...collectionsKeys.lists(), { filters }] as const,
  details: () => [...collectionsKeys.all, "detail"] as const,
  detail: (id: string) => [...collectionsKeys.details(), id] as const,
};


// Hooks
export const useCollections = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: collectionsKeys.list(filters || {}),
    queryFn: () => collectionsApi.getAll(filters),
    select: (data) => data.data?.items || [],
  });
};

export const useCollection = (id: string, enabled = true) => {
  return useQuery({
    queryKey: collectionsKeys.detail(id),
    queryFn: () => collectionsApi.getById(id),
    select: (data) => data.data,
    enabled: !!id && enabled,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => collectionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionsKeys.lists() });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      collectionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: collectionsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collectionsKeys.lists() });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: collectionsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collectionsKeys.lists() });
    },
  });
};
