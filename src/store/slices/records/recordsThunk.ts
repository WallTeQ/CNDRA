

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const fetchRecords = createAsyncThunk(
  "records/fetch",
  async (params?: {
    collectionId?: string;
    departmentId?: string;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.collectionId)
      queryParams.append("collectionId", params.collectionId);
    if (params?.departmentId)
      queryParams.append("departmentId", params.departmentId);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const url = `/records${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await api.get(url);
    return response.data.data;
  }
);

export const addRecord = createAsyncThunk(
  "records/add",
  async (record: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append non-file fields
      formData.append("title", record.title);
      formData.append("description", record.description);
      formData.append("collectionId", record.collectionId);
      formData.append("accessLevel", record.accessLevel);

      // Append subject tags - try multiple approaches
      if (record.subjectTags && record.subjectTags.length > 0) {
        // Try appending as individual values first (most common approach)
        record.subjectTags.forEach((tag: string) => {
          formData.append("subjectTags", tag);
        });
      }

      // Append files
      if (record.files && record.files.length > 0) {
        record.files.forEach((file: File) => {
          formData.append("files", file);
        });
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await api.post("/records", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("Add record error:", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        message: error.message,
        fullError: error,
      });
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const deleteRecord = createAsyncThunk(
  "records/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/records/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRecord = createAsyncThunk(
  "records/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      // If updating with files, use FormData similar to addRecord
      if (data.files && data.files.length > 0) {
        const formData = new FormData();

        // Append all non-file, non-array fields
        Object.keys(data).forEach((key) => {
          if (key === "files") {
            data.files.forEach((file: File) => {
              formData.append("files", file);
            });
          } else if (key === "subjectTags" && Array.isArray(data[key])) {
            // Append tags individually
            data[key].forEach((tag: string) => {
              formData.append("subjectTags", tag);
            });
          } else if (data[key] !== undefined && data[key] !== null) {
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
    } catch (error: any) {
      console.error(
        "Update record error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRecordById = createAsyncThunk(
  "records/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/records/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchrestrictedRecords = createAsyncThunk(
  "records/fetchrestricted",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/records/restricted");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchConfidentialRecords = createAsyncThunk(
  "records/fetchConfidential",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/records/confidential");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);