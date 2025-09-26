import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  authApi,
  tokenManager,
} from "../../../services/api";
import {
  SignupRequestData,
  VerifyOtpData,
  CompleteRegistrationData,
  LoginData,
} from "../../../types/api";

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (data: SignupRequestData, { rejectWithValue }) => {
    try {
      const response = await authApi.requestOtp(data);
      console.log("RequestOTP response:", response);
      return response;
    } catch (error: any) {
      console.error("RequestOTP error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: VerifyOtpData, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(data);
      console.log("VerifyOTP response:", response);
      if (response.data?.token) {
        tokenManager.setTempToken(response.data.token);
      }
      return response;
    } catch (error: any) {
      console.error("VerifyOTP error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Invalid OTP" }
      );
    }
  }
);

export const completeRegistration = createAsyncThunk(
  "auth/completeRegistration",
  async (data: CompleteRegistrationData, { rejectWithValue }) => {
    try {
      const response = await authApi.completeRegistration(data);
      console.log("CompleteRegistration response:", response);

      // Handle both possible response structures
      const authData = response.data || response;
      if (authData?.access_token) {
        tokenManager.removeTempToken();
        tokenManager.setToken(authData.access_token);
      }
      return authData;
    } catch (error: any) {
      console.error("CompleteRegistration error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      console.log("Login response:", response);

      // Handle both possible response structures
      const authData = response.data || response;
      if (authData?.access_token) {
        tokenManager.setToken(authData.access_token);
      }
      return authData;
    } catch (error: any) {
      console.error("Login error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      console.log("GetProfile response:", response);
      const userData = response.data;
      console.log("Extracted user data:", userData);
      return userData;
    } catch (error: any) {
      console.error("GetProfile error:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to get profile" }
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      tokenManager.clearAll();
      return null;
    } catch (error: any) {
      tokenManager.clearAll();
      return null;
    }
  }
);
