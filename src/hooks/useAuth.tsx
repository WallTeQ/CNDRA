import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  initializeAuth as initializeAuthAction,
  clearError,
  resetSignup,
  setSignupStep,
  setSignupEmail,
} from "../store/slices/auth/authSlice";
import {
  getProfile,
  requestOtp,
  verifyOtp,
  completeRegistration,
  login as loginAction,
  logout as logoutAction,
} from "../store/slices/auth/authThunk";
import {
  SignupRequestData,
  VerifyOtpData,
  CompleteRegistrationData,
  LoginData,
} from "../types/api";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const hasInitializedRef = useRef(false);

  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    signupStep,
    signupEmail,
    tempToken,
    verifiedOtpCode,
    isInitialized,
  } = useAppSelector((state) => state.auth);

  // Initialize auth only once on mount
  useEffect(() => {
    if (!hasInitializedRef.current && !isInitialized) {
      hasInitializedRef.current = true;
      dispatch(initializeAuthAction());
    }
  }, [dispatch, isInitialized]);

  // Fetch profile when authenticated but no user data
  useEffect(() => {
    if (isInitialized && isAuthenticated && !user && !isLoading) {
      dispatch(getProfile());
    }
  }, []);

  const login = async (data: LoginData) => {
    const result = await dispatch(loginAction(data));
    const success = result.type === "auth/login/fulfilled";
    if (success) {
      await dispatch(getProfile());
    }
    const userData = success ? (result.payload as any)?.user : null;
    return { success, user: userData };
  };

  const logout = async () => {
    await dispatch(logoutAction());
  };

  const signupRequestOtp = async (data: SignupRequestData) => {
    const result = await dispatch(requestOtp(data));
    return result.type === "auth/requestOtp/fulfilled";
  };

  const signupVerifyOtp = async (data: VerifyOtpData) => {
    const result = await dispatch(verifyOtp(data));
    return result.type === "auth/verifyOtp/fulfilled";
  };

  const signupComplete = async (data: CompleteRegistrationData) => {
    const result = await dispatch(completeRegistration(data));
    const success = result.type === "auth/completeRegistration/fulfilled";
    if (success) {
      await dispatch(getProfile());
    }
    return success;
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const resetSignupFlow = () => {
    dispatch(resetSignup());
  };

  const setCurrentSignupStep = (step: 1 | 2 | 3) => {
    dispatch(setSignupStep(step));
  };

  const setCurrentSignupEmail = (email: string) => {
    dispatch(setSignupEmail(email));
  };

  // const refreshProfile = async () => {
  //   if (isAuthenticated) {
  //     await dispatch(getProfile());
  //   }
  // };

  const initializeAuth = () => {
    if (!hasInitializedRef.current && !isInitialized) {
      hasInitializedRef.current = true;
      dispatch(initializeAuthAction());
    }
  };

  // Helper functions with null checks
  const hasRole = (roleName: string): boolean => {
    if (!user?.roles || !Array.isArray(user.roles)) {
      return false;
    }
    return user.roles.some((role) => role?.name === roleName);
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    if (
      !user?.roles ||
      !Array.isArray(user.roles) ||
      !Array.isArray(roleNames)
    ) {
      return false;
    }
    return user.roles.some(
      (role) => role?.name && roleNames.includes(role.name)
    );
  };

  const isAdmin = (): string | null => {
    if (hasRole("super-admin")) return "super-admin";
    if (hasRole("admin")) return "admin";
    return null;
  };

  const isSuperAdmin = (): string | null => {
    return hasRole("super-admin") ? "super-admin" : null;
  };

  // Computed loading state - consider loading if not initialized or actively loading
  const computedIsLoading = !isInitialized || isLoading;

  return {
    // State
    user,
    isAuthenticated,
    isLoading: computedIsLoading, // For app initialization
    isLoginLoading: isLoading, // For login-specific loading
    error,
    signupStep,
    signupEmail,
    tempToken,
    verifiedOtpCode,
    isInitialized,

    // Actions
    login,
    logout,
    signupRequestOtp,
    signupVerifyOtp,
    signupComplete,
    clearAuthError,
    resetSignupFlow,
    setCurrentSignupStep,
    setCurrentSignupEmail,
    refreshProfile,
    initializeAuth,

    // Helper functions
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
  };
};
