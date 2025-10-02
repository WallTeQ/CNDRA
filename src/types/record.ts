// types/record.types.ts
export interface FileAsset {
  filename: string;
  storagePath: string;
  size: string;
  contentType?: string;
}

export interface Collection {
  id: string;
  title: string;
}

export interface Record {
  id: string;
  title: string;
  description?: string;
  accessLevel: "PUBLIC" | "RESTRICTED" | "CONFIDENTIAL" | "SECRET";
  collection?: Collection;
  fileAssets: FileAsset[];
  subjectTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  collections?: Collection[];
}
