import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  requestOtp,
  verifyOtp,
  completeRegistration,
  login,
  getProfile,
  logout,
} from "./authThunk";
import {  tokenManager } from "../../../services/api";
import { AuthUser } from "../../../types/api";

// Auth state interface
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signupStep: 1 | 2 | 3;
  signupEmail: string;
  tempToken: string | null;
  verifiedOtpCode?: string | null;
  isInitialized: boolean; 
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signupStep: 1,
  signupEmail: "",
  tempToken: null,
  verifiedOtpCode: null,
  isInitialized: false, 
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSignupStep: (state, action: PayloadAction<1 | 2 | 3>) => {
      state.signupStep = action.payload;
    },
    setSignupEmail: (state, action: PayloadAction<string>) => {
      state.signupEmail = action.payload;
    },
    setVerifiedOtpCode: (state, action: PayloadAction<string>) => {
      state.verifiedOtpCode = action.payload;
    },
    resetSignup: (state) => {
      state.signupStep = 1;
      state.signupEmail = "";
      state.tempToken = null;
      state.verifiedOtpCode = null;
      tokenManager.removeTempToken();
    },
    initializeAuth: (state) => {
      if (state.isInitialized) return; // Prevent re-initialization
      
      const token = tokenManager.getToken();
      const tempToken = tokenManager.getTempToken();

      if (token) {
        state.isAuthenticated = true;
      }

      if (tempToken) {
        state.tempToken = tempToken;
      }

      state.isInitialized = true; 
    },
  },
  extraReducers: (builder) => {
    // Request OTP
    builder
      .addCase(requestOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.signupStep = 2;
        state.signupEmail = action.meta.arg.email;
      })
      .addCase(requestOtp.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to send OTP";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.signupStep = 3;
        state.tempToken = action.payload.data?.token || null;
        state.verifiedOtpCode = action.meta.arg.code;
      })
      .addCase(verifyOtp.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Invalid OTP";
      })
      .addCase(completeRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.signupStep = 1;
        state.signupEmail = "";
        state.tempToken = null;
        state.verifiedOtpCode = null;
      })
      .addCase(completeRegistration.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
      // Only set loading if we don't have a user yet
        if (!state.user) {
       state.isLoading = true;
      }
      state.error = null; // Clear any previous errors
      })
      .addCase(getProfile.fulfilled, (state, action) => {
    state.isLoading = false;
    state.user = action.payload; 
    state.isAuthenticated = true;
  })
  .addCase(getProfile.rejected, (state, action: any) => {
    state.isLoading = false;
    
    // Only clear auth if it's an authentication error
    if (action.payload?.status === 401 || action.error?.message?.includes('401')) {
      state.isAuthenticated = false;
      state.user = null;
      tokenManager.clearAll();
    }
    state.error = action.payload?.message || "Failed to load profile";
  })
    // Logout
    .addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.signupStep = 1;
      state.signupEmail = "";
      state.tempToken = null;
    });
  },
});

export const {
  clearError,
  setSignupStep,
  setSignupEmail,
  setVerifiedOtpCode,
  resetSignup,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
