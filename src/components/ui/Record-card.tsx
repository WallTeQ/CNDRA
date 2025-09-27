import { Link } from "react-router-dom";
import { Card, CardContent } from "./Card";
import { Badge } from "./Badge";
import { FileText, Download, Eye } from "lucide-react";

function mergeClasses(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

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
  fileAssets: Array<{
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
  subjectTags: string[];
  createdAt: string;
  isPublic?: boolean;
  className?: string;
}

export function RecordCard({
  id,
  title,
  description,
  collection,
  fileAssets,
  accessLevel,
  subjectTags,
  createdAt,
  isPublic = true,
  className,
}: RecordCardProps) {
  const href = `/records/${id}`;
  const primaryFile = fileAssets[0];
  const fileType = primaryFile
    ? primaryFile.mimeType.split("/")[1].toUpperCase()
    : "UNKNOWN";
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <Link to={href} className="block">
      <Card
        className={mergeClasses("hover:shadow-md transition-shadow cursor-pointer", className)}
      >
        <CardContent className="p-6">
          {/* Image Preview */}
          {fileAssets && fileAssets.length > 0 && (
            (() => {
              const firstFile = fileAssets[0];
              const isImage = firstFile && ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
                firstFile.mimeType?.split("/")[1]?.toLowerCase()
              );

              return isImage ? (
                <img
                  src={firstFile.storagePath}
                  alt={title}
                  className="w-full h-32 object-cover rounded mb-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-32 bg-slate-100 rounded mb-4 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
              );
            })()
          )}

          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                  {title}
                </h3>
              </div>
              <Badge variant="outline" className="ml-2 text-xs">
                {fileType}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </p>
            <div className="flex flex-wrap gap-1">
              {subjectTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {subjectTags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{subjectTags.length - 3}
                </Badge>
              )}
              <Badge
                variant={accessLevel === "PUBLIC" ? "default" : "destructive"}
                className="text-xs"
              >
                {accessLevel}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center space-x-4">
                <span>{collection.title}</span>
                <span>•</span>
                <span>
                  {fileAssets.length} file{fileAssets.length !== 1 ? "s" : ""}
                </span>
              </div>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle view details action if needed
                }}
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
              <button
                className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle download action if needed
                }}
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
