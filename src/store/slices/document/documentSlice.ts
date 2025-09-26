import { createSlice,  PayloadAction } from "@reduxjs/toolkit";
import { deleteDocument, fetchDocumentById, fetchDocuments, createDocument, updateDocument } from "./documentThunk";
import { Document } from "../../../types";


// Documents state interface
interface DocumentsState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Initial state
const initialState: DocumentsState = {
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
};

// Documents slice
const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    clearCurrentDocument: (state) => {
      state.currentDocument = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Documents
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
        // Assuming API returns pagination info
        state.totalCount = action.payload.length;
      })
      .addCase(fetchDocuments.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch documents";
      });

    // Fetch Document by ID
    builder
      .addCase(fetchDocumentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDocument = action.payload;
      })
      .addCase(fetchDocumentById.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch document";
      });

    // Create Document
    builder
      .addCase(createDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createDocument.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to create document";
      });

    // Update Document
    builder
      .addCase(updateDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.documents.findIndex(
          (doc) => doc.id === action.payload.id
        );
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(updateDocument.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update document";
      });

    // Delete Document
    builder
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload
        );
        state.totalCount -= 1;
        if (state.currentDocument?.id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deleteDocument.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete document";
      });
  },
});

export const { clearError, setCurrentPage, setPageSize, clearCurrentDocument } =
  documentsSlice.actions;

export default documentsSlice.reducer;
