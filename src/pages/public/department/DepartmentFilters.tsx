import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface DepartmentFiltersProps {
  filterByRecords: string;
  sortBy: string;
  onFilterByRecordsChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onClearFilters: () => void;
}

export function DepartmentFilters({
  filterByRecords,
  sortBy,
  onFilterByRecordsChange,
  onSortByChange,
  onClearFilters,
}: DepartmentFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters & Sort</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Filter by Records
          </label>
          <select
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
            value={filterByRecords}
            onChange={(e) => onFilterByRecordsChange(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="with-records">With Records</option>
            <option value="no-records">No Records</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Sort By
          </label>
          <select
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="collections">Collections Count</option>
            <option value="records">Records Count</option>
            <option value="date">Date Created</option>
          </select>
        </div>

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
