import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/Table";
import Pagination from "../../../components/Pagination";
import { AccessRequest } from "../../../types/access";

interface AccessRequestsTableProps {
  requests: AccessRequest[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewRequest: (request: AccessRequest) => void;
  onStatusUpdate: (
    requestId: string,
    newStatus: AccessRequest["status"]
  ) => void;
}

export const AccessRequestsTable: React.FC<AccessRequestsTableProps> = ({
  requests,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewRequest,
  onStatusUpdate,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "under_review":
        return "warning";
      case "information_gathering":
        return "secondary";
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "completed":
        return "success";
      default:
        return "outline";
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests ({totalItems})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-w-[900px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {requests.map((request) => {
                const daysRemaining = getDaysRemaining(request.dueDate);
                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-xs">
                      {request.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.requesterName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.requesterEmail}
                        </p>
                        {request.organization && (
                          <p className="text-xs text-muted-foreground">
                            {request.organization}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {request.requestType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(request.status)}
                        className="capitalize"
                      >
                        {request.status.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getPriorityVariant(request.priority)}
                        className="capitalize"
                      >
                        {request.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.assignedTo || "Unassigned"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewRequest(request)}
                        >
                          View
                        </Button>
                        <select
                          className="text-xs border border-border rounded px-2 py-1"
                          value={request.status.name}
                          onChange={(e) =>
                            onStatusUpdate(
                              request.id,
                              e.target.value as AccessRequest["status"]
                            )
                          }
                        >
                          <option value="PENDING">Pending</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {endIndex} of {totalItems} requests
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
