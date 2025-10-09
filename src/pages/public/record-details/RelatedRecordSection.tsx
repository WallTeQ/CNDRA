import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { formatDate } from "../../../utils/FormatDate";

interface RelatedDocumentsSectionProps {
  relatedRecords: any[];
}

export function RelatedRecordsSection({
  relatedRecords,
}: RelatedDocumentsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedRecords.map((relatedDoc) => (
            <Link
              key={relatedDoc.id}
              to={`/records/${relatedDoc.id}`}
              className="block p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
            >
              {relatedDoc.fileAssets &&
                relatedDoc.fileAssets.length > 0 &&
                (() => {
                  const firstFile = relatedDoc.fileAssets[0];
                  const isImage =
                    firstFile &&
                    [
                      "jpg",
                      "jpeg",
                      "png",
                      "gif",
                      "webp",
                      "bmp",
                      "svg",
                    ].includes(
                      firstFile.mimeType?.split("/")[1]?.toLowerCase()
                    );

                  return isImage ? (
                    <img
                      src={firstFile.storagePath}
                      alt={relatedDoc.title}
                      className="w-full h-24 object-cover rounded mb-3"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/150/100";
                      }}
                    />
                  ) : (
                    <div className="w-full h-24 bg-slate-100 rounded mb-3 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                  );
                })()}
              <h3 className="font-medium text-slate-900 text-sm line-clamp-2 mb-2">
                {relatedDoc.title}
              </h3>
              <p className="text-xs text-slate-600">
                {relatedDoc.collection?.title &&
                  `Collection: ${relatedDoc.collection.title} • `}
                {formatDate(relatedDoc.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
