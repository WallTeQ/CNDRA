import React from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

interface ArticleMetadataProps {
  createdAt: string;
  updatedAt: string;
  status: string;
  author: string;
  formatDate: (dateString: string) => string;
}

export const ArticleMetadata: React.FC<ArticleMetadataProps> = ({
  createdAt,
  updatedAt,
  status,
  author,
  formatDate,
}) => {
  return (
    <Card className="mb-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Article Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-600">Published:</span>
          <span className="ml-2 text-slate-900 font-medium">
            {formatDate(createdAt)}
          </span>
        </div>
        <div>
          <span className="text-slate-600">Last Updated:</span>
          <span className="ml-2 text-slate-900 font-medium">
            {formatDate(updatedAt)}
          </span>
        </div>
        <div>
          <span className="text-slate-600">Status:</span>
          <span className="ml-2">
            <Badge variant="success" size="sm">
              {status}
            </Badge>
          </span>
        </div>
        <div>
          <span className="text-slate-600">Author:</span>
          <span className="ml-2 text-slate-900 font-medium">{author}</span>
        </div>
      </div>
    </Card>
  );
};
