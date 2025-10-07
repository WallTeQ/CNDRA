import React from "react";
import { Card } from "../../../components/ui/Card";

interface FileAsset {
  id: string;
  cloudinaryPublicId?: string;
  localPath?: string;
}

interface ArticleGalleryProps {
  fileAssets: FileAsset[];
}

export const ArticleGallery: React.FC<ArticleGalleryProps> = ({
  fileAssets,
}) => {
  // Skip if there's only one or no images (first one is featured image)
  if (!fileAssets || fileAssets.length <= 1) {
    return null;
  }

  const galleryImages = fileAssets.slice(1);

  return (
    <Card className="mb-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.map((asset, index) => {
          const assetUrl = asset.cloudinaryPublicId
            ? `https://res.cloudinary.com/your-cloud-name/image/upload/${asset.cloudinaryPublicId}`
            : asset.localPath;

          if (!assetUrl) return null;

          return (
            <img
              key={asset.id}
              src={assetUrl}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            />
          );
        })}
      </div>
    </Card>
  );
};
