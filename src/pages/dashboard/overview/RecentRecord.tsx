import React from "react";
import { FileText } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Document } from "../../../types/activity";

interface RecentDocumentsProps {
  documents: Document[];
  title?: string;
  description?: string;
  maxItems?: number;
  onDocumentClick?: (document: Document) => void;
}

export const RecentRecord: React.FC<RecentDocumentsProps> = ({
  documents,
  title = "Recent Documents",
  description = "Recently uploaded and reviewed documents.",
  maxItems = 4,
  onDocumentClick,
}) => {
  const displayedDocuments = documents.slice(0, maxItems);

  const handleDocumentClick = (document: Document) => {
    if (onDocumentClick) {
      onDocumentClick(document);
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>

      <div className="space-y-4">
        {displayedDocuments.map((document) => (
          <div
            key={document.id}
            className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 ${
              onDocumentClick ? "cursor-pointer" : ""
            }`}
            onClick={() => handleDocumentClick(document)}
          >
            <div className="flex-shrink-0">
              {document.previewUrl ? (
                <img
                  src={document.previewUrl}
                  alt={document.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {document.title}
              </p>
              <p className="text-sm text-gray-500">
                by {document.author || "Unknown"}
              </p>
              <div className="mt-1 flex items-center space-x-2">
                <Badge variant="info" size="sm" className="capitalize">
                  {document.type}
                </Badge>
                <Badge variant="success" size="sm" className="capitalize">
                  {document.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
