import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Tag,
  Archive,
} from "lucide-react";
import { Header } from "../../components/common/Header";
import { Footer } from "../../components/common/Footer";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchRecords } from "../../store/slices/records/recordsThunk";

interface SearchFilters {
  keyword: string;
  type: string[];
  dateRange: { start: string; end: string };
  author: string;
  collection: string;
  accessLevel: string[];
}

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    type: [],
    dateRange: { start: "", end: "" },
    author: "",
    collection: "",
    accessLevel: [],
  });

  const dispatch = useAppDispatch();
  const { records, isLoading, error } = useAppSelector(
    (state) => state.records
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRecords, setFilteredRecords] = useState(records);

  const documentsPerPage = 6;
  const totalPages = Math.ceil(filteredRecords.length / documentsPerPage);
  const currentDocuments = filteredRecords.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  // Extract unique values from records for filter options
  const documentTypes = [
    ...new Set(
      records.map(
        (record) => record.fileAssets[0]?.mimeType.split("/")[1] || "unknown"
      )
    ),
  ];

  const collections = [
    ...new Set(records.map((record) => record.collection.title)),
  ];
  const accessLevels = ["PUBLIC", "INTERNAL", "CONFIDENTIAL"];

  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  useEffect(() => {
    setFilteredRecords(records);
  }, [records]);

  const handleSearch = () => {
    let filtered = records;

    // Search by query
    if (searchQuery) {
      filtered = filtered.filter(
        (record) =>
          record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          record.subjectTags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by file type
    if (filters.type.length > 0) {
      filtered = filtered.filter((record) => {
        const fileType =
          record.fileAssets[0]?.mimeType.split("/")[1] || "unknown";
        return filters.type.includes(fileType);
      });
    }

    // Filter by collection
    if (filters.collection) {
      filtered = filtered.filter((record) =>
        record.collection.title
          .toLowerCase()
          .includes(filters.collection.toLowerCase())
      );
    }

    // Filter by access level
    if (filters.accessLevel.length > 0) {
      filtered = filtered.filter((record) =>
        filters.accessLevel.includes(record.accessLevel)
      );
    }

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.createdAt);
        const startDate = filters.dateRange.start
          ? new Date(filters.dateRange.start)
          : new Date("1900-01-01");
        const endDate = filters.dateRange.end
          ? new Date(filters.dateRange.end)
          : new Date();

        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    setFilteredRecords(filtered);
    setCurrentPage(1);
  };

  const getTypeColor = (
    fileType: string
  ): "default" | "success" | "warning" | "danger" | "info" => {
    const colors: {
      [key: string]: "default" | "success" | "warning" | "danger" | "info";
    } = {
      pdf: "danger",
      doc: "info",
      docx: "info",
      txt: "default",
      jpg: "warning",
      jpeg: "warning",
      png: "warning",
      gif: "warning",
      mp3: "info",
      mp4: "success",
      avi: "success",
      unknown: "default",
    };
    return colors[fileType] || "default";
  };

  const getAccessLevelColor = (
    level: string
  ): "default" | "success" | "warning" | "danger" => {
    switch (level) {
      case "PUBLIC":
        return "success";
      case "INTERNAL":
        return "warning";
      case "CONFIDENTIAL":
        return "danger";
      default:
        return "default";
    }
  };

  const formatFileSize = (sizeInBytes: string) => {
    const bytes = parseInt(sizeInBytes);
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  if (isLoading && records.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isPublic={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-48 bg-slate-200 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isPublic={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Archive className="mx-auto h-16 w-16 text-slate-400 mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Error Loading Records
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            We encountered an error while loading the records. Please try again
            later.
          </p>
          <Button onClick={() => dispatch(fetchRecords())}>Try Again</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Search Archives
          </h1>
          <p className="text-lg text-slate-600">
            Search through our collection of historical documents, photographs,
            and records.
          </p>
        </div>

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
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <Button
                onClick={handleSearch}
                className="flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
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
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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

        {/* Results */}
        <div className="mb-6">
          <p className="text-slate-600">
            Found {filteredRecords.length} documents
          </p>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentDocuments.map((record) => {
            const primaryFile = record.fileAssets[0];
            const fileType = primaryFile
              ? primaryFile.mimeType.split("/")[1]
              : "unknown";
            const fileSize = primaryFile
              ? formatFileSize(primaryFile.size)
              : "Unknown size";

            return (
              <Card key={record.id} className="overflow-hidden p-0" hover>
                {/* Document preview or placeholder */}
                {primaryFile &&
                ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
                  fileType.toLowerCase()
                ) ? (
                  <div className="w-full h-48 relative overflow-hidden bg-slate-100">
                    <img
                      src={primaryFile.storagePath}
                      alt={record.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback = target.parentElement?.querySelector(
                          ".fallback-placeholder"
                        );
                        fallback?.classList.remove("hidden");
                      }}
                    />
                    {/* Fallback placeholder (hidden by default) */}
                    <div className="fallback-placeholder hidden absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <div className="text-center">
                        <Archive className="h-12 w-12 text-indigo-300 mx-auto mb-2" />
                        <p className="text-sm text-indigo-600 font-medium">
                          {fileType.toUpperCase()} Image
                        </p>
                        <p className="text-xs text-indigo-500">{fileSize}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                      <Archive className="h-12 w-12 text-indigo-300 mx-auto mb-2" />
                      <p className="text-sm text-indigo-600 font-medium">
                        {fileType.toUpperCase()} Document
                      </p>
                      <p className="text-xs text-indigo-500">{fileSize}</p>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant={getTypeColor(fileType)}
                      className="capitalize"
                    >
                      {fileType}
                    </Badge>
                    <Badge variant={getAccessLevelColor(record.accessLevel)}>
                      {record.accessLevel}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                    {record.title}
                  </h3>

                  <div className="space-y-2 mb-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Archive className="h-4 w-4" />
                      <span>{record.collection.title}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {record.description}
                  </p>

                  {record.subjectTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {record.subjectTags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {record.subjectTags.length > 3 && (
                        <Badge variant="outline" size="sm">
                          +{record.subjectTags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Link to={`/records/${record.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Button>
                    </Link>
                    {record.accessLevel === "PUBLIC" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Archive className="mx-auto h-16 w-16 text-slate-400 mb-6" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No documents found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search criteria or filters to find what you're
              looking for.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilters({
                  keyword: "",
                  type: [],
                  dateRange: { start: "", end: "" },
                  author: "",
                  collection: "",
                  accessLevel: [],
                });
                setFilteredRecords(records);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNumber)}
                  size="sm"
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
