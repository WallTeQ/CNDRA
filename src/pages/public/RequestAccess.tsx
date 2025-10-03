// pages/records/RequestAccessPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { ArrowLeft, Lock, ShieldAlert, AlertCircle } from "lucide-react";
import { useRecord } from "../../hooks/useRecords";

interface AccessRequestForm {
  recordId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  organization?: string;
  requestType: "foi" | "privacy" | "research" | "other";
  recordDescription: string;
  dateRange?: string;
  reason: string;
  preferredFormat: "digital" | "physical" | "inspection";
  status: string;
  priority: "low" | "medium" | "high";
  purpose?: string;
  estimatedHours?: number;
  notes?: string;
  communicationThread: any[];
  dueAt: string;
}

export default function RequestAccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get record from location state or fetch it
  const recordFromState = location.state?.record;
  const { data: fetchedRecord, isLoading } = useRecord(
    id as string,
    !recordFromState
  );
  const record = recordFromState || fetchedRecord;

  // Initialize form with default values
  const [requestForm, setRequestForm] = useState<AccessRequestForm>({
    recordId: id || "",
    requesterId: "", // This should be set to current user's ID from auth context
    requesterName: "",
    requesterEmail: "",
    organization: "",
    requestType: "research",
    recordDescription: "",
    dateRange: "",
    reason: "",
    preferredFormat: "digital",
    status: "pending",
    priority: "medium",
    purpose: "",
    estimatedHours: 0,
    notes: "",
    communicationThread: [],
    dueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (record) {
      setRequestForm((prev) => ({
        ...prev,
        recordId: record.id,
        recordDescription: record.title,
      }));
    }
  }, [record]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to submit access request
      console.log("Submitting access request:", requestForm);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message and navigate back
      alert("Access request submitted successfully!");
      navigate("/records/restricted");
    } catch (error) {
      console.error("Failed to submit access request:", error);
      alert("Failed to submit access request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/records/restricted");
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <Card className="animate-pulse">
            <CardContent className="p-12">
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-3"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="py-6">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Record Not Found
              </h3>
              <p className="text-muted-foreground mb-4">
                The record you're trying to request access to could not be
                found.
              </p>
              <Button onClick={handleBack}>Return to Records</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Back Button */}
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Records
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Request Access to Record
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below to request access to this restricted record
          </p>
        </div>

        {/* Record Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>Record Information</CardTitle>
              <Badge
                variant={
                  record.accessLevel === "confidential"
                    ? "destructive"
                    : "secondary"
                }
                className="capitalize"
              >
                {record.accessLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Title
                </p>
                <p className="text-foreground">{record.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-foreground">
                  {record.description || "No description available"}
                </p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground pt-2">
                {record.accessLevel === "confidential" ? (
                  <Lock className="w-4 h-4 mr-2 text-red-600" />
                ) : (
                  <ShieldAlert className="w-4 h-4 mr-2 text-yellow-600" />
                )}
                This record requires special permission to access
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Access Request Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              {/* Requester Information */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Requester Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={requestForm.requesterName}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        requesterName: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    value={requestForm.requesterEmail}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        requesterEmail: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mt-4">
                  <Input
                    label="Organization (Optional)"
                    placeholder="Your organization or institution"
                    value={requestForm.organization}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        organization: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Request Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Request Type
                    </label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                      value={requestForm.requestType}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          requestType: e.target.value as any,
                        })
                      }
                      required
                    >
                      <option value="foi">Freedom of Information</option>
                      <option value="privacy">Privacy Request</option>
                      <option value="research">Research</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Priority
                    </label>
                    <select
                      className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                      value={requestForm.priority}
                      onChange={(e) =>
                        setRequestForm({
                          ...requestForm,
                          priority: e.target.value as any,
                        })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <Input
                    label="Date Range (Optional)"
                    placeholder="e.g., January 2020 - December 2023"
                    value={requestForm.dateRange}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        dateRange: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Reason for Access *
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Explain why you need access to this record..."
                    value={requestForm.reason}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, reason: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Purpose (Optional)
                  </label>
                  <textarea
                    className="w-full min-h-[80px] rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Describe how you intend to use this record..."
                    value={requestForm.purpose}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        purpose: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Preferred Format
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                    value={requestForm.preferredFormat}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        preferredFormat: e.target.value as any,
                      })
                    }
                  >
                    <option value="digital">Digital Copy</option>
                    <option value="physical">Physical Copy</option>
                    <option value="inspection">In-Person Inspection</option>
                  </select>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Additional Information
                </h3>
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    className="w-full min-h-[80px] rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Any additional information that might help process your request..."
                    value={requestForm.notes}
                    onChange={(e) =>
                      setRequestForm({ ...requestForm, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Important Notice
                    </h4>
                    <p className="text-sm text-blue-800">
                      Your request will be reviewed by our records management
                      team. You will receive an email notification once your
                      request has been processed. Processing time may vary
                      depending on the nature and complexity of the request.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
