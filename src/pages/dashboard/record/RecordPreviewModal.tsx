import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Download, File } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Record, FileAsset } from "../../../types/record";
import { formatDateTime } from "../../../utils/FormatDate";

interface RecordPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: Record | null;
  onEditRecord?: (record: Record) => void;
}

export const RecordPreviewModal: React.FC<RecordPreviewModalProps> = ({
  isOpen,
  onClose,
  record,
  onEditRecord,
}) => {
  const [previewFileIndex, setPreviewFileIndex] = useState(0);
  const [previewError, setPreviewError] = useState<string | null>(null);

  if (!record) return null;

  const getAccessLevelVariant = (level?: string) => {
    switch (level) {
      case "PUBLIC":
        return "success";
      case "RESTRICTED":
        return "warning";
      case "CONFIDENTIAL":
        return "danger";
      default:
        return "default";
    }
  };

  const handleDownloadFile = async (fileAsset: FileAsset) => {
    try {
      const response = await fetch(fileAsset.storagePath);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileAsset.filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fileAsset.storagePath, "_blank");
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension || "")
    ) {
      return "image";
    }
    if (["pdf"].includes(extension || "")) {
      return "pdf";
    }
    if (["doc", "docx", "txt", "rtf"].includes(extension || "")) {
      return "document";
    }
    return "other";
  };

  const formatFileSize = (sizeStr: string) => {
    const size = Number.parseInt(sizeStr);
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (size === 0) return "0 Bytes";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return Math.round((size / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleClose = () => {
    setPreviewError(null);
    setPreviewFileIndex(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Record Details: ${record.title || "Untitled"}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Record Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Title
                </label>
                <p className="text-foreground font-medium">
                  {record.title || "Untitled"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-foreground">
                  {record.description || "No description"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Collection
                </label>
                <p className="text-foreground">
                  {record.collection?.title || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Access Level
                </label>
                <Badge
                  variant={getAccessLevelVariant(record.accessLevel)}
                  size="xs"
                  className="mt-1"
                >
                  {record.accessLevel || "Unknown"}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created Date
                </label>
                <p className="text-foreground">
                  {formatDateTime(record.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Files & Tags
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  File Assets
                </label>
                <div className="mt-2 space-y-2">
                  {record?.fileAssets?.map((fileAsset, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <File className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {fileAsset.filename || `File ${index + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fileAsset.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadFile(fileAsset)}
                          className="text-xs"
                          icon={<Download className="w-3 h-3" />}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Subject Tags
                </label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {record.subjectTags.map((tag) => (
                    <Badge key={tag.id} variant="default" size="xs">
                      {tag.term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {record.fileAssets && record.fileAssets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Preview</h3>
              {record.fileAssets.length > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreviewFileIndex((prev) => Math.max(0, prev - 1));
                      setPreviewError(null);
                    }}
                    disabled={previewFileIndex === 0}
                    icon={<ChevronLeft className="w-4 h-4" />}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {previewFileIndex + 1} of {record.fileAssets.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPreviewFileIndex((prev) =>
                        Math.min(record.fileAssets.length - 1, prev + 1)
                      );
                      setPreviewError(null);
                    }}
                    disabled={previewFileIndex === record.fileAssets.length - 1}
                    icon={<ChevronRight className="w-4 h-4" />}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-center bg-slate-100 p-4 rounded-lg min-h-[400px]">
              {(() => {
                const currentFile = record.fileAssets[previewFileIndex];
                const fileType = getFileType(currentFile.filename || "");

                if (previewError) {
                  return (
                    <div className="flex flex-col items-center justify-center text-center">
                      <File className="w-16 h-16 text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium text-foreground mb-2">
                        {currentFile.filename || "File"}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {previewError}
                      </p>
                      <Button
                        onClick={() => handleDownloadFile(currentFile)}
                        icon={<Download className="w-4 h-4" />}
                      >
                        Download to View
                      </Button>
                    </div>
                  );
                }

                if (fileType === "image") {
                  return (
                    <img
                      src={currentFile.storagePath}
                      alt={currentFile.filename || record.title}
                      className="max-w-full max-h-[600px] object-contain shadow-lg"
                      onError={() => {
                        setPreviewError(
                          "This file cannot be previewed directly."
                        );
                      }}
                      onLoad={() => {
                        setPreviewError(null);
                      }}
                    />
                  );
                } else {
                  return (
                    <div className="flex flex-col items-center justify-center text-center">
                      <File className="w-16 h-16 text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium text-foreground mb-2">
                        {currentFile.filename || "File"}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        This file type cannot be previewed directly.
                      </p>
                      <Button
                        onClick={() => handleDownloadFile(currentFile)}
                        icon={<Download className="w-4 h-4" />}
                      >
                        Download to View
                      </Button>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {onEditRecord && (
            <Button
              onClick={() => {
                handleClose();
                onEditRecord(record);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Edit Record
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
