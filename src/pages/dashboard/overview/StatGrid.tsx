
import React from "react";
import { LucideIcon } from "lucide-react";
import { StatCard } from "../components/StatsCard";

interface StatItem {
  name: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: LucideIcon;
  color: "red" | "yellow" | "green" | "purple" | "red" | "gray";
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  className = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8",
}) => {
  return (
    <div className={className}>
      {stats.map((stat) => (
        <StatCard
          key={stat.name}
          name={stat.name}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};
