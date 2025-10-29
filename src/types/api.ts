// API Response Types
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface ApiError {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
}

// Authentication API
export interface SignupRequestData {
  email: string;
}

export interface VerifyOtpData {
  email: string;
  code: string;
}

export interface CompleteRegistrationData {
  email: string;
  code: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RolePermission {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}
