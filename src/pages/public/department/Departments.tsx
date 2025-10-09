import { useState } from "react";
import { SearchBar } from "../../../components/ui/Search-bar";
import { Badge } from "../../../components/ui/Badge";
import { DepartmentFilters } from "./DepartmentFilters";
import { DepartmentCard } from "./DepartmentCard";
import { EmptyState } from "./EmptyState";
import { LoadingSkeleton } from "../../../components/common/LoadingSkeleton";
import { filterDepartments, sortDepartments } from "./DepartmentUtils";
import { useDepartments } from "../../../hooks/useDepartments";

export default function PublicDepartmentsPage() {
  const { data: departments = [], isLoading: loading } = useDepartments();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterByRecords, setFilterByRecords] = useState("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setFilterByRecords("all");
    setSortBy("name");
    setSearchQuery("");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Filter and sort departments
  const filteredDepartments = filterDepartments(
    departments,
    searchQuery,
    filterByRecords
  );
  const sortedDepartments = sortDepartments(filteredDepartments, sortBy);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Browse Departments
        </h1>
        <p className="text-muted-foreground mb-4">
          Explore all departments, their collections, and records in our digital
          archive system.
        </p>
        <div className="mt-4 mb-8 text-sm text-muted-foreground leading-relaxed space-y-3">
          <p className="">
            The National Archives of Liberia preserves records from various
            government ministries, agencies, and public offices. <br /> Each department
            holds a unique collection of documents that capture the nation’s
            governance, development, and historical growth over the years.
          </p>
          <p>
            Browse through the list of departments to explore their available
            public records and discover valuable insights into Liberia’s
            administrative and cultural evolution.
          </p>
          <p>
            Use the search and filter options below to quickly find departments
            or collections of interest.
          </p>
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search departments..."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <DepartmentFilters
            filterByRecords={filterByRecords}
            sortBy={sortBy}
            onFilterByRecordsChange={setFilterByRecords}
            onSortByChange={setSortBy}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Departments ({sortedDepartments.length})
              </h2>
              {searchQuery && (
                <p className="text-muted-foreground">
                  Results for "{searchQuery}"
                </p>
              )}
            </div>
            <Badge>{sortedDepartments.length} departments found</Badge>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : sortedDepartments.length === 0 ? (
            <EmptyState onClearSearch={handleClearSearch} title="department" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedDepartments.map((department) => (
                <DepartmentCard key={department.id} department={department} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}