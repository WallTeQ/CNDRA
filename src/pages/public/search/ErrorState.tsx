import React from "react";
import { Archive } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface ErrorStateProps {
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Archive className="mx-auto h-16 w-16 text-slate-400 mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Error Loading Records
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          We encountered an error while loading the records. Please try again
          later.
        </p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
};

export default ErrorState;
