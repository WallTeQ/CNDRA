import { FileText, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { formatFileSize, handleDownloadFile } from "./recordUtils";

interface FileAssetsSectionProps {
  fileAssets: any[];
}

export function FileAssetsSection({ fileAssets }: FileAssetsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Document Files ({fileAssets && fileAssets.length > 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fileAssets?.map((file) => {
            const isImage = file.mimeType?.startsWith("image/");
            const imageTypes = [
              "jpg",
              "jpeg",
              "png",
              "gif",
              "webp",
              "bmp",
              "svg",
            ];
            const fileExtension = file.mimeType?.split("/")[1]?.toLowerCase();
            const isDisplayableImage =
              isImage && imageTypes.includes(fileExtension || "");

            return (
              <div
                key={file.id}
                className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                {isDisplayableImage ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <img
                          src={file.storagePath}
                          alt={file.filename}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              fallback.className =
                                "w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center";
                              fallback.innerHTML =
                                '<svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">
                              {file.filename}
                            </p>
                            <p className="text-sm text-slate-600">
                              {file.mimeType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadFile(file)}
                      icon={<Download className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {file.filename}
                          </p>
                          <p className="text-sm text-slate-600">
                            {file.mimeType} • {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadFile(file)}
                      icon={<Download className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
