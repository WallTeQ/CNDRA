import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

// API Response interfaces
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Collection {
  id: string;
  title: string;
  description?: string;
  departments: Department[];
  createdAt: string;
  updatedAt: string;
}

interface CreateCollectionData {
  title: string;
  description?: string;
  departmentIds: string[];
}

interface UpdateCollectionData {
  title?: string;
  description?: string;
  departmentIds?: string[];
}

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Collection[]>>("/collections");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to fetch collections";
      return rejectWithValue(errorMessage);
    }
  }
);

export const addCollection = createAsyncThunk(
  "collections/addCollection",
  async (collectionData: CreateCollectionData, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Collection>>(
        "/collections",
        collectionData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to add collection";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCollection = createAsyncThunk(
  "collections/updateCollection",
  async (
    { id, updates }: { id: string; updates: UpdateCollectionData },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<Collection>>(
        `/collections/${id}`,
        updates
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to update collection";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  "collections/deleteCollection",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/collections/${id}`);
      return id;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to delete collection";
      return rejectWithValue(errorMessage);
    }
  }
);
