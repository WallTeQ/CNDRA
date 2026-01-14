import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

type FormData = yup.InferType<typeof schema>;

export const SignupStep1: React.FC = () => {
  const { signupRequestOtp, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    clearError();
    await signupRequestOtp(data);
    // Step automatically advances in context
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Create Your Account
        </h2>
        <p className="text-slate-600">
          Enter your email address to get started with your National Archive
          account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            type="email"
            id="email"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
              errors.email ? "border-red-300" : "border-slate-300"
            }`}
            placeholder="Enter your email address"
            autoFocus
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          {isLoading ? "Sending code..." : "Send Verification Code"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Sign in
          </a>
        </p>
      </div>
    </Card>
  );
};