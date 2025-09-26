import { createAsyncThunk } from "@reduxjs/toolkit";
import { documentsApi } from "../../../services/api";

// Async thunks
export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (params?: any, { rejectWithValue }) => {
    try {
      const response = await documentsApi.getAll(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch documents" }
      );
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  "documents/fetchDocumentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await documentsApi.getById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch document" }
      );
    }
  }
);

export const createDocument = createAsyncThunk(
  "documents/createDocument",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await documentsApi.create(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create document" }
      );
    }
  }
);

export const updateDocument = createAsyncThunk(
  "documents/updateDocument",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await documentsApi.update(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update document" }
      );
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "documents/deleteDocument",
  async (id: string, { rejectWithValue }) => {
    try {
      await documentsApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete document" }
      );
    }
  }
);
