// components/dashboard/DashboardHeader.tsx
import React from "react";

interface DashboardHeaderProps {
  userName?: string;
  title?: string;
  subtitle?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  title,
  subtitle,
}) => {
  const defaultTitle = userName ? `Welcome back, ${userName}` : "Dashboard";
  const defaultSubtitle = "Here's what's happening with your archive today.";

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">
        {title || defaultTitle}
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        {subtitle || defaultSubtitle}
      </p>
    </div>
  );
};
