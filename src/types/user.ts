// types/user.types.ts
// export type UserRole = "super_admin" | "admin" | "staff" | "public";
export type UserStatus = "active" | "inactive" | "suspended";

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
export interface User {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  department?: string;
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
  createdDate: string;
  status: UserStatus;
}

export interface NewUserForm {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  permissions: string[];
}

export interface UserFilters {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  pageSize?: number;
}

export interface UpdateUserForm {
  name?: string;
  role?: UserRole;
  department?: string;
  permissions?: string[];
  status?: UserStatus;
}
