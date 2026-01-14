import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object({
  displayName: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  phoneNumber: yup
    .string()
    .matches(/^\+?[\d\s\-()\]]+$/, "Invalid phone number")
    .required("Phone is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  placeOfBirth: yup.string().required("Place of birth is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  postalCode: yup.string().required("Postal code is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Must contain uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password"),
});

type FormData = yup.InferType<typeof schema>;

export const SignupStep3: React.FC = () => {
  const {
    signupComplete,
    signupEmail,
    verifiedOtpCode,
    setSignupStep,
    isLoading,
    error,
    clearError,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    clearError();

    if (!verifiedOtpCode) {
      alert("Verification code missing. Please go back and verify your email.");
      return;
    }

    await signupComplete({
      email: signupEmail,
      code: verifiedOtpCode,
      password: data.password,
      displayName: data.displayName,
      phoneNumber: data.phoneNumber,
      dateOfBirth: data.dateOfBirth,
      placeOfBirth: data.placeOfBirth,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
    });
    // Context handles success automatically
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&]/.test(pwd)) strength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "bg-gray-300",
    };
  };

  const passwordStrength = getPasswordStrength(password || "");

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-slate-600">
          Fill in your details to complete registration.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                {...register("displayName")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                  errors.displayName ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                {...register("phoneNumber")}
                type="tel"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                  errors.phoneNumber ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth *
              </label>
              <input
                {...register("dateOfBirth")}
                type="date"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                  errors.dateOfBirth ? "border-red-300" : "border-slate-300"
                }`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Place of Birth *
              </label>
              <input
                {...register("placeOfBirth")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                  errors.placeOfBirth ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="City, State, Country"
              />
              {errors.placeOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.placeOfBirth.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Address</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Street Address *
              </label>
              <input
                {...register("address")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                  errors.address ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="123 Main Street"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City *
                </label>
                <input
                  {...register("city")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.city ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State *
                </label>
                <input
                  {...register("state")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.state ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Postal Code *
                </label>
                <input
                  {...register("postalCode")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.postalCode ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Country *
              </label>
              <input
                {...register("country")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                  errors.country ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="United States"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.password ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="Create a strong password"
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

              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-slate-300"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSignupStep(2)}
            icon={<ArrowLeft className="h-4 w-4" />}
            disabled={isLoading}
            className="flex-1"
          >
            Back
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            icon={<CheckCircle className="h-4 w-4" />}
            className="flex-1"
          >
            {isLoading ? "Creating Account..." : "Complete Registration"}
          </Button>
        </div>
      </form>
    </Card>
  );
};