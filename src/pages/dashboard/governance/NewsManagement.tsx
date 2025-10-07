import React, { useState } from "react";
import {
  Plus,
  CreditCard as Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
  Image,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import {
  useAllNews,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
  usePublishNews,
  useUnpublishNews,
} from "../../../hooks/useGovernance";
import { NewsFormModal } from "./NewsFormModal";
import { News } from "../../../types/governance";
import { formatDate } from "../../../utils/FormatDate";

export const NewsManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // React Query hooks
  const { data: newsList = [], isLoading, error } = useAllNews();
  const createNewsMutation = useCreateNews();
  const updateNewsMutation = useUpdateNews();
  const deleteNewsMutation = useDeleteNews();
  const publishNewsMutation = usePublishNews();
  const unpublishNewsMutation = useUnpublishNews();

  // Filter news based on search term
  const filteredNews = newsList.filter(
    (news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNews = () => {
    setSelectedNews(null);
    setIsCreateModalOpen(true);
  };

  const handleEditNews = (news: News) => {
    setSelectedNews(news);
    setIsEditModalOpen(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      try {
        await deleteNewsMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete news:", error);
      }
    }
  };

  const handlePublishToggle = async (news: News) => {
    try {
      if (news.status === "published") {
        await unpublishNewsMutation.mutateAsync({ newsId: news.id });
      } else {
        await publishNewsMutation.mutateAsync({ newsId: news.id });
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading news articles..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading news: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">News Management</h1>
          <p className="text-slate-600">Create and manage news articles</p>
        </div>
        <Button
          onClick={handleCreateNews}
          className="flex items-center space-x-2 whitespace-nowrap"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          <span>Create News</span>
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search news articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* News List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredNews.length === 0 ? (
          <Card className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No news articles found
            </h3>
            <p className="text-slate-600 mb-4">
              {searchTerm
                ? "Try adjusting your search terms."
                : "Get started by creating your first news article."}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateNews}>Create News Article</Button>
            )}
          </Card>
        ) : (
          filteredNews.map((news) => (
            <Card key={news.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {news.title}
                    </h3>
                    <Badge
                      variant={
                        news.status === "published" ? "success" : "warning"
                      }
                    >
                      {news.status}
                    </Badge>
                  </div>

                  <div
                    className="text-slate-600 mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        news.content.substring(0, 200) +
                        (news.content.length > 200 ? "..." : ""),
                    }}
                  />

                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(news.createdAt)}</span>
                    </div>
                    {news.publishedAt && (
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>Published: {formatDate(news.publishedAt)}</span>
                      </div>
                    )}
                    {news.files && news.files.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Image className="h-4 w-4" />
                        <span>{news.files.length} file(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePublishToggle(news)}
                    disabled={
                      publishNewsMutation.isPending ||
                      unpublishNewsMutation.isPending
                    }
                  >
                    {news.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditNews(news)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteNews(news.id)}
                    disabled={deleteNewsMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <NewsFormModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedNews(null);
        }}
        news={selectedNews}
        isEdit={isEditModalOpen}
        createMutation={createNewsMutation}
        updateMutation={updateNewsMutation}
      />
    </div>
  );
};
