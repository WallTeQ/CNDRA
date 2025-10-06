export interface AccessRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  organization?: string;
  requestType: "foi" | "privacy" | "research" | "other";
  recordDescription: string;
  dateRange?: string;
  purpose?: string;
  preferredFormat: "digital" | "physical" | "inspection";
  status:
    | "pending"
    | "under_review"
    | "information_gathering"
    | "approved"
    | "rejected"
    | "completed";
  priority: "low" | "medium" | "high";
  submittedDate: string;
  dueDate: string;
  assignedTo?: string;
  estimatedHours?: number;
  notes?: string;
}
