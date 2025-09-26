import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../components/ui/Search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { fetchDepartments } from "../../store/slices/depatments/departmentThunk";
import type { RootState, AppDispatch } from "../../store";

export default function PublicDepartmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading } = useSelector(
    (state: RootState) => state.departments
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterByRecords, setFilterByRecords] = useState("all");

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter departments based on search query and record count
  const filteredDepartments = departments.filter((department) => {
    const matchesSearch =
      !searchQuery.trim() ||
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const recordsCount =
      department.collections?.reduce(
        (total, collection) => total + (collection.records?.length || 0),
        0
      ) || 0;

    const matchesFilter =
      filterByRecords === "all" ||
      (filterByRecords === "with-records" && recordsCount > 0) ||
      (filterByRecords === "no-records" && recordsCount === 0);

    return matchesSearch && matchesFilter;
  });

  // Sort departments
  const sortedDepartments = [...filteredDepartments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "collections":
        return (b.collections?.length || 0) - (a.collections?.length || 0);
      case "records":
        const aRecords: number =
          a.collections?.reduce(
            (total: number, collection: Collection) => total + (collection.records?.length || 0),
            0
          ) || 0;
        const bRecords =
          b.collections?.reduce(
            (total, collection) => total + (collection.records?.length || 0),
            0
          ) || 0;
        return bRecords - aRecords;
      case "date":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Browse Departments
          </h1>
          <p className="text-muted-foreground mb-4">
            Explore all departments, their collections, and records in our
            digital archive system.
          </p>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search departments..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
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
                    onChange={(e) => setFilterByRecords(e.target.value)}
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
                    onChange={(e) => setSortBy(e.target.value)}
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
                  onClick={() => {
                    setFilterByRecords("all");
                    setSortBy("name");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
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
              <Badge variant="outline">
                {sortedDepartments.length} departments found
              </Badge>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-3"></div>
                      <div className="h-3 bg-muted rounded mb-4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedDepartments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-muted-foreground mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No departments found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or filters to find what
                    you're looking for.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedDepartments.map((department) => {
                  const collectionsCount = department.collections?.length || 0;
                  const recordsCount =
                    department.collections?.reduce(
                      (total, collection) =>
                        total + (collection.records?.length || 0),
                      0
                    ) || 0;

                  return (
                    <Card
                      key={department.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-foreground text-lg">
                            {department.name}
                          </h3>
                          <div className="flex flex-col gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {collectionsCount} collections
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {recordsCount} records
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {department.description}
                        </p>

                        {/* Collections Preview */}
                        {department.collections &&
                          department.collections.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-foreground mb-2">
                                Collections:
                              </h4>
                              <div className="space-y-1">
                                {department.collections
                                  .slice(0, 3)
                                  .map((collection) => (
                                    <div
                                      key={collection.id}
                                      className="flex items-center justify-between text-xs"
                                    >
                                      <span className="text-muted-foreground truncate">
                                        {collection.title}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs ml-2"
                                      >
                                        {collection.records?.length || 0}
                                      </Badge>
                                    </div>
                                  ))}
                                {department.collections.length > 3 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{department.collections.length - 3} more
                                    collections
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-primary hover:text-primary/80"
                            asChild
                          >
                            <a href={`/public/departments/${department.id}`}>
                              Browse Department →
                            </a>
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            Created{" "}
                            {new Date(
                              department.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
