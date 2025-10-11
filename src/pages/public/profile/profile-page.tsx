import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { useAuth } from "../../../hooks/useAuth";
import { useAccessRequests } from "../../../hooks/useAccess";
import { AccessRequest } from "../../../types/access";
import { formatDate } from "../../../utils/FormatDate";
import { getProfile } from "../../../store/slices/auth/authThunk";
import { useAppDispatch, useAppSelector } from "../../../store";

export default function UserProfilePage() {
   const dispatch = useAppDispatch();
    const {
      user,
    } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "requests">("profile");

  useEffect(() => {
    if (!user && !isLoading) {
      // If not authenticated, redirect to login
      navigate("/login");
    } else if (!user && isLoading) {
      // If loading and no user, try fetching profile
      dispatch(getProfile());
    }
  }, [user, dispatch]);

 
  console.log("user profile", user);

  // Fetch user's access requests
  const { data: accessRequests = [], isLoading } = useAccessRequests({});

  

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

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
      case "under_review":
        return <Clock className="w-4 h-4" />;
      case "approved":
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getRequestStats = () => {
    const pending = accessRequests.filter(
      (r) => r.status.name === "PENDING" || r.status.name === "UNDER_REVIEW"
    ).length;
    const approved = accessRequests.filter(
      (r) => r.status.name === "APPROVED" || r.status.name === "COMPLETED"
    ).length;
    const rejected = accessRequests.filter(
      (r) => r.status.name === "REJECTED"
    ).length;

    return { total: accessRequests.length, pending, approved, rejected };
  };

  const stats = getRequestStats();

  const handleViewRequest = (request: AccessRequest) => {
    navigate(`/profile/requests/${request.id}`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and access requests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "profile"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "requests"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Access Requests
            {stats.total > 0 && (
              <Badge variant="secondary" className="ml-2">
                {stats.total}
              </Badge>
            )}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-primary-foreground">
                        {user.displayName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground">
                      {user.displayName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="mt-4">
                      <Badge variant="outline" className="capitalize">
                        {user.roles?.[0]?.name || "User"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Full Name
                        </p>
                        <p className="text-base">{user.displayName}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Email
                        </p>
                        <p className="text-base">{user.email}</p>
                      </div>
                    </div>
                    {user.phoneNumber && (
                      <div className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Phone
                          </p>
                          <p className="text-base">{user.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                    {user.dateOfBirth && (
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Date of Birth
                          </p>
                          <p className="text-base">
                            {formatDate(user.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                    <div className="space-y-1">
                      {user.address && (
                        <p className="text-base">{user.address}</p>
                      )}
                      <p className="text-base">
                        {[user.city, user.state, user.postalCode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {user.country && (
                        <p className="text-base">{user.country}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-foreground">
                        {stats.total}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Requests
                      </p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">
                        {stats.pending}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {stats.approved}
                      </p>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">
                        {stats.rejected}
                      </p>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Access Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total
                      </p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {stats.pending}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Approved
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.approved}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Rejected
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats.rejected}
                      </p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requests List */}
            <Card>
              <CardHeader>
                <CardTitle>My Access Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : accessRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No access requests yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Request access to restricted records to get started
                    </p>
                    <Button onClick={() => navigate("/search")}>
                      Browse Records
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {accessRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-lg p-4 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                variant={getStatusVariant(request.status.name)}
                                className="capitalize"
                              >
                                {getStatusIcon(request.status.name)}
                                <span className="ml-1">
                                  {request.status.name.replace("_", " ")}
                                </span>
                              </Badge>
                              {request.communicationThread.length > 0 && (
                                <Badge variant="outline">
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  {request.communicationThread.length} messages
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {request.record.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {request.record.description}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRequest(request)}
                            icon={<Eye className="w-4 h-4" />}
                          >
                            View
                          </Button>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>
                              Requested: {formatDate(request.createdAt)}
                            </span>
                            <span>•</span>
                            <span>Due: {formatDate(request.dueAt)}</span>
                          </div>
                          <Badge variant="outline">
                            ID: {request.id.slice(0, 8)}...
                          </Badge>
                        </div>

                        {request.reason && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm">
                              <span className="font-medium">Reason:</span>{" "}
                              {request.reason}
                            </p>
                          </div>
                        )}

                        {request.record.subjectTags &&
                          request.record.subjectTags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {request.record.subjectTags.map((tag: any) => (
                                <Badge
                                  key={tag.id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag.term}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
