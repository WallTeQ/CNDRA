export interface News {
  id: string;
  title: string;
  content: string;
  author: Author;
  fileAssets?: FileAsset[];
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  expiresAt: string;
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  requiresRegistration?: number;
  registrationUrl?: string;
  status: "draft" | "published";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Author {
  id: string;
  displayName: string;
  email: string;
}

export interface FileAsset {
  id: string;
  filename: string;
  fileType: string;
  storagePath: string;
  fileSize: number;
  url: string;
  previewUrl?: string;
}

// Request/Response types
export interface CreateNewsRequest {
  title: string;
  content: string;
  files?: File[];
}

export interface UpdateNewsRequest {
  title?: string;
  content?: string;
  files?: File[];
}

export interface CreateNoticeRequest {
  title: string;
  body: string;
  expiresAt: string;
  status: "draft";
}

export interface UpdateNoticeRequest {
  title?: string;
  body?: string;
  expiresAt?: string;
  status?: "draft" | "published";
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  status: "draft";
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  status?: "draft" | "published";
}

export interface PublishRequest {
  noticeId?: string;
  eventId?: string;
}

export interface NewsFilters {
  status?: "draft" | "published";
  authorId?: string;
  page?: number;
  pageSize?: number;
}

export interface NoticeFilters {
  status?: "draft" | "published";
  page?: number;
  pageSize?: number;
}

export interface EventFilters {
  status?: "draft" | "published";
  page?: number;
  pageSize?: number;
}
