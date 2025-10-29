export interface FileAsset {
  filename: string;
  storagePath: string;
  size: string;
  contentType?: string;
  id: string;
  mimeType: string;
  type: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  title: string;
}

export interface Record {
  id: string;
  title: string;
  description?: string;
  accessLevel: "PUBLIC" | "RESTRICTED" | "CONFIDENTIAL" ;
  collection?: Collection;
  fileAssets: FileAsset[];
  subjectTags: Array<{
    id: string;
    term: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  collection: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}
