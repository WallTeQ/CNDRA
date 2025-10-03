import { useState, useEffect, useMemo } from "react";

interface SearchFilters {
  keyword: string;
  type: string[];
  dateRange: { start: string; end: string };
  author: string;
  collection: string;
  accessLevel: string[];
}

export const useSearchLogic = (records: any[]) => {
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
  const [currentPage, setCurrentPage] = useState(1);

  const documentsPerPage = 10;

  // Real-time search with debouncing effect through useMemo
  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Search by query (real-time)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.title.toLowerCase().includes(query) ||
          record.description.toLowerCase().includes(query) ||
          record.subjectTags.some((tag) => tag.term.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.type.length > 0) {
      filtered = filtered.filter((record) => {
        const fileType =
          record.fileAssets[0]?.mimeType.split("/")[1] || "unknown";
        return filters.type.includes(fileType);
      });
    }

    if (filters.collection) {
      filtered = filtered.filter((record) =>
        record.collection.title
          .toLowerCase()
          .includes(filters.collection.toLowerCase())
      );
    }

    if (filters.accessLevel.length > 0) {
      filtered = filtered.filter((record) =>
        filters.accessLevel.includes(record.accessLevel)
      );
    }

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

    return filtered;
  }, [records, searchQuery, filters]);

  // Reset page when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRecords.length]);

  const totalPages = Math.ceil(filteredRecords.length / documentsPerPage);
  const currentDocuments = filteredRecords.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage
  );

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      keyword: "",
      type: [],
      dateRange: { start: "", end: "" },
      author: "",
      collection: "",
      accessLevel: [],
    });
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    filteredRecords,
    currentPage,
    setCurrentPage,
    totalPages,
    currentDocuments,
    handleSearch,
    clearAllFilters,
  };
};
