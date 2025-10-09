import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({
  size = "md",
  className = "",
  message,
  fullScreen = true,
}: LoadingSpinnerProps) => {
  const sizeClasses: Record<LoadingSpinnerProps["size"], string> = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gray-50"
    : "inline-flex items-center";

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className={`flex flex-col items-center ${className}`}>
        <div
          aria-hidden="true"
          className={`animate-spin rounded-full border-2 border-gray-300 border-t-red-600 ${sizeClasses[size]}`}
        />
        {message && <p className="mt-2 text-gray-600">{message}</p>}
      </div>
    </div>
  );
};
