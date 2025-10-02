// components/collections/ErrorDisplay.tsx
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface ErrorDisplayProps {
  error: string;
  onClose: () => void;
}

export default function ErrorDisplay({ error, onClose }: ErrorDisplayProps) {
  return (
    <Card className="mb-6 border-destructive/50 bg-destructive/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-destructive">
                Error Loading Collections
              </p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            ×
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
