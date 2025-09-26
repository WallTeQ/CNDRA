import { Link } from "react-router-dom";
import { Card, CardContent } from "./Card";
import { Badge } from "./Badge";

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
    <Card
      className={mergeClasses("hover:shadow-md transition-shadow", className)}
    >
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Link href={href} className="flex-1">
              <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
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
          <div className="flex items-center space-x-2 pt-2">
            <Link to={href}>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">
                View Details
              </button>
            </Link>
            <span className="text-muted-foreground">•</span>
            <button className="text-sm text-muted-foreground hover:text-foreground">
              Download
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
