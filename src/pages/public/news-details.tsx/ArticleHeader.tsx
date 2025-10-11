import React from "react";
import { User, Bookmark, Share2, Printer as Print } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

interface ArticleHeaderProps {
  title: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
  excerpt: string;
  formatDate: (dateString: string) => string;
  getCategoryColor: (
    category: string
  ) => "default" | "success" | "warning" | "danger" | "info";
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  author,
  createdAt,
  imageUrl,
  excerpt,
  formatDate,
  getCategoryColor,
}) => {
  return (
    <Card className="mb-8">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant={getCategoryColor("news")} className="capitalize">
            News
          </Badge>
          <span className="text-sm text-slate-500">
            {formatDate(createdAt)}
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          {title}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-slate-600">
            <User className="h-5 w-5" />
            <span className="font-medium">{author.displayName}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Print className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-sm mb-6"
          />
        )}

        {/* Excerpt */}
        <div className="bg-slate-50 p-6 rounded-lg mb-6">
          <p className="text-lg text-slate-700 leading-relaxed font-medium">
            {excerpt}
          </p>
        </div>
      </div>
    </Card>
  );
};
