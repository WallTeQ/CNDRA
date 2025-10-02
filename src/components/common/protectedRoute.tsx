import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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

  // Show loading while checking authentication, initializing, or fetching user profile
  if (isLoading || !isInitialized || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {!isInitialized
              ? "Loading..."
              : isAuthenticated && !user
              ? "Loading..."
              : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
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
