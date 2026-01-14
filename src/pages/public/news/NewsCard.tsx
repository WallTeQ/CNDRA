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
  fileAssets?: Array<{
    storagePath: string;
  }>;
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
    <Card className="overflow-hidden group" hover>
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Image Container - Full width on mobile, fixed width on desktop */}
        <div className="w-full md:w-48 h-48 md:h-52 flex-shrink-0 bg-slate-200 overflow-hidden relative">
          {article.imageUrl ? (
            <Link to={`/news/${article.id}`} className="block w-full h-full">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <Link to={`/news/${article.id}`} className="block">
                <svg
                  className="w-12 h-12 text-slate-400"
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

        {/* Content Container */}
        <div className="flex-1 p-4 md:py-2 md:pr-4 md:pl-0">
          {/* Category and Date */}
          <div className="flex items-center space-x-2 mb-2">
            <Badge
              variant={getCategoryColor(article.category)}
              size="sm"
              className="capitalize"
            >
              {article.category}
            </Badge>
            <span className="text-xs md:text-sm text-slate-500">
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 leading-tight">
            <Link
              to={`/news/${article.id}`}
              className="hover:text-slate-700 transition-colors line-clamp-2"
            >
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm md:text-base text-slate-600 mb-3 line-clamp-2 md:line-clamp-3">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {article.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="default"
                  size="sm"
                  className="text-xs"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 "
            >
              <Share2 className="h-4 w-4" />
              {/* <span className="hidden sm:inline ">Share</span> */}
            </Button>

            <Link to={`/news/${article.id}`}>
              <Button
                size="sm"
                icon={<ChevronRight className="h-4 w-4" />}
                className="text-sm"
              >
                Read More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
