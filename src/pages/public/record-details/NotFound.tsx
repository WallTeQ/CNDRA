import { Archive } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface NotFoundStateProps {
  onNavigateToSearch: () => void;
}

export function NotFoundState({ onNavigateToSearch }: NotFoundStateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Archive className="mx-auto h-16 w-16 text-slate-400 mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Record Not Found
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          The record you're looking for could not be found in our archives.
        </p>
        <Button size="lg" onClick={onNavigateToSearch}>
          Search Our Archives
        </Button>
      </div>
    </div>
  );
}
