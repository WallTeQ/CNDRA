import React from "react";

const SearchHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Search Archives
      </h1>
      <p className="text-lg text-slate-600">
        Search through our collection of historical documents, photographs, and
        records.
      </p>
      <div className="mt-4 text-sm text-muted-foreground leading-relaxed space-y-3">
        <p className="">
          This section provides open access to publicly available records from
          the National Archives of Liberia — a collection that tells the story
          of our nation’s history, people, and institutions. These materials
          include historical documents, photographs, and administrative files
          that reflect Liberia’s journey and cultural heritage.
          <br />
          Whether you’re a student, researcher, or simply curious about the
          past, use the search and filter tools below to explore our growing
          digital collection and uncover valuable insights into Liberia’s past
          and present.
        </p>
      </div>
    </div>
  );
};

export default SearchHeader;
