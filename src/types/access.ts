// export interface AccessRequest {
//   id: string;
//   requesterName: string;
//   requesterEmail: string;
//   organization?: string;
//   requestType: "foi" | "privacy" | "research" | "other";
//   recordDescription: string;
//   dateRange?: string;
//   purpose?: string;
//   preferredFormat: "digital" | "physical" | "inspection";
//   status:
//     | "pending"
//     | "under_review"
//     | "information_gathering"
//     | "approved"
//     | "rejected"
//     | "completed";
//   priority: "low" | "medium" | "high";
//   submittedDate: string;
//   dueDate: string;
//   assignedTo?: string;
//   estimatedHours?: number;
//   notes?: string;
// }

export interface AccessRequest {
  id: string;
  recordId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
  userId: string;
  userEmail: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  record?: {
    id: string;
    title: string;
    type: string;
    accessLevel: string;
  };
}

export interface ChatMessage {
  id: string;
  requestId: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  id: string;
  requestId: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  participants: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Communication {
  id: string;
  requestId: string;
  type: "MESSAGE" | "STATUS_UPDATE" | "SYSTEM_NOTE";
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Request/Response types
export interface SubmitAccessRequestData {
  recordId: string;
  reason: string;
}

export interface UpdateRequestStatusData {
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED";
  adminNote?: string;
}

export interface SendChatMessageData {
  message: string;
  metadata?: Record<string, any>;
}

export interface AccessRequestFilters {
  status?: string;
  userId?: string;
  recordId?: string;
  dateFrom?: string;
  dateTo?: string;
}
