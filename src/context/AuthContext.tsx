import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authApi, tokenManager } from "../services/api";
import {
  AuthUser,
  LoginData,
  SignupRequestData,
  VerifyOtpData,
  CompleteRegistrationData,
} from "../types/api";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Signup state
  signupStep: 1 | 2 | 3;
  signupEmail: string;
  verifiedOtpCode: string | null;

  // Auth actions
  login: (
    data: LoginData
  ) => Promise<{ success: boolean; user: AuthUser | null }>;
  logout: () => void;

  // Signup actions
  signupRequestOtp: (data: SignupRequestData) => Promise<boolean>;
  signupVerifyOtp: (data: VerifyOtpData) => Promise<boolean>;
  signupComplete: (data: CompleteRegistrationData) => Promise<boolean>;
  setSignupStep: (step: 1 | 2 | 3) => void;
  setSignupEmail: (email: string) => void;
  resetSignup: () => void;

  // Utilities
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Signup state
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [signupEmail, setSignupEmail] = useState("");
  const [verifiedOtpCode, setVerifiedOtpCode] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        try {
          const response = await authApi.getProfile();
          setUser(response.data);
          console.log("User profile loaded on init", response.data);
        } catch (_err) {
          tokenManager.clearAll();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  console.log("AuthContext user:", user);

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(data);
      const authData = response.data || response;

      if (authData?.access_token) {
        tokenManager.setToken(authData.access_token);
      }

      setUser(authData.user);
      setIsLoading(false);
      return { success: true, user: authData.user };
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, user: null };
    }
  }, []);

  const logout = useCallback(() => {
    tokenManager.clearAll();
    setUser(null);
    setError(null);
  }, []);

  const signupRequestOtp = useCallback(async (data: SignupRequestData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.requestOtp(data);
      setSignupEmail(data.email);
      setSignupStep(2);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
      setIsLoading(false);
      return false;
    }
  }, []);

  const signupVerifyOtp = useCallback(async (data: VerifyOtpData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.verifyOtp(data);
      if (response.data?.token) {
        tokenManager.setTempToken(response.data.token);
      }
      setVerifiedOtpCode(data.code);
      setSignupStep(3);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
      setIsLoading(false);
      return false;
    }
  }, []);

  const signupComplete = useCallback(async (data: CompleteRegistrationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.completeRegistration(data);
      const authData = response.data || response;

      if (authData?.access_token) {
        tokenManager.removeTempToken();
        tokenManager.setToken(authData.access_token);
      }

      setUser(authData.user);
      resetSignup();
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      setIsLoading(false);
      return false;
    }
  }, []);

  const resetSignup = useCallback(() => {
    setSignupStep(1);
    setSignupEmail("");
    setVerifiedOtpCode(null);
    tokenManager.removeTempToken();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const hasRole = useCallback(
    (role: string) => {
      return user?.roles?.some((r) => r?.name === role) || false;
    },
    [user]
  );

  // const hasAnyRole = useCallback(
  //   (roles: string[]) => {
  //     if (!user?.roles || !Array.isArray(user.roles) || !Array.isArray(roles)) {
  //       return false;
  //     }
  //     return user.roles.some((r) => r?.name && roles.includes(r.name));
  //   },
  //   [user]
  // );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return roles.some((role) => hasRole(role));
    },
    [hasRole]
  );

  const isAdmin = useCallback(() => {
    return hasRole("admin") || hasRole("super-admin");
  }, [hasRole]);

  const isSuperAdmin = useCallback(() => {
    return hasRole("super-admin");
  }, [hasRole]);

 

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signupStep,
        signupEmail,
        verifiedOtpCode,
        login,
        logout,
        signupRequestOtp,
        signupVerifyOtp,
        signupComplete,
        setSignupStep,
        setSignupEmail,
        resetSignup,
        clearError,
        hasRole,
        hasAnyRole,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
