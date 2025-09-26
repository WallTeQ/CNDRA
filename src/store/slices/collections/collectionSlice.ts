import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCollections,
  addCollection,
  updateCollection,
  deleteCollection,
} from "./collectionThunk";

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

interface CollectionState {
  collections: Collection[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionState = {
  collections: [],
  loading: false,
  error: null,
};

const collectionSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCollections: (state) => {
      state.collections = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the API response structure
        state.collections = action.payload.data || action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCollection.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the API response structure
        const newCollection = action.payload.data || action.payload;
        state.collections.push(newCollection);
      })
      .addCase(addCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCollection = action.payload.data || action.payload;
        const index = state.collections.findIndex(
          (col) => col.id === updatedCollection.id
        );
        if (index !== -1) {
          state.collections[index] = updatedCollection;
        }
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = state.collections.filter(
          (col) => col.id !== action.payload
        );
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCollections } = collectionSlice.actions;
export default collectionSlice.reducer;
