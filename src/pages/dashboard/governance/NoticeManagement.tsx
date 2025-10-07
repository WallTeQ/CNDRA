import React, { useState } from "react";
import {
  Plus,
  CreditCard as Edit,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import {
  useAllNotices,
    useCreateNotice,
    useUpdateNotice,
    useDeleteNotice,
    usePublishNotice,
    useUnpublishNotice,
} from "../../../hooks/useGovernance";
import { NoticeFormModal } from "./NoticeFormModal";
import { Notice } from "../../../types/governance";
import { formatDate } from "../../../utils/FormatDate";

export const NoticeManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNotice, setselectedNotice] = useState<Notice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // React Query hooks
  const { data: noticesList = [], isLoading, error } = useAllNotices();
  const createNoticeMutation = useCreateNotice();
  const updateNoticeMutation = useUpdateNotice();
  const deleteNoticeMutation = useDeleteNotice();
  const publishNoticeMutation = usePublishNotice();
  const unpublishNoticeMutation = useUnpublishNotice();

  // Filter notices based on search term
  const filteredNotices = noticesList.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNotice = () => {
    setselectedNotice(null);
    setIsCreateModalOpen(true);
  };

  const handleEditNotice = (notice: Notice) => {
    setselectedNotice(notice);
    setIsEditModalOpen(true);
  };

  const handleDeleteNotice = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNoticeMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete notice:", error);
      }
    }
  };

  const handlePublishToggle = async (notice: Notice) => {
    try {
      if (notice.status === "published") {
        await unpublishNoticeMutation.mutateAsync({ noticeId: notice.id });
      } else {
        await publishNoticeMutation.mutateAsync({ noticeId: notice.id });
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };


  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading notices: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Notice Management
          </h1>
          <p className="text-slate-600">Create and manage notices</p>
        </div>
        <Button
          onClick={handleCreateNotice}
          className="flex items-center space-x-2 whitespace-nowrap"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
        >
          <span>Create Notice</span>
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredNotices.length === 0 ? (
          <div className="col-span-full">
            <Card className="text-center py-12">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No notices found
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by creating your first notice."}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateNotice}>Create Notice</Button>
              )}
            </Card>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <Card key={notice.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {notice.title}
                      </h3>
                      <Badge
                        variant={
                          notice.status === "published" ? "success" : "warning"
                        }
                      >
                        {notice.status}
                      </Badge>
                    </div>

                    <div
                      className="text-slate-600 mb-4 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          notice.body.substring(0, 150) +
                          (notice.body.length > 150 ? "..." : ""),
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishToggle(notice)}
                      disabled={
                        publishNoticeMutation.isPending ||
                        unpublishNoticeMutation.isPending
                      }
                    >
                      {notice.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditNotice(notice)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNotice(notice.id)}
                      disabled={deleteNoticeMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(notice.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(notice.expiresAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <NoticeFormModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setselectedNotice(null);
        }}
        notice={selectedNotice}
        isEdit={isEditModalOpen}
        createMutation={createNoticeMutation}
        updateMutation={updateNoticeMutation}
      />
    </div>
  );
};
