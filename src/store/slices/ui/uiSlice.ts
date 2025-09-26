import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

interface UiState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toasts: Toast[];
  isLoading: boolean;
  loadingMessage: string;
}

const initialState: UiState = {
  sidebarOpen: false,
  theme: "light",
  toasts: [],
  isLoading: false,
  loadingMessage: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString(),
        duration: action.payload.duration || 5000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || "";
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addToast,
  removeToast,
  clearToasts,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
