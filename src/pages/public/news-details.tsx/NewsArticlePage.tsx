import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNews, usePublishedNews } from "../../../hooks/useGovernance";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { ArticleGallery } from "./ArticleGallery";
import { ArticleMetadata } from "./ArticleMetadata";
import { RelatedArticles } from "./RelatedArticle";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

export const NewsArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading, error } = useNews(id || "", !!id);
  const { data: allNews } = usePublishedNews();

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

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  if (isLoading) {
    return (
        <LoadingSpinner size="lg" message="Loading article..." />
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            The article you're looking for could not be found.
          </p>
          <Link to="/news-events">
            <Button>Back to News & Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get first image from fileAssets
  
  const imageUrl =article.fileAssets[0].storagePath 
  const excerpt = stripHtml(article.content).substring(0, 200) + "...";

  // Related articles - get 3 most recent articles excluding current one
  const relatedArticles =
    allNews?.filter((news) => news.id !== article.id).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/news-events"
            className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to News & Events</span>
          </Link>
        </div>

        {/* Article Header */}
        <ArticleHeader
          title={article.title}
          author={article.author || "National Archive"}
          createdAt={article.createdAt}
          imageUrl={imageUrl}
          excerpt={excerpt}
          formatDate={formatDate}
          getCategoryColor={getCategoryColor}
        />

        {/* Article Content */}
        <ArticleContent content={article.content} />

        {/* Additional Images Gallery */}
        <ArticleGallery fileAssets={article.fileAssets || []} />

        {/* Article Metadata */}
        <ArticleMetadata
          createdAt={article.createdAt}
          updatedAt={article.updatedAt}
          status={article.status}
          author={article.author || "National Archive"}
          formatDate={formatDate}
        />

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} formatDate={formatDate} />
      </div>
    </div>
  );
};