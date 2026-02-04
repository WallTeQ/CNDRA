import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "../services/api";
import { Department } from "../types/departments";

// Query keys
export const departmentsKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...departmentsKeys.lists(), { filters }] as const,
  details: () => [...departmentsKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentsKeys.details(), id] as const,
};

// Hooks
export const useDepartments = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: departmentsKeys.list(filters || {}),
    queryFn: () => departmentsApi.getAll(filters),
    select: (data) => {
      console.log("Raw API response:", data);
      // Return full pagination data structure
      return {
        items: Array.isArray(data?.data?.items) ? data.data.items : [],
        total: data?.data?.total || 0,
        page: data?.data?.page || 1,
        limit: data?.data?.limit || 10,
        totalPages: data?.data?.totalPages || 0,
      };
    },
  });
};

export const useDepartment = (id: string, enabled = true) => {
  return useQuery({
    queryKey: departmentsKeys.detail(id),
    queryFn: () => departmentsApi.getById(id),
    select: (data) => data.data,
    enabled: !!id && enabled,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => departmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      departmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => departmentsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: departmentsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
};



// Fetch all departments without pagination (for dropdowns, filters, etc.)
export const useAllDepartments = () => {
  return useQuery({
    queryKey: departmentsKeys.all,
    queryFn: () => departmentsApi.getAll({ limit: 1000 }), // Large limit to get all
    select: (data) => {
      console.log("All Departments API response:", data);
      return Array.isArray(data?.data?.items) ? data.data.items : [];
    },
  });
};
