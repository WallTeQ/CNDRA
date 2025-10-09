import React from "react";
import { Search, Filter } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: any;
  setFilters: (filters: any) => void;
  records: any[];
  onSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  records,
  onSearch,
}) => {
  // Extract unique values from records for filter options
  const documentTypes = [
    ...new Set(
      records
        ?.filter((record) => record?.fileAssets && record.fileAssets.length > 0)
        .map(
          (record) => record.fileAssets[0]?.mimeType?.split("/")[1] || "unknown"
        )
    ),
  ];

  const collections = [
    ...new Set(records.map((record) => record?.collection?.title)),
  ];
  const accessLevels = ["PUBLIC", "INTERNAL", "CONFIDENTIAL"];

  return (
    <>
      {/* Search Bar */}
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && onSearch()}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="h-4 w-4" />}
            >
              Filters
            </Button>
            <Button onClick={onSearch} icon={<Search className="h-4 w-4" />}>
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                File Type
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {documentTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters((prev) => ({
                            ...prev,
                            type: [...prev.type, type],
                          }));
                        } else {
                          setFilters((prev) => ({
                            ...prev,
                            type: prev.type.filter((t) => t !== type),
                          }));
                        }
                      }}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-slate-600 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Collection
              </label>
              <select
                value={filters.collection}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    collection: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Collections</option>
                {collections.map((collection) => (
                  <option key={collection} value={collection}>
                    {collection}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  placeholder="Start date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="End date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Access Level
              </label>
              <div className="space-y-2">
                {accessLevels.map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.accessLevel.includes(level)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters((prev) => ({
                            ...prev,
                            accessLevel: [...prev.accessLevel, level],
                          }));
                        } else {
                          setFilters((prev) => ({
                            ...prev,
                            accessLevel: prev.accessLevel.filter(
                              (l) => l !== level
                            ),
                          }));
                        }
                      }}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-slate-600 capitalize">
                      {level.toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default SearchFilters;
