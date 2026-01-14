import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Shield, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object({
  code: yup
    .string()
    .matches(/^\d{6}$/, "Code must be 6 digits")
    .required("Verification code is required"),
});

type FormData = yup.InferType<typeof schema>;

export const SignupStep2: React.FC = () => {
  const {
    signupVerifyOtp,
    signupRequestOtp,
    signupEmail,
    setSignupStep,
    isLoading,
    error,
    clearError,
  } = useAuth();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const code = watch("code");

  const onSubmit = useCallback(
    async (data: FormData) => {
      clearError();
      await signupVerifyOtp({ email: signupEmail, code: data.code });
    },
    [clearError, signupVerifyOtp, signupEmail]
  );

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (code?.length === 6 && /^\d{6}$/.test(code)) {
      handleSubmit(onSubmit)();
    }
  }, [code, handleSubmit, onSubmit]);

  const handleResend = async () => {
    if (!canResend) return;
    clearError();
    setCanResend(false);
    setTimeLeft(600);
    await signupRequestOtp({ email: signupEmail });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-slate-600 mb-2">We've sent a 6-digit code to:</p>
        <p className="font-medium text-slate-900">{signupEmail}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Verification Code
          </label>
          <input
            {...register("code")}
            type="text"
            id="code"
            maxLength={6}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-center text-2xl font-mono tracking-widest ${
              errors.code ? "border-red-300" : "border-slate-300"
            }`}
            placeholder="000000"
            autoComplete="one-time-code"
            autoFocus
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div className="text-center text-sm text-slate-600">
          {timeLeft > 0 ? (
            <p>Code expires in {formatTime(timeLeft)}</p>
          ) : (
            <p className="text-red-600">Code has expired</p>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSignupStep(1)}
            icon={<ArrowLeft className="h-4 w-4" />}
            className="flex-1"
          >
            Back
          </Button>

          <Button
            type="submit"
            icon={<ArrowRight className="h-4 w-4" />}
            className="flex-1"
            disabled={isLoading || !code || code.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className={`text-sm font-medium flex items-center justify-center space-x-1 mx-auto ${
              canResend && !isLoading
                ? "text-red-600 hover:text-red-700"
                : "text-slate-400 cursor-not-allowed"
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Resend Code</span>
          </button>
        </div>
      </form>
    </Card>
  );
};