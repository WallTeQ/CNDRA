// types/user.types.ts
export type UserRole = "super_admin" | "admin" | "staff" | "public";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole;
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
