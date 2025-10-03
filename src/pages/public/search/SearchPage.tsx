// pages/search/SearchPage.tsx
import React from "react";
import SearchHeader from "./Searchheader";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResult";
import DocumentGrid from "./DocumentGrid";
import { EmptyState } from "../department/EmptyState";
import Pagination from "../../../components/Pagination";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useSearchLogic } from "./useSearch";
import { useRecords } from "../../../hooks/useRecords";

export const SearchPage: React.FC = () => {
  const { data: records = [], isLoading, error, refetch } = useRecords();

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

  if (isLoading && records.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
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
