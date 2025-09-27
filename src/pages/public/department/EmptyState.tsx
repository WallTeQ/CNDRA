import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface EmptyStateProps {
  onClearSearch: () => void;
  title: string;
}

export function EmptyState({ onClearSearch, title }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3 className="text-lg font-medium text-foreground mb-2">
          No {title} found
        </h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search terms or filters to find what you're looking
          for.
        </p>
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      </CardContent>
    </Card>
  );
}
