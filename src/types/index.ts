export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'viewer';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Document {
  id: string;
  title: string;
  type: 'manuscript' | 'photograph' | 'map' | 'record' | 'audio' | 'video' | 'other';
  author?: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
  accessLevel: 'public' | 'internal' | 'confidential';
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  uploadedBy: string;
  uploadedAt: string;
  fileSize: number;
  fileType: string;
  previewUrl?: string;
  downloadUrl?: string;
  versionHistory: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  version: string;
  uploadedAt: string;
  uploadedBy: string;
  changes: string;
}

export interface SearchFilters {
  keyword: string;
  type: string[];
  dateRange: {
    start: string;
    end: string;
  };
  author: string;
  category: string;
  accessLevel: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  resource: string;
  timestamp: string;
  details: string;
}