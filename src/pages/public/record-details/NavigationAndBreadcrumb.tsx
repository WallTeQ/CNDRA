import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

interface NavigationAndBreadcrumbProps {
  onBackClick: () => void;
}

export function NavigationAndBreadcrumb({
  onBackClick,
}: NavigationAndBreadcrumbProps) {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
        <Link to="/" className="hover:text-slate-900">
          Home
        </Link>
        <span>/</span>
        <Link to="/search" className="hover:text-slate-900">
          Search
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Document Details</span>
      </nav>

      {/* Back Button */}
      <div className="mb-6 ">
        <Button
          variant="ghost"
          onClick={onBackClick}
          className="flex flex-row items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Search Results</span>
        </Button>
      </div>
    </>
  );
}
