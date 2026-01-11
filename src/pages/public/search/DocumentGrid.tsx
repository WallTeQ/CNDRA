import React from "react";
import DocumentCard from "./DocumentCart";
import { RecordCard } from "../../../components/ui/Record-card";

interface DocumentGridProps {
  documents: any[];
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ documents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {documents.map((record) => (
        <RecordCard
          key={record.id}
          id={record.id}
          title={record.title}
          description={record.description}
          collection={record.collection}
          fileAssets={record.fileAssets}
          accessLevel={record.accessLevel}
          subjectTags={record.subjectTags}
          createdAt={record.createdAt}
          isPublic={record.isPublic}
          layout="grid"
        />
      ))}
    </div>
  );
};

export default DocumentGrid;

