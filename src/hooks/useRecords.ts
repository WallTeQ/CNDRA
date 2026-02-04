import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recordsApi } from "../services/api";
import { Record } from "../types";

// Query keys
export const recordsKeys = {
  all: ["records"] as const,
  lists: () => [...recordsKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...recordsKeys.lists(), { filters }] as const,
  details: () => [...recordsKeys.all, "detail"] as const,
  detail: (id: string) => [...recordsKeys.details(), id] as const,
  restricted: () => [...recordsKeys.all, "restricted"] as const,
  confidential: () => [...recordsKeys.all, "confidential"] as const,
};

// Hooks
export const useRecords = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: recordsKeys.list(filters || {}),
    queryFn: () => recordsApi.getAll(filters),
    select: (data) => {
      console.log('Raw API response:', data); 
      return Array.isArray(data?.data) ? data.data : [];
    },
  });
};

export const useRecord = (id: string, enabled = true) => {
  return useQuery({
    queryKey: recordsKeys.detail(id),
    queryFn: () => recordsApi.getById(id),
    select: (data) => data.data,
    enabled: !!id && enabled,
  });
};

export const useRestrictedRecords = () => {
  return useQuery({
    queryKey: recordsKeys.restricted(),
    queryFn: () => recordsApi.getRestricted(),
    select: (data) => data.data?.items || [],
  });
};

export const usePublicRecords = () => {
  return useQuery({
    queryKey: recordsKeys.restricted(),
    queryFn: () => recordsApi.getPublic(),
    select: (data) => data.data?.items || [],
  });
};

export const useConfidentialRecords = () => {
  return useQuery({
    queryKey: recordsKeys.confidential(),
    queryFn: () => recordsApi.getConfidential(),
    select: (data) => Array.isArray(data.data) ? data.data : [],
  });
};

// Helper function to create FormData for record creation/update
const createRecordFormData = (recordData: any): FormData => {
  const formData = new FormData();

  // Append non-file fields
  if (recordData.title) formData.append("title", recordData.title);
  if (recordData.description)
    formData.append("description", recordData.description);
  if (recordData.collectionId)
    formData.append("collectionId", recordData.collectionId);
  if (recordData.accessLevel)
    formData.append("accessLevel", recordData.accessLevel);

  // Append subject tags
  if (recordData.subjectTags && recordData.subjectTags.length > 0) {
    recordData.subjectTags.forEach((tag: string) => {
      formData.append("subjectTags", tag);
    });
  }

  // Append files
  if (recordData.files && recordData.files.length > 0) {
    recordData.files.forEach((file: File) => {
      formData.append("files", file);
    });
  }

  return formData;
};

export const useCreateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => {
      // Create FormData for file uploads
      const formData = createRecordFormData(data);

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      return recordsApi.create(formData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch records list
      queryClient.invalidateQueries({ queryKey: recordsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recordsKeys.restricted() });
      queryClient.invalidateQueries({ queryKey: recordsKeys.confidential() });
    },
    onError: (error: any) => {
      console.error("Create record error:", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        message: error.message,
        fullError: error,
      });
    },
  });
};

export const useUpdateRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      // If updating with files, use FormData
      if (data.files && data.files.length > 0) {
        const formData = createRecordFormData(data);
        return recordsApi.update(id, formData);
      } else {
        // Regular JSON update if no files
        return recordsApi.update(id, data);
      }
    },
    onSuccess: (_, { id }) => {
      // Invalidate specific record and lists
      queryClient.invalidateQueries({ queryKey: recordsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recordsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recordsKeys.restricted() });
      queryClient.invalidateQueries({ queryKey: recordsKeys.confidential() });
    },
    onError: (error: any) => {
      console.error("Update record error:", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        message: error.message,
        fullError: error,
      });
    },
  });
};

export const useDeleteRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recordsApi.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: recordsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recordsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recordsKeys.restricted() });
      queryClient.invalidateQueries({ queryKey: recordsKeys.confidential() });
    },
  });
};
