import { Calendar, Archive, Download, Share2, Bookmark } from "lucide-react";
import { Printer as Print } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import {
  getAccessLevelInfo,
  handleDownloadFile,
} from "./recordUtils";
import { formatDate } from "../../../utils/FormatDate";

interface RecordHeaderProps {
  record: any;
  primaryFile: any;
  fileType: string;
  fileSize: string;
  onShareClick: () => void;
}

export function RecordHeader({
  record,
  primaryFile,
  fileType,
  fileSize,
  onShareClick,
}: RecordHeaderProps) {
  const formattedDate = formatDate(record.createdAt);
  const accessInfo = getAccessLevelInfo(record.accessLevel);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="default" className="capitalize">
              {fileType}
            </Badge>
            <Badge
              variant={
                accessInfo.color === "success"
                  ? "success"
                  : accessInfo.color === "warning"
                  ? "warning"
                  : "danger"
              }
            >
              {record.accessLevel}
            </Badge>
            <Badge variant="info" className="capitalize">
              Active
            </Badge>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {record.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Archive className="h-5 w-5" />
              <span>{record.collection?.title || "Unknown Collection"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {record.accessLevel === "PUBLIC" && primaryFile && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadFile(primaryFile)}
                icon={<Download className="h-4 w-4" />}
              >
                Download ({fileType})
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={onShareClick}
              icon={<Share2 className="h-4 w-4" />}
            >
              Share
            </Button>

            <Button
              size="sm"
              variant="outline"
              icon={<Bookmark className="h-4 w-4" />}
            >
              Save
            </Button>

            <Button
              size="sm"
              variant="outline"
              icon={<Print className="h-4 w-4" />}
            >
              Print
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
