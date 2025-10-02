import React from "react";
import { Building2, FileText, Database } from "lucide-react";
import { StatCard } from "../components/StatsCard";
import { Department } from "../../../types/departments";

interface DepartmentStatsProps {
  departments: Department[];
}

export const DepartmentStats: React.FC<DepartmentStatsProps> = ({
  departments,
}) => {
  const getRecordCount = (department: Department): number => {
    return (
      department.collections?.reduce(
        (sum, collection) => sum + (collection.records?.length || 0),
        0
      ) || 0
    );
  };

  const totalDepartments = departments.length;
  const totalCollections = departments.reduce(
    (sum, d) => sum + (d.collections?.length || 0),
    0
  );
  const totalRecords = departments.reduce(
    (sum, d) => sum + getRecordCount(d),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        name="Total Departments"
        value={totalDepartments.toString()}
        change=""
        changeType="increase"
        icon={Building2}
        color="blue"
      />

      <StatCard
        name="Total Collections"
        value={totalCollections.toString()}
        change=""
        changeType="increase"
        icon={FileText}
        color="yellow"
      />

      <StatCard
        name="Total Records"
        value={totalRecords.toString()}
        change=""
        changeType="increase"
        icon={Database}
        color="green"
      />
    </div>
  );
};
