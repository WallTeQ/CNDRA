import { Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import {
  formatFileSize,
  getAccessLevelInfo,
} from "./recordUtils";
import { formatDate } from "../../../utils/FormatDate";

interface DocumentMetadataProps {
  record: any;
  primaryFile: any;
  fileType: string;
  fileSize: string;
}

export function DocumentMetadata({
  record,
  primaryFile,
  fileType,
  fileSize,
}: DocumentMetadataProps) {
  const accessInfo = getAccessLevelInfo(record.accessLevel);
  const formattedDate = formatDate(record.createdAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Image Preview */}
          {primaryFile &&
            primaryFile.mimeType?.startsWith("image/") &&
            ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
              primaryFile.mimeType?.split("/")[1]?.toLowerCase() || ""
            ) && (
              <div className="flex justify-center mb-6">
                <img
                  src={primaryFile.storagePath}
                  alt={record.title}
                  className="max-w-full max-h-48 object-contain rounded-lg border border-slate-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement("div");
                      fallback.className =
                        "w-full max-h-48 bg-slate-100 rounded-lg flex items-center justify-center";
                      fallback.innerHTML =
                        '<svg class="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            )}

          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              Document ID
            </p>
            <p className="text-sm text-slate-900 font-mono">{record.id}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">File Type</p>
            <p className="text-sm text-slate-900">{fileType}</p>
          </div>

          {primaryFile && (
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                File Size
              </p>
              <p className="text-sm text-slate-900">{fileSize}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              Created Date
            </p>
            <p className="text-sm text-slate-900">{formattedDate}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              Collection
            </p>
            <p className="text-sm text-slate-900">
              {record.collection?.title || "Unknown Collection"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">
              Access Level
            </p>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  accessInfo.color === "success"
                    ? "success"
                    : accessInfo.color === "warning"
                    ? "warning"
                    : "danger"
                }
                size="sm"
                className="capitalize"
              >
                <Shield className="h-3 w-3 mr-1" />
                {record.accessLevel}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {accessInfo.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">Version</p>
            <Badge variant="default" size="sm">
              v{record.version}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
