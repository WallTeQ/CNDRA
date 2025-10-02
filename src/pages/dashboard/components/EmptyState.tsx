// components/collections/EmptyState.tsx
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { FolderOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  title?: string;
  description?: string;
  onCreateCollection: () => void;
}

export default function EmptyState({
  hasFilters,
  title,
  description,
  onCreateCollection,
}: EmptyStateProps) {
  return (
    <Card className="py-12">
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {hasFilters ? `No ${title} Found` : `No ${title} Yet`}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {hasFilters
              ? "Try adjusting your search or filter criteria to find what you're looking for."
              : `Get started by creating your first ${title} to organize your records.`}
          </p>
          {!hasFilters && (
            <Button
              onClick={onCreateCollection}
              icon={<Plus className="w-4 h-4" />}
            >
              {description}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
