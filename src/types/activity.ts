// types/activity.types.ts
import { LucideIcon } from "lucide-react";

export interface Activity {
  id: string;
  type: "upload" | "view" | "download" | "edit" | "delete";
  user: string;
  action: string;
  resource: string;
  time: string;
  icon: LucideIcon;
}

export interface Document {
  id: string;
  title: string;
  author?: string;
  type: string;
  status: string;
  previewUrl?: string;
}
