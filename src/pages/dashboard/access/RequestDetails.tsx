import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Mail,
  CheckCheck,
  Clock,
  User,
  Building,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import {
  useAccessRequest,
  useChatMessages,
  useSendChatMessage,
  useMarkAllRead,
  useUnreadCount,
} from "../../../hooks/useAccess";

export default function RequestDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const requestId = params.id as string;
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"chat" | "communications">("chat");
  const [message, setMessage] = useState("");

  // Fetch request details
  const { data: request, isLoading: requestLoading } =
    useAccessRequest(requestId);

  // Fetch chat messages
  const { data: chatMessages = [], isLoading: chatLoading } =
    useChatMessages(requestId);

  // Fetch unread count
  const { data: unreadCount = 0 } = useUnreadCount(requestId);

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
        data: { message },
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
      information_gathering: "secondary",
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
      return formatTime(dateString);
    }
    return formatDate(dateString);
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
          <Button onClick={() => navigate("/dashboard/access-requests")}>
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  // Extract communications from the request data
  const communications = request.communications || [];

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
                onClick={() => navigate("/dashboard/access-requests")}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {request.id}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Submitted {formatDate(request.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={getStatusVariant(request.status.name)}
                className="capitalize"
              >
                {request.status.name.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Request Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Requester Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requester Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <User className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">
                      {request.requesterName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.requesterEmail}
                    </p>
                  </div>
                </div>
                {request.requester?.organization && (
                  <div className="flex items-start space-x-3">
                    <Building className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">
                        {request.requester.organization}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Record</p>
                    <p className="text-sm font-medium mt-1">
                      {request.record.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {request.record.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">
                      {formatDate(request.dueAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium">
                      {request.status.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reason */}
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

          {/* Right Column - Chat & Communications */}
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
                      <span>Chat</span>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("communications")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === "communications"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <span>Activity Log</span>
                      <Badge variant="outline" className="ml-2">
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
                      {chatLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : chatMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                              No messages yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Start a conversation with the requester
                            </p>
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((msg: any) => {
                          const isOwn =
                            msg.actorEmail === request.requesterEmail;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${
                                isOwn ? "justify-start" : "justify-end"
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  isOwn
                                    ? "bg-muted"
                                    : "bg-primary text-primary-foreground"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium">
                                    {msg.actorName || "Unknown"}
                                  </span>
                                  {msg.isRead && !isOwn && (
                                    <CheckCheck className="w-3 h-3 ml-2" />
                                  )}
                                </div>
                                <p className="text-sm">{msg.message}</p>
                                <span className="text-xs opacity-70 mt-1 block">
                                  {formatDate(msg.timestamp)}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="border-t p-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={
                            !message.trim() || sendMessageMutation.isPending
                          }
                          icon={
                            sendMessageMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )
                          }
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Communications Tab */}
                {activeTab === "communications" && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {communications.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            No activity yet
                          </p>
                        </div>
                      </div>
                    ) : (
                      communications.map((comm: any) => (
                        <div key={comm.id} className="bg-muted rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="capitalize">
                                {comm.type.replace("_", " ")}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(comm.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-2">
                            {comm.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            By: {comm.actorName || "System"}
                            {comm.actorEmail && ` (${comm.actorEmail})`}
                          </p>
                          {comm.metadata &&
                            Object.keys(comm.metadata).length > 0 && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                {comm.metadata.previousStatus && (
                                  <p>
                                    Previous: {comm.metadata.previousStatus} →
                                    New: {comm.metadata.newStatus}
                                  </p>
                                )}
                                {comm.metadata.adminEmails && (
                                  <p>
                                    Notified:{" "}
                                    {comm.metadata.adminEmails.join(", ")}
                                  </p>
                                )}
                              </div>
                            )}
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
