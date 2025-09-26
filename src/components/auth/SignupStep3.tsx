import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAuth } from "../../hooks/useAuth";

const schema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  displayName: yup
    .string()
    .min(2, "Display name must be at least 2 characters")
    .required("Display name is required"),
  phoneNumber: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
  placeOfBirth: yup.string().required("Place of birth is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  postalCode: yup.string().required("Postal code is required"),
  // Remove the 'code' field from the schema since we're getting it from Redux
});

type FormData = yup.InferType<typeof schema>;

interface SignupStep3Props {
  onBack: () => void;
  onComplete: () => void;
}

export const SignupStep3: React.FC<SignupStep3Props> = ({
  onBack,
  onComplete,
}) => {
  const {
    signupComplete,
    signupEmail,
    verifiedOtpCode, 
    isLoading,
    error,
    clearAuthError,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange", // Enable real-time validation
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    console.log("Form submission started");
    console.log("Form data:", data);
    console.log("Verified OTP code:", verifiedOtpCode);
    console.log("Signup email:", signupEmail);

    // Clear any previous errors
    setSubmitError(null);
    clearAuthError();

    // Check if we have the verified OTP code
    if (!verifiedOtpCode) {
      const errorMessage =
        "Verification code is missing. Please go back and verify your email.";
      console.error(errorMessage);
      setSubmitError(errorMessage);
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      return;
    }

    // Check if we have the signup email
    if (!signupEmail) {
      const errorMessage =
        "Email is missing. Please start the registration process again.";
      console.error(errorMessage);
      setSubmitError(errorMessage);
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      return;
    }

    try {
      console.log("Calling signupComplete...");
      const success = await signupComplete({
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

      console.log("signupComplete result:", success);

      if (success) {
        console.log("Registration successful, calling onComplete");
        onComplete();
      } else {
        const errorMessage = "Registration failed. Please try again.";
        console.error(errorMessage);
        setSubmitError(errorMessage);
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage =
        err.message || "Registration failed. Please try again.";
      setSubmitError(errorMessage);
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

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
  const isFormDisabled = isLoading || isSubmitting;

  // Debug info (remove in production)
  console.log(
    "Component render - isLoading:",
    isLoading,
    "isSubmitting:",
    isSubmitting,
    "errors:",
    errors
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-slate-600">
          Fill in your details to complete your National Archive account
          registration.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Display */}
        {(error || submitError || errors.root) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error || submitError || errors.root?.message}
          </div>
        )}

        {/* Debug Info - Remove in production */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <p>Debug Info:</p>
          <p>verifiedOtpCode: {verifiedOtpCode || "Not available"}</p>
          <p>signupEmail: {signupEmail || "Not available"}</p>
          <p>isLoading: {isLoading.toString()}</p>
          <p>Form errors: {Object.keys(errors).length}</p>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Full Name *
              </label>
              <input
                {...register("displayName")}
                type="text"
                id="displayName"
                disabled={isFormDisabled}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.displayName ? "border-red-300" : "border-slate-300"
                } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="Enter your full name"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.displayName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Phone Number *
              </label>
              <input
                {...register("phoneNumber")}
                type="tel"
                id="phoneNumber"
                disabled={isFormDisabled}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phoneNumber ? "border-red-300" : "border-slate-300"
                } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Date of Birth *
              </label>
              <input
                {...register("dateOfBirth")}
                type="date"
                id="dateOfBirth"
                disabled={isFormDisabled}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dateOfBirth ? "border-red-300" : "border-slate-300"
                } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="placeOfBirth"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Place of Birth *
              </label>
              <input
                {...register("placeOfBirth")}
                type="text"
                id="placeOfBirth"
                disabled={isFormDisabled}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.placeOfBirth ? "border-red-300" : "border-slate-300"
                } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            Address Information
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Street Address *
              </label>
              <input
                {...register("address")}
                type="text"
                id="address"
                disabled={isFormDisabled}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? "border-red-300" : "border-slate-300"
                } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  City *
                </label>
                <input
                  {...register("city")}
                  type="text"
                  id="city"
                  disabled={isFormDisabled}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.city ? "border-red-300" : "border-slate-300"
                  } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  State *
                </label>
                <input
                  {...register("state")}
                  type="text"
                  id="state"
                  disabled={isFormDisabled}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.state ? "border-red-300" : "border-slate-300"
                  } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="NY"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Postal Code *
                </label>
                <input
                  {...register("postalCode")}
                  type="text"
                  id="postalCode"
                  disabled={isFormDisabled}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.postalCode ? "border-red-300" : "border-slate-300"
                  } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="10001"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Country *
              </label>
              <input
                {...register("country")}
                type="text"
                id="country"
                disabled={isFormDisabled}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.country ? "border-red-300" : "border-slate-300"
                } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
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

        {/* Security Information */}
        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-4">
            Security Information
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  disabled={isFormDisabled}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? "border-red-300" : "border-slate-300"
                  } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isFormDisabled}
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
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
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
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  disabled={isFormDisabled}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-slate-300"
                  } ${isFormDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isFormDisabled}
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
            onClick={onBack}
            disabled={isFormDisabled}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <Button
            type="submit"
            disabled={isFormDisabled}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            {isFormDisabled ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <CheckCircle className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
