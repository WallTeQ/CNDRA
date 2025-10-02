
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Search, RefreshCw, Filter } from "lucide-react";

interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CollectionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
  departments: Department[];
  onRefresh: () => void;
}

export default function CollectionFilters({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  departments,
  onRefresh,
}: CollectionFiltersProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            className="flex h-10 w-full lg:w-48 rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="whitespace-nowrap"
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="whitespace-nowrap"
              icon={<Filter className="w-4 h-4" />}
            >
              Advanced Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
