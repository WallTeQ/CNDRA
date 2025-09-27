import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchRecords } from "../../../store/slices/records/recordsThunk";
import SearchHeader from "./Searchheader";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResult";
import DocumentGrid from "./DocumentGrid";
import { EmptyState } from "../department/EmptyState";
import Pagination from "../../../components/Pagination";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useSearchLogic } from "./useSearch";

interface SearchFilters {
  keyword: string;
  type: string[];
  dateRange: { start: string; end: string };
  author: string;
  collection: string;
  accessLevel: string[];
}

export const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { records, isLoading, error } = useAppSelector(
    (state) => state.records
  );

  const {
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
  } = useSearchLogic(records);

  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  if (isLoading && records.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={() => dispatch(fetchRecords())} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchHeader />

        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          records={records}
          onSearch={handleSearch}
        />

        <SearchResults count={filteredRecords.length} />

        <DocumentGrid documents={currentDocuments} />

        {filteredRecords.length === 0 && !isLoading && (
          <EmptyState onClearSearch={clearAllFilters} title="record" />
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};