// components/common/StatCard.tsx
import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "../../../components/ui/Card";

interface StatCardProps {
  name: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: LucideIcon;
  color: "red" | "yellow" | "green" | "purple" | "red" | "gray";
}

export const StatCard: React.FC<StatCardProps> = ({
  name,
  value = "0",
  change,
  changeType,
  icon: Icon,
  color,
}) => {
  const getStatColor = (colorKey: string) => {
    const colors: { [key: string]: string } = {
      red: "text-red-600 bg-red-100",
      yellow: "text-yellow-600 bg-yellow-100",
      green: "text-green-600 bg-green-100",
      purple: "text-purple-600 bg-purple-100",
      red: "text-red-600 bg-red-100",
      gray: "text-gray-600 bg-gray-100",
    };
    return colors[colorKey] || colors.gray;
  };

  return (
    <Card padding="sm">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-lg ${getStatColor(color)}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {name}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {changeType && change && (
                <div
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  changeType === "increase" ? "text-green-600" : "text-red-600"
                }`}
              >
                {changeType === "increase" ? (
                  <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                ) : (
                  <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                )}
                <span className="sr-only">
                  {changeType === "increase" ? "Increased" : "Decreased"} by
                </span>
                {change}
              </div>
              )}
              
            </dd>
          </dl>
        </div>
      </div>
    </Card>
  );
};
