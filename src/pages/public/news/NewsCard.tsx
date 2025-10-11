import React from "react";
import { Link } from "react-router-dom";
import { User, Bookmark, Share2, ChevronRight, Tag } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  imageUrl?: string;
}

interface NewsCardProps {
  article: NewsArticle;
  getCategoryColor: (
    category: string
  ) => "default" | "success" | "warning" | "danger" | "info";
  formatDate: (dateString: string) => string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  getCategoryColor,
  formatDate,
}) => {
  return (
    <Card className="overflow-hidden" hover>
      <div className="md:flex space-x-6">
        <div className="w-32 h-24 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden">
          {article.fileAssets?.[0]?.storagePath ? (
            <Link to={`/news/${article.id}`}>
            <img
              src={article.fileAssets[0].storagePath}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            </Link>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <Link to={`/news/${article.id}`}>
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              </Link>
            </div>
            
          )}
        </div>
        <div className=" flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Badge
              variant={getCategoryColor(article.category)}
              size="sm"
              className="capitalize"
            >
              {article.category}
            </Badge>
            <span className="text-sm text-slate-500">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3">
            <Link
              to={`/news/${article.id}`}
              className="hover:text-red-600 transition-colors"
            >
              {article.title}
            </Link>
          </h3>

          <p className="text-slate-600 mb-4 line-clamp-3">{article.excerpt}</p>

          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="default" size="sm">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            {article.author && (
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <User className="h-4 w-4" />
                <span>{article.author.displayName}</span>
              </div>
              )}
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Link to={`/news/${article.id}`}>
                <Button size="sm" icon={<ChevronRight className="h-4 w-4" />}>
                  Read More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </Card>
  );
};
