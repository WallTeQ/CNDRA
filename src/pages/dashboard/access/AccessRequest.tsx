"use client";

import { useState } from "react";
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

const mockRequests: AccessRequest[] = [
  {
    id: "REQ-2024-001",
    requesterName: "John Smith",
    requesterEmail: "john.smith@email.com",
    organization: "City News",
    requestType: "foi",
    recordDescription:
      "Budget documents for fiscal year 2023, including all departmental allocations and expenditures",
    dateRange: "January 2023 - December 2023",
    purpose: "Investigative journalism on municipal spending",
    preferredFormat: "digital",
    status: "under_review",
    priority: "medium",
    submittedDate: "2024-01-15",
    dueDate: "2024-02-14",
    assignedTo: "Sarah Johnson",
    estimatedHours: 8,
    notes: "Large request, may require redaction review",
  },
  {
    id: "REQ-2024-002",
    requesterName: "Maria Garcia",
    requesterEmail: "maria.garcia@university.edu",
    organization: "State University",
    requestType: "research",
    recordDescription:
      "Historical meeting minutes from city council sessions 1990-2000",
    dateRange: "1990-2000",
    purpose: "Academic research on municipal governance",
    preferredFormat: "digital",
    status: "information_gathering",
    priority: "low",
    submittedDate: "2024-01-12",
    dueDate: "2024-02-11",
    assignedTo: "Mike Davis",
    estimatedHours: 12,
  },
  {
    id: "REQ-2024-003",
    requesterName: "Robert Wilson",
    requesterEmail: "robert.wilson@email.com",
    requestType: "privacy",
    recordDescription:
      "Personal employment records and performance evaluations",
    preferredFormat: "physical",
    status: "pending",
    priority: "high",
    submittedDate: "2024-01-18",
    dueDate: "2024-02-17",
    estimatedHours: 2,
  },
];

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Calculate statistics
  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pendingReview = requests.filter(
    (r) => r.status === "pending" || r.status === "under_review"
  ).length;
  const overdueRequests = requests.filter(
    (r) => getDaysRemaining(r.dueDate) < 0
  ).length;
  const completedRequests = requests.filter(
    (r) => r.status === "completed"
  ).length;

  // Stats configuration
  const requestStats = [
    {
      name: "Total Requests",
      value: requests.length.toString(),
      change: "+12%",
      changeType: "increase" as const,
      icon: FileCheck,
      color: "blue" as const,
    },
    {
      name: "Pending Review",
      value: pendingReview.toString(),
      change: "+5%",
      changeType: "increase" as const,
      icon: Clock,
      color: "yellow" as const,
    },
    {
      name: "Overdue",
      value: overdueRequests.toString(),
      change: "-3%",
      changeType: "decrease" as const,
      icon: AlertTriangle,
      color: "red" as const,
    },
    {
      name: "Completed",
      value: completedRequests.toString(),
      change: "+18%",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "green" as const,
    },
  ];

  // Filter and pagination logic
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.recordDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Event handlers
  const handleStatusUpdate = (
    requestId: string,
    newStatus: AccessRequest["status"]
  ) => {
    setRequests(
      requests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleViewRequest = (request: AccessRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Access Requests
            </h1>
            <p className="text-muted-foreground">
              Manage Freedom of Information and access requests
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline"
              size="sm"
              className="whitespace-nowrap"
              icon={<Download className="w-4 h-4" />}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards - Using Reusable StatsGrid Component */}
        <StatsGrid
          stats={requestStats}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        />

        {/* Filters */}
        <AccessRequestsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
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
      {/* Header */}
    </div>
  );
}
