import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface CollectionsSectionProps {
  records: any[];
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  records,
}) => {
    //display only up to 3 collections
    if (records.length > 3) {
      records = records.slice(0, 3);
    }
  return (
    <section className="pb-2 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-12 lg:px-22">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-3xl font-bold text-slate-900 mb-4">
            Explore Collections
          </h2>
          <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto">
            Browse our featured collections spanning centuries of Liberian
            history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {records.map((record, index) => {
            // Find the first displayable image from fileAssets
            const displayableImageTypes = [
              "jpg",
              "jpeg",
              "png",
              "gif",
              "webp",
              "bmp",
              "svg",
            ];
            const firstImageAsset = record.fileAssets?.find((file: any) => {
              const isImage = file.mimeType?.startsWith("image/");
              const fileExtension = file.mimeType?.split("/")[1]?.toLowerCase();
              return (
                isImage && displayableImageTypes.includes(fileExtension || "")
              );
            });

            return (
              <Card key={index} className="overflow-hidden p-0" hover>
                {firstImageAsset ? (
                  <img
                    src={firstImageAsset.storagePath}
                    alt={record.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-slate-400" />
                  </div>
                )}
                <div className="p-2 md:p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {record.title}
                  </h3>
                  <p className="text-slate-600 mb-3">{record.description}</p>
                  <p className="text-sm text-blue-600 font-medium">
                    {record.fileAssets?.length || 0} items
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/search">
            <Button size="lg">View All Collections</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
