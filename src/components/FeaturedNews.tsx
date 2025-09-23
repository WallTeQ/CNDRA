import React from "react";
import { Link } from "react-router-dom";
import { User, ChevronRight } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { mockNews } from "../data/newsData";

const FeaturedNewsSection: React.FC = () => {
  const featuredNews = mockNews.filter((article) => article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: {
      [key: string]: "default" | "success" | "warning" | "danger" | "info";
    } = {
      news: "info",
      announcement: "success",
      research: "warning",
      acquisition: "default",
    };
    return colors[category] || "default";
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredNews.slice(0, 3).map((article) => (
          <Card key={article.id} className="overflow-hidden p-0" hover>
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
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
              <h4 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                {article.title}
              </h4>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <Link to={`/news/${article.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <span>Read More</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default FeaturedNewsSection;
