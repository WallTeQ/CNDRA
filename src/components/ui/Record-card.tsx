import { FileText, Archive } from "lucide-react";
import { Link } from "react-router-dom";

interface RecordCardProps {
  id: string;
  title: string;
  description: string;
  collection: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  fileAssets?: Array<{
    id: string;
    filename: string;
    mimeType: string;
    storagePath: string;
    type: string;
    size: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  accessLevel: "PUBLIC" | "RESTRICTED" | "CONFIDENTIAL" | "SECRET";
  subjectTags: Array<{
    id: string;
    term: string;
  }>;
  createdAt: string;
  isPublic?: boolean;
  className?: string;
  layout?: "horizontal" | "vertical";
}

function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}) {
  const baseClasses =
    "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium";
  const variantClasses =
    variant === "destructive"
      ? "bg-blue-100 text-blue-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
}

export function RecordCard({
  id,
  title,
  description,
  collection,
  fileAssets = [], // Default to empty array
  accessLevel,
  subjectTags,
  createdAt,
  isPublic = true,
  className,
  layout = "horizontal",
}: RecordCardProps) {
  const href = `/records/${id}`;
  const primaryFile =
    fileAssets && fileAssets.length > 0 ? fileAssets[0] : null;
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

  const isImage =
    primaryFile &&
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
      fileType?.toLowerCase(),
    );

  const getBadgeType = () => {
    if (collection?.title?.toLowerCase().includes("feature")) return "feature";
    if (collection?.title?.toLowerCase().includes("events")) return "events";
    return "default";
  };

  const badgeType = getBadgeType();
  const badgeLabel =
    badgeType === "feature"
      ? "Feature"
      : badgeType === "events"
        ? "Events"
        : accessLevel;

  return (
    <Link to={href} className="block">
      <div
        className={`border rounded-lg transition-shadow duration-300 bg-white overflow-hidden ${
          className || ""
        }`}
      >
        <div className="flex flex-col gap-4 p-4">
          {/* Left Side - Image/File Preview */}
          <div className="relative w-full h-64 overflow-hidden bg-slate-100">
            {isImage && primaryFile ? (
              <img
                src={primaryFile.storagePath}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <Archive className="h-16 w-16 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 font-medium">
                    {primaryFile ? fileType.toUpperCase() : "NO"} Document
                  </p>
                </div>
              </div>
            )}

            {/* Badge Overlay */}
            <div className="absolute top-2 right-2">
              <Badge variant={badgeType as any}>{badgeLabel}</Badge>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-3xl font-mono text-slate-900 hover:text-white underline hover:bg-slate-900 hover:p-2 transition-colors">
                {title}
              </h3>
            </div>

            <p
              className="text-lg text-slate-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span>{collection?.title || "Unknown Collection"}</span>
                <span>•</span>
                <span>
                  {fileAssets?.length || 0} file
                  {fileAssets?.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
