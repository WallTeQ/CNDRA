import React from "react";

interface SearchResultsProps {
  count: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({ count }) => {
  return (
    <div className="mb-6">
      <p className="text-slate-600">Found {count} documents</p>
    </div>
  );
};

export default SearchResults;
