// import { Link } from "react-router-dom";
// import { Card, CardContent } from "./Card";
// import { Badge } from "./Badge";
// import { FileText, Download, Eye } from "lucide-react";

// function mergeClasses(...classes: (string | undefined | boolean)[]): string {
//   return classes.filter(Boolean).join(" ");
// }

// interface RecordCardProps {
//   id: string;
//   title: string;
//   description: string;
//   collection: {
//     id: string;
//     title: string;
//     description: string;
//     createdAt: string;
//     updatedAt: string;
//   };
//   fileAssets: Array<{
//     id: string;
//     filename: string;
//     mimeType: string;
//     storagePath: string;
//     type: string;
//     size: string;
//     isPublic: boolean;
//     createdAt: string;
//     updatedAt: string;
//   }>;
//   accessLevel: "PUBLIC" | "RESTRICTED" | "CONFIDENTIAL" | "SECRET";
//   subjectTags: string[];
//   createdAt: string;
//   isPublic?: boolean;
//   className?: string;
// }

// export function RecordCard({
//   id,
//   title,
//   description,
//   collection,
//   fileAssets,
//   accessLevel,
//   subjectTags,
//   createdAt,
//   isPublic = true,
//   className,
// }: RecordCardProps) {
//   const href = `/records/${id}`;
//   const primaryFile = fileAssets[0];
//   const fileType = primaryFile
//     ? primaryFile.mimeType.split("/")[1].toUpperCase()
//     : "UNKNOWN";
//   const formattedDate = new Date(createdAt).toLocaleDateString();

//   return (
//     <Link to={href} className="block">
//       <div>
//         <div className="p-2 flex  h-full border rounded-lg hover:shadow-lg transition-shadow duration-300 bg-white">
//           {/* Image Preview */}
//           {fileAssets &&
//             fileAssets.length > 0 &&
//             (() => {
//               const firstFile = fileAssets[0];
//               const isImage =
//                 firstFile &&
//                 ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
//                   firstFile.mimeType?.split("/")[1]?.toLowerCase()
//                 );

//               return isImage ? (
//                 <img
//                   src={firstFile.storagePath}
//                   alt={title}
//                   className="w-full h-32 object-cover rounded mb-4"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.style.display = "none";
//                   }}
//                 />
//               ) : (
//                 <div className="w-full h-32 bg-slate-100 rounded mb-4 flex items-center justify-center">
//                   <FileText className="h-8 w-8 text-slate-400" />
//                 </div>
//               );
//             })()}

//           <div className="space-y-3">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
//                   {title}
//                 </h3>
//               </div>
//             </div>
//             <p className="text-sm text-muted-foreground line-clamp-3">
//               {description}
//             </p>
//             <div className="flex flex-wrap gap-1">
//               {subjectTags.slice(0, 3).map((tag) => (
//                 <Badge key={tag.id} variant="default" size="xs">
//                   {tag.term}
//                 </Badge>
//               ))}

//               {subjectTags.length > 3 && (
//                 <Badge  className="text-xs">
//                   +{subjectTags.length - 3}
//                 </Badge>
//               )}
//               <Badge
//                 variant={accessLevel === "PUBLIC" ? "default" : "destructive"}
//                 className="text-xs"
//               >
//                 {accessLevel}
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
//               <div className="flex items-center space-x-4">
//                 <span>{collection.title}</span>
//                 <span>•</span>
//                 <span>
//                   {fileAssets.length} file{fileAssets.length !== 1 ? "s" : ""}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

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
  fileAssets,
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
      fileType?.toLowerCase()
    );

  if (layout === "vertical") {
    return (
      <Link to={href} className="block">
        <div
          className={`border rounded-lg hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden ${
            className || ""
          }`}
        >
          {/* Top - Image Preview */}
          <div className="w-full h-48 relative overflow-hidden bg-slate-100">
            {isImage ? (
              <img
                src={primaryFile.storagePath}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                  <Archive className="h-12 w-12 text-indigo-300 mx-auto mb-2" />
                  <p className="text-sm text-indigo-600 font-medium">
                    {fileType.toUpperCase()} Document
                  </p>
                  <p className="text-xs text-indigo-500">{fileSize}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom - Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                {title}
              </h3>
              <Badge
                variant={accessLevel === "PUBLIC" ? "default" : "destructive"}
              >
                {accessLevel}
              </Badge>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2">{description}</p>

            <div className="flex flex-wrap gap-1.5">
              {subjectTags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="default">
                  {tag.term}
                </Badge>
              ))}

              {subjectTags.length > 3 && (
                <Badge variant="default">+{subjectTags.length - 3}</Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span>{collection.title}</span>
                <span>•</span>
                <span>
                  {fileAssets.length} file{fileAssets.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={href} className="block">
      <div
        className={`border rounded-lg hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden ${
          className || ""
        }`}
      >
        <div className="flex gap-4 p-4">
          {/* Left Side - Image/File Preview */}
          <div className="flex-shrink-0 w-32">
            {isImage ? (
              <img
                src={primaryFile.storagePath}
                alt={title}
                className="w-32 h-32 object-cover rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-32 h-32 bg-slate-100 rounded flex items-center justify-center">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
            )}
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                {title}
              </h3>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: description }} />

            <div className="flex flex-wrap gap-1.5">
              {subjectTags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="default">
                  {tag.term}
                </Badge>
              ))}

              {subjectTags.length > 3 && (
                <Badge variant="default">+{subjectTags.length - 3}</Badge>
              )}

              <Badge
                variant={accessLevel === "PUBLIC" ? "default" : "destructive"}
              >
                {accessLevel}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span>{collection.title}</span>
                <span>•</span>
                <span>
                  {fileAssets.length} file{fileAssets.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

