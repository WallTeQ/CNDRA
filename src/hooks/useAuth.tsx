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
      console.log(
        "useAuth: Fetching profile because authenticated but no user data"
      );
      dispatch(getProfile());
    }
  }, [dispatch, isInitialized, isAuthenticated, user, isLoading]);

  const login = async (data: LoginData) => {
    const result = await dispatch(loginAction(data));
    return result.type === "auth/login/fulfilled";
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
    return result.type === "auth/completeRegistration/fulfilled";
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

  const refreshProfile = async () => {
    if (isAuthenticated) {
      await dispatch(getProfile());
    }
  };

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

  const isAdmin = (): boolean => {
    return hasAnyRole(["admin", "super-admin"]);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole("super-admin");
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
