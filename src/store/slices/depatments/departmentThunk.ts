import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  collections?: Array<{
    id: string;
    title: string;
    description: string;
    records: any[];
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Department[]>("/departments");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch departments"
      );
    }
  }
);

export const addDepartment = createAsyncThunk(
  "departments/addDepartment",
  async (
    departmentData: { name: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<Department>(
        "/departments",
        departmentData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to add department"
      );
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async (
    {
      id,
      updates,
    }: { id: string; updates: { name?: string; description?: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<Department>(`/departments/${id}`, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update department"
      );
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/departments/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to delete department"
      );
    }
  }
);
