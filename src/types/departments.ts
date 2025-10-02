import { Record } from "./index";
export interface Collection {
  id: string;
  title: string;
  description: string;
  records: Record[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  collections?: Collection[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentFormData {
  name: string;
  description: string;
}
