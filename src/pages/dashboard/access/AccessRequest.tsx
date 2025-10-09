"use client";

import { useState, useMemo } from "react";
import {
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Download,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { StatsGrid } from "../overview/StatGrid";
import { AccessRequestsFilters } from "./AccessRequestFilter";
import { AccessRequestsTable } from "./AccessRequestTable";
import { RequestDetailModal } from "./RequestDetailModal";
import { AccessRequest } from "../../../types/access";
import {
  useAccessRequests,
  useUpdateRequestStatus,
} from "../../../hooks/useAccess";
import { useNavigate } from "react-router-dom";

export default function AccessRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  // Fetch access requests with filters
  const filters = useMemo(() => {
    const filterObj: any = {};
    if (statusFilter !== "all") {
      filterObj.status = statusFilter;
    }
    if (priorityFilter !== "all") {
      filterObj.priority = priorityFilter;
    }
    return filterObj;
  }, [statusFilter, priorityFilter]);

  const {
    data: requests = [],
    isLoading,
    error,
    refetch,
  } = useAccessRequests(filters);

  // Fetch overdue requests for stats
  // const { data: overdueRequestsData = [] } = useOverdueRequests();

  // Update request status mutation
  const updateStatusMutation = useUpdateRequestStatus();

  const handleViewRequest = (request: AccessRequest) => {
    navigate(`/dashboard/access-request/${request.id}`);
  };


  const pendingReview = requests.filter(
    (r) => r.status?.name === "PENDING" || r.status?.name === "UNDER_REVIEW"
  ).length;

  const completedRequests = requests.filter(
    (r) => r.status?.name === "COMPLETED"
  ).length;
  // Stats configuration
  const requestStats = [
    {
      name: "Total Requests",
      value: requests.length.toString(),
      change: "+12%",
      changeType: "increase" as const,
      icon: FileCheck,
      color: "red" as const,
    },
    {
      name: "Pending Review",
      value: pendingReview.toString(),
      change: "+5%",
      changeType: "increase" as const,
      icon: Clock,
      color: "yellow" as const,
    },
    // {
    //   name: "Overdue",
    //   value: overdueRequestsData.length.toString(),
    //   change: "-3%",
    //   changeType: "decrease" as const,
    //   icon: AlertTriangle,
    //   color: "red" as const,
    // },
    {
      name: "Completed",
      value: completedRequests.toString(),
      change: "+18%",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "green" as const,
    },
  ];

  // Filter by search term (client-side filtering)
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.requesterName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.recordDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [requests, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Event handlers
  const handleStatusUpdate = async (
    requestId: string,
    newStatus: AccessRequest["status"]
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        requestId,
        data: { status: newStatus },
      });
      // Optionally show success message
    } catch (error) {
      console.error("Failed to update status:", error);
      // Optionally show error message
    }
  };

  const handleExportReport = () => {
    // Implement export functionality
    console.log("Exporting report...");
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePriorityFilterChange = (value: string) => {
    setPriorityFilter(value);
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Failed to load requests
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Access Requests
            </h1>
            <p className="text-muted-foreground">
              Manage Freedom of Information and access requests
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportReport}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsGrid
          stats={requestStats}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        />

        {/* Filters */}
        <AccessRequestsFilters
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
          priorityFilter={priorityFilter}
          setPriorityFilter={handlePriorityFilterChange}
        />

        {/* Requests Table */}
        <AccessRequestsTable
          requests={paginatedRequests}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredRequests.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onViewRequest={handleViewRequest}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Request Detail Modal */}
        <RequestDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          request={selectedRequest}
        />
      </div>
    </div>
  );
}
