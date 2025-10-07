import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../ui/LoadingSpinner";
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireAdmin?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireAdmin = false,
  fallbackPath = "/login",
}) => {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const location = useLocation();
 console.log("🛡️ ProtectedRoute check:", {
   isInitialized,
   isLoading,
   isAuthenticated,
   hasUser: !!user,
   path: location.pathname,
 });

  // ✅ Show loading only while initializing
  if (!isInitialized || isLoading) {
    return <LoadingSpinner size="md" message="Loading..." />;
  }

  // ✅ Redirect to login if not authenticated or no user
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check if admin access is required
  if (requireAdmin) {
    const userRoles = user?.roles || [];
    const roleNames = userRoles.map((role) => role?.name).filter(Boolean);
    const isAdmin = roleNames.some((roleName) =>
      ["admin", "super-admin"].includes(roleName)
    );

    if (!isAdmin) {
      return (
        <Navigate
          to="/"
          state={{
            from: location,
            message:
              "You don't have permission to access this area. Admin or Super Admin role required.",
          }}
          replace
        />
      );
    }
  }

  // Check specific roles if provided
  if (requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    const roleNames = userRoles.map((role) => role?.name).filter(Boolean);
    const hasRequiredRole = roleNames.some((roleName) =>
      requiredRoles.includes(roleName)
    );

    if (!hasRequiredRole) {
      console.log("Access denied - missing required role");
      return (
        <Navigate
          to="/"
          state={{
            from: location,
            message: `You don't have permission to access this area. Required roles: ${requiredRoles.join(
              ", "
            )}`,
          }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
};