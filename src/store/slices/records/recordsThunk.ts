import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const fetchRecords = createAsyncThunk("records/fetch", async (params?: { collectionId?: string; departmentId?: string; limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params?.collectionId) queryParams.append('collectionId', params.collectionId);
  if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const url = `/records${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await api.get(url);
  return response.data.data;
});

export const addRecord = createAsyncThunk(
  "records/add",
  async (record: any) => {
    // Create FormData for file upload
    const formData = new FormData();

    // Append non-file fields
    formData.append("title", record.title);
    formData.append("description", record.description);
    formData.append("collectionId", record.collectionId);
    formData.append("accessLevel", record.accessLevel);

    // Append subject tags as JSON string or individual values
    if (record.subjectTags && record.subjectTags.length > 0) {
      // Option 1: As JSON string (if your backend expects it this way)
      formData.append("subjectTags", JSON.stringify(record.subjectTags));

      // Option 2: As individual values (uncomment if your backend expects this)
      // record.subjectTags.forEach((tag: string) => {
      //   formData.append('subjectTags[]', tag);
      // });
    }

    // Append files
    if (record.files && record.files.length > 0) {
      record.files.forEach((file: File) => {
        formData.append("files", file);
      });
    }

    const response = await api.post("/records", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

export const deleteRecord = createAsyncThunk(
  "records/delete",
  async (id: string) => {
    await api.delete(`/records/${id}`);
    return id;
  }
);

export const updateRecord = createAsyncThunk(
  "records/update",
  async ({ id, data }: { id: string; data: any }) => {
    // If updating with files, use FormData similar to addRecord
    if (data.files && data.files.length > 0) {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "files") {
          data.files.forEach((file: File) => {
            formData.append("files", file);
          });
        } else if (key === "subjectTags" && Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await api.put(`/records/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // Regular JSON update if no files
      const response = await api.put(`/records/${id}`, data);
      return response.data;
    }
  }
);

export const fetchRecordById = createAsyncThunk(
  "records/fetchById",
  async (id: string) => {
    const response = await api.get(`/records/${id}`);
    return response.data.data;
  }
);

export const fetchrestrictedRecords = createAsyncThunk(
  "records/fetchrestricted",
  async () => {
    const response = await api.get("/records/restricted");
    return response.data.data;
  }
);

export const fetchConfidentialRecords = createAsyncThunk(
  "records/fetchConfidential",
  async () => {
    const response = await api.get("/records/confidential");
    return response.data.data;
  }
);
