
import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {  Eye, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email required"),
  password: yup.string().required("Password required"),
});

type FormData = yup.InferType<typeof schema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [searchParams] = useSearchParams();

  const { login, isAuthenticated, error, clearError, isLoading, logout } =
    useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (searchParams.get("expired")) {
      logout(); // Clear any stale state
      setSessionExpired(true);
      window.history.replaceState({}, "", "/login");
    }
  }, [searchParams, logout]);

  const onSubmit = async (data: FormData) => {
    clearError();
    setSessionExpired(false);

    const { success, user } = await login(data);

    if (success && user) {
      const isAdmin = user.roles?.some((r: any) =>
        ["admin", "super-admin"].includes(r?.name)
      );
      navigate(isAdmin ? "/dashboard" : "/");
    }
  };

  if (isAuthenticated && !searchParams.get("expired")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          {/* <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Archive className="h-10 w-10 text-red-600" />
            <span className="text-2xl font-bold text-slate-900">
              National Archive
            </span>
          </Link> */}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Staff Login
          </h1>
          <p className="text-slate-600">Access the archive management system</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {sessionExpired && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
                Your session expired. Please log in again.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
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
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 ${
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
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
        </Card>

        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
};