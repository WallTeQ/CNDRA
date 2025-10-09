import React, { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { AccessRequest } from "../../../types/access";

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: AccessRequest | null;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const [newNote, setNewNote] = useState("");

  if (!request) return null;

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

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Handle add note logic here
      console.log("Adding note:", newNote);
      setNewNote("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Details - ${request.id}`}
      size="xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Requester Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {request.requesterName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {request.requesterEmail}
              </p>
              {request.organization && (
                <p>
                  <span className="font-medium">Organization:</span>{" "}
                  {request.organization}
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Request Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge
                  variant={getStatusVariant(request.status)}
                  className="capitalize"
                >
                  {request.status.name}
                </Badge>
                <Badge
                  variant={getPriorityVariant(request.priority)}
                  className="capitalize"
                >
                  {request.priority} Priority
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Submitted: {request.submittedDate}
              </p>
              <p className="text-sm text-muted-foreground">
                Due: {request.dueDate}
              </p>
              {request.assignedTo && (
                <p className="text-sm text-muted-foreground">
                  Assigned to: {request.assignedTo}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">
            Record Description
          </h3>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            {request.recordDescription}
          </p>
        </div>

        {request.dateRange && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">Date Range</h3>
            <p className="text-sm text-muted-foreground">{request.dateRange}</p>
          </div>
        )}

        {request.purpose && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">Purpose</h3>
            <p className="text-sm text-muted-foreground">{request.purpose}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-foreground mb-3">
            Communication Thread
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">System</span>
                <span className="text-xs text-muted-foreground">
                  {request.submittedDate}
                </span>
              </div>
              <p className="text-sm">
                Request submitted and assigned ID {request.id}
              </p>
            </div>
            {request.notes && (
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Staff Note</span>
                  <span className="text-xs text-muted-foreground">
                    2024-01-16
                  </span>
                </div>
                <p className="text-sm">{request.notes}</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <textarea
              className="w-full min-h-[80px] rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground"
              placeholder="Add a note or message..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" onClick={handleAddNote}>
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
