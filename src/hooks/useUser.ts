import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionsApi, usersApi } from "../services/api";
import { User } from "../../types/user";

// Query keys
export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...usersKeys.lists(), { filters }] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};


// Hooks
export const useUsers = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: usersKeys.list(filters || {}),
    queryFn: () => usersApi.getAll(),
    select: (data) => {
      console.log("Raw API response:", data);
      return Array.isArray(data?.data) ? data.data : [];
    },
  });
};

export const useUser = (id: string, enabled = true) => {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    select: (data) => data.data,
    enabled: !!id && enabled,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: User) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
};
