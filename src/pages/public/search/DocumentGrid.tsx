import React from "react";
import DocumentCard from "./DocumentCart";

interface DocumentGridProps {
  documents: any[];
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {documents.map((record) => (
        <DocumentCard key={record.id} record={record} />
      ))}
    </div>
  );
};

export default DocumentGrid;
