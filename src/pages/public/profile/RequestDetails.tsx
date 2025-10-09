"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Mail,
  CheckCheck,
  Clock,
  FileText,
  AlertCircle,
  Loader2,
  Calendar,
  User as UserIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import {
  useAccessRequest,
  useSendChatMessage,
  useMarkAllRead,
  useUnreadCount,
  useChatMessages
} from "../../../hooks/useAccess";
import { useAuth } from "../../../hooks/useAuth";

export default function UserRequestDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const requestId = params.id as string;
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"chat" | "activity">("chat");
  const [message, setMessage] = useState("");

  // Fetch request details
  const { data: request, isLoading: requestLoading } = useAccessRequest(requestId);

  // Fetch unread count
  const { data: unreadCount = 0 } = useUnreadCount(requestId);

    // Fetch chat messages
    const { data: chatMessages = [], isLoading: chatLoading } = useChatMessages(requestId);

  // Mutations
  const sendMessageMutation = useSendChatMessage();
  const markAllReadMutation = useMarkAllRead();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Mark messages as read when viewing chat tab
  useEffect(() => {
    if (activeTab === "chat" && unreadCount > 0) {
      markAllReadMutation.mutate(requestId);
    }
  }, [activeTab, requestId]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        requestId,
        data: { content: message },
      });
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusVariant = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: Record<string, any> = {
      pending: "outline",
      under_review: "warning",
      approved: "success",
      rejected: "destructive",
      completed: "success",
    };
    return variants[statusLower] || "outline";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `Today at ${formatTime(dateString)}`;
    } else if (diffInHours < 48) {
      return `Yesterday at ${formatTime(dateString)}`;
    }
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
  };

  if (requestLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Request not found</p>
          <Button onClick={() => navigate("/profile")}>Back to Profile</Button>
        </div>
      </div>
    );
  }

  const communications = request.communications || [];
  const communicationThread = request.communicationThread || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Profile
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Access Request</h1>
                <p className="text-sm text-muted-foreground">
                  ID: {request.id.slice(0, 13)}...
                </p>
              </div>
            </div>
            <Badge variant={getStatusVariant(request.status.name)} className="capitalize">
              {request.status.name.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Request Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Record Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requested Record</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {request.record.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {request.record.description}
                  </p>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Access Level</span>
                    <Badge variant="outline">{request.record.accessLevel}</Badge>
                  </div>
                  {request.record.subjectTags && request.record.subjectTags.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {request.record.subjectTags.map((tag: any) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            {tag.term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/records/${request.record.id}`)}
                  icon={<ExternalLink className="w-4 h-4" />}
                >
                  View Record Details
                </Button>
              </CardContent>
            </Card>

            {/* Request Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Status</p>
                    <p className="text-sm font-medium">{request.status.description}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-sm font-medium">{formatDate(request.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">{formatDate(request.dueAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Reason */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {request.reason || "No reason provided"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat & Activity */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab("chat")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === "chat"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Messages</span>
                      {chatMessages.length > 0 && (
                        <Badge
                          variant={activeTab === "chat" ? "secondary" : "outline"}
                          className="ml-2"
                        >
                          {chatMessages.length}
                        </Badge>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === "activity"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Activity Log</span>
                      <Badge
                        variant={activeTab === "activity" ? "secondary" : "outline"}
                        className="ml-2"
                      >
                        {communications.length}
                      </Badge>
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col h-[calc(100%-80px)] p-0">
                {/* Chat Tab */}
                {activeTab === "chat" && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {chatMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                              No messages yet
                            </p>
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((message) => (
                          <div key={message.id} className="p-4 border-b">
                            <p className="text-sm font-medium">
                              {message.senderName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {message.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 border-t">
                      <textarea
                        className="w-full p-2 border rounded"
                        placeholder="Type your message..."
                      />
                    </div>
                  </>
                )}

                {/* Activity Tab */}
                {activeTab === "activity" && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {communications.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">
                            No activity yet
                          </p>
                        </div>
                      </div>
                    ) : (
                      communications.map((activity) => (
                        <div key={activity.id} className="p-4 border-b">
                          <p className="text-sm font-medium">
                            {activity.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}