import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Archive, Eye, Download } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

interface DocumentCardProps {
  record: any;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ record }) => {
  const primaryFile = record.fileAssets[0];
  const fileType = primaryFile ? primaryFile.mimeType.split("/")[1] : "unknown";

  const formatFileSize = (sizeInBytes: string) => {
    const bytes = parseInt(sizeInBytes);
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const fileSize = primaryFile
    ? formatFileSize(primaryFile.size)
    : "Unknown size";

  const getTypeColor = (
    fileType: string
  ): "default" | "success" | "warning" | "danger" | "info" => {
    const colors: {
      [key: string]: "default" | "success" | "warning" | "danger" | "info";
    } = {
      pdf: "danger",
      doc: "info",
      docx: "info",
      txt: "default",
      jpg: "warning",
      jpeg: "warning",
      png: "warning",
      gif: "warning",
      mp3: "info",
      mp4: "success",
      avi: "success",
      unknown: "default",
    };
    return colors[fileType] || "default";
  };

  const getAccessLevelColor = (
    level: string
  ): "default" | "success" | "warning" | "danger" => {
    switch (level) {
      case "PUBLIC":
        return "success";
      case "INTERNAL":
        return "warning";
      case "CONFIDENTIAL":
        return "danger";
      default:
        return "default";
    }
  };

  const isImageFile =
    primaryFile &&
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
      fileType.toLowerCase()
    );

  return (
    <Link to={`/records/${record.id}`}>
      <Card className="overflow-hidden p-0 cursor-pointer" hover>
        {/* Document preview or placeholder */}
        {isImageFile ? (
          <div className="w-full h-48 relative overflow-hidden bg-slate-100">
            <img
              src={primaryFile.storagePath}
              alt={record.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.parentElement?.querySelector(
                  ".fallback-placeholder"
                );
                if (fallback) {
                  fallback.classList.remove("hidden");
                  fallback.classList.add(
                    "flex",
                    "items-center",
                    "justify-center"
                  );
                }
              }}
            />
            <div className="fallback-placeholder hidden absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center">
                <Archive className="h-12 w-12 text-indigo-300 mx-auto mb-2" />
                <p className="text-sm text-indigo-600 font-medium">
                  {fileType.toUpperCase()} Image
                </p>
                <p className="text-xs text-indigo-500">{fileSize}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
              <Archive className="h-12 w-12 text-indigo-300 mx-auto mb-2" />
              <p className="text-sm text-indigo-600 font-medium">
                {fileType.toUpperCase()} Document
              </p>
              <p className="text-xs text-indigo-500">{fileSize}</p>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <Badge variant={getTypeColor(fileType)} className="capitalize">
              {fileType}
            </Badge>
            <Badge variant={getAccessLevelColor(record.accessLevel)}>
              {record.accessLevel}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
            {record.title}
          </h3>

          <div className="space-y-2 mb-4 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(record.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Archive className="h-4 w-4" />
              <span>{record.collection.title}</span>
            </div>
          </div>

          <p className="text-slate-600 text-sm mb-4 line-clamp-3">
            {record.description}
          </p>

          {record.subjectTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {record.subjectTags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
              {record.subjectTags.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{record.subjectTags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              icon={<Eye className="h-4 w-4" />}
            >
              <span>View Details</span>
            </Button>
            {record.accessLevel === "PUBLIC" && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
                icon={<Download className="h-4 w-4" />}
              >
                <span>Download</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default DocumentCard;
