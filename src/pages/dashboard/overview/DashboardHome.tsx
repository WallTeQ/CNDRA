import React from "react";
import { FileText, Clock, Users, Upload, Eye, Download } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { mockDocuments } from "../../../data/mockData";
import { DashboardHeader } from "./Header";
import { StatsGrid } from "./StatGrid";
import { RecentActivity } from "./RecentActivity";
import { Activity, Document } from "../../../types/activity";
import { RecentRecord } from "./RecentRecord";

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: "Total Documents",
      value: "12,847",
      change: "+12%",
      changeType: "increase" as const,
      icon: FileText,
      color: "blue" as const,
    },
    {
      name: "Pending Reviews",
      value: "23",
      change: "-5%",
      changeType: "decrease" as const,
      icon: Clock,
      color: "yellow" as const,
    },
    {
      name: "New Uploads",
      value: "156",
      change: "+23%",
      changeType: "increase" as const,
      icon: Upload,
      color: "green" as const,
    },
    {
      name: "Active Users",
      value: "1,247",
      change: "+8%",
      changeType: "increase" as const,
      icon: Users,
      color: "purple" as const,
    },
  ];

  const recentActivities: Activity[] = [
    {
      id: "1",
      type: "upload",
      user: "Dr. Sarah Wilson",
      action: "uploaded a new document",
      resource: "Colonial Settlement Records - Boston 1630",
      time: "2 hours ago",
      icon: Upload,
    },
    {
      id: "2",
      type: "view",
      user: "Public User",
      action: "viewed document",
      resource: "Civil War Correspondence - General Grant",
      time: "3 hours ago",
      icon: Eye,
    },
    {
      id: "3",
      type: "download",
      user: "Dr. Michael Chen",
      action: "downloaded document",
      resource: "Industrial Revolution Factory Photos",
      time: "5 hours ago",
      icon: Download,
    },
    {
      id: "4",
      type: "upload",
      user: "Dr. Sarah Wilson",
      action: "uploaded a new document",
      resource: "Treaty Documents - 1783",
      time: "1 day ago",
      icon: Upload,
    },
  ];

  // Convert mockDocuments to Document type
  const recentDocuments: Document[] = mockDocuments.slice(0, 4).map((doc) => ({
    id: doc.id,
    title: doc.title,
    author: doc.author,
    type: doc.type,
    status: doc.status,
    previewUrl: doc.previewUrl,
  }));

  const handleDocumentClick = (document: Document) => {
    // Handle document click - navigate to document detail page
    console.log("Document clicked:", document);
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <DashboardHeader userName={user?.displayName} />

        <StatsGrid stats={stats} />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentActivity activities={recentActivities} />
          <RecentRecord
            documents={recentDocuments}
            onDocumentClick={handleDocumentClick}
          />
        </div>
      </div>
    </div>
  );
};
