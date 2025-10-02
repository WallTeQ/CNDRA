// components/collections/LoadingState.tsx
import { Card, CardContent } from "../../../components/ui/Card";
import { RefreshCw } from "lucide-react";

export default function LoadingState() {
  return (
    <Card className="py-12">
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center">
          <RefreshCw className="animate-spin w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Loading Collections
          </h3>
          <p className="text-muted-foreground">
            Please wait while we fetch your collections...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
