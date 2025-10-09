import React, { useState, useCallback } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Archive, Eye, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export const LoginPage: React.FC = React.memo(() => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    login,
    isAuthenticated,
    error,
    clearAuthError,
    isLoginLoading,
    user,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // ✅ Simplified submit handler - user data comes from login response
  const onSubmit = useCallback(
    async (data: FormData) => {
      clearAuthError();

      const { success, user: loggedInUser } = await login(data);

      if (success && loggedInUser) {
        // ✅ Check roles from the login response user object
        const roleNames =
          loggedInUser.roles?.map((role: any) => role?.name) || [];
        const isAdmin = roleNames.some((role: string) =>
          ["admin", "super-admin"].includes(role)
        );

        if (isAdmin) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    },
    [clearAuthError, login, navigate]
  );

  // ✅ Redirect if already authenticated (after user is loaded)
  if (isAuthenticated && user && !isLoginLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Archive className="h-10 w-10 text-red-600" />
            <span className="text-2xl font-bold text-slate-900">
              National Archive
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Staff Login
          </h1>
          <p className="text-slate-600">Access the archive management system</p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                  errors.email ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.password ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-red-600 hover:text-red-700">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={isLoginLoading}>
              {isLoginLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="text-center mb-4">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Create one here
                </Link>
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-900 mb-2">
                Demo Credentials
              </h3>
              <div className="text-sm text-red-700 space-y-1">
                <p>
                  <strong>Admin:</strong> chiamakaj2@gmail.com
                </p>
                <p>
                  <strong>Password:</strong> TestPass123!
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
});