// pages/records/RestrictedRecordsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Lock, ShieldAlert, Search } from "lucide-react";
import {
  useRestrictedRecords,
  useConfidentialRecords,
} from "../../hooks/useRecords";
import { useAuth } from "../../hooks/useAuth";
import Pagination from "../../components/Pagination";

const ITEMS_PER_PAGE = 8;

export default function RestrictedRecordsPage() {
  const navigate = useNavigate();
  const { data: restrictedRecords = [], isLoading: restrictedLoading } =
    useRestrictedRecords();
  const { data: confidentialRecords = [], isLoading: confidentialLoading } =
    useConfidentialRecords();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [accessTypeFilter, setAccessTypeFilter] = useState<
    "all" | "restricted" | "confidential"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Combine all records
  const allRecords = [
    ...restrictedRecords.map((r: any) => ({ ...r, accessLevel: "restricted" })),
    ...confidentialRecords.map((r: any) => ({
      ...r,
      accessLevel: "confidential",
    })),
  ];

  // Filter records
  const filteredRecords = allRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.description &&
        record.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAccessType =
      accessTypeFilter === "all" || record.accessLevel === accessTypeFilter;
    return matchesSearch && matchesAccessType;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  const loading = restrictedLoading || confidentialLoading;

  const handleRequestAccess = (record: any) => {
    // Navigate to request access page with record data if user is logged in else to login
    if (!user) {
      return navigate("/login");
    }
    navigate(`/records/request-access/${record.id}`, {
      state: { record },
    });
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleAccessTypeChange = (value: any) => {
    setAccessTypeFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Restricted & Confidential Records
          </h1>
          <p className="text-muted-foreground">
            Browse records with restricted access and submit requests for
            viewing permissions
          </p>
          <div className="mt-4 text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>
              These records are part of Liberia's preserved national heritage
              and contain sensitive information accessible only upon approval.
            </p>
            <p>
              Some documents are <span className="font-medium">restricted</span>{" "}
              due to privacy, security, or classification protocols, while
              others are <span className="font-medium">confidential</span> and
              may require special authorization to view.
            </p>
            <p>
              To gain access, please submit a request outlining your purpose of
              use. Each request will be reviewed in accordance with the National
              Archives' access policies.
            </p>
            <p>
              We appreciate your understanding as we work to protect and
              preserve Liberia's historical and governmental integrity.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                value={accessTypeFilter}
                onChange={(e) => handleAccessTypeChange(e.target.value as any)}
              >
                <option value="all">All Access Levels</option>
                <option value="restricted">Restricted Only</option>
                <option value="confidential">Confidential Only</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Records Found
              </h3>
              <p className="text-muted-foreground">
                No restricted or confidential records match your search criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {paginatedRecords.map((record) => (
                <Card
                  key={record.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{record.title}</CardTitle>
                      <Badge
                       
                      >
                        {record.accessLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {record.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Lock className="w-4 h-4 mr-2" />
                        Access Restricted
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleRequestAccess(record)}
                      >
                        Request Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}