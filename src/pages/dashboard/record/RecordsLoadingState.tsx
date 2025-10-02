// components/records/RecordsLoadingState.tsx
import React from "react";
import { RefreshCw } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";

export const RecordsLoadingState: React.FC = () => {
  return (
    <Card className="py-12">
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center">
          <RefreshCw className="animate-spin w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Loading Records
          </h3>
          <p className="text-muted-foreground">
            Please wait while we fetch your records...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
