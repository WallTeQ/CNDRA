import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

interface RelatedArticle {
  id: string;
  title: string;
  createdAt: string;
  fileAssets?: Array<{
    id: string;
    cloudinaryPublicId?: string;
    localPath?: string;
  }>;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  formatDate: (dateString: string) => string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
  formatDate,
}) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Related Articles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => {
          const imageUrl = article.fileAssets?.[0]?.cloudinaryPublicId
            ? `https://res.cloudinary.com/your-cloud-name/image/upload/${article.fileAssets[0].cloudinaryPublicId}`
            : article.fileAssets?.[0]?.localPath;

          return (
            <Link
              key={article.id}
              to={`/news/${article.id}`}
              className="block group"
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={article.title}
                  className="w-full h-32 object-cover rounded-lg mb-3 group-hover:shadow-md transition-shadow"
                />
              )}
              <div className="space-y-2">
                <Badge variant="info" size="sm" className="capitalize">
                  News
                </Badge>
                <h4 className="font-medium text-slate-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-600">
                  {formatDate(article.createdAt)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
