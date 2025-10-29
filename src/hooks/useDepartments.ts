import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "../services/api";
import { Department, DepartmentFilters } from "../types/departments";

// Query keys
export const departmentsKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentsKeys.all, "list"] as const,
  list: (filters: DepartmentFilters) =>
    [...departmentsKeys.lists(), { filters }] as const,
  details: () => [...departmentsKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentsKeys.details(), id] as const,
};



// Hooks
export const useDepartments = (filters?: DepartmentFilters) => {
  return useQuery({
    queryKey: departmentsKeys.list(filters || {}),
    queryFn: () => departmentsApi.getAll(filters),
    select: (data) => data.data || [],
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
    mutationFn: (data: Department) => departmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentsKeys.lists() });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Department }) =>
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
