import React, { useState } from "react";
import {
  Share2,
  Lock,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Download,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const SecureDocumentSharing = () => {
  const [activeTab, setActiveTab] = useState("share");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [redactionMode, setRedactionMode] = useState(false);
  const [redactionTool, setRedactionTool] = useState("blackbox");
  const [redactions, setRedactions] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRedaction, setCurrentRedaction] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Share Link State
  const [linkPassword, setLinkPassword] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [generatedLink, setGeneratedLink] = useState(null);

  // Access Logs
  const [accessLogs] = useState([
    {
      id: 1,
      user: "john.doe@agency.gov",
      timestamp: "2025-10-22 09:15:23",
      ip: "192.168.1.45",
      action: "Accessed",
      document: "Budget Report Q3.pdf",
    },
    {
      id: 2,
      user: "jane.smith@agency.gov",
      timestamp: "2025-10-22 08:42:10",
      ip: "192.168.1.67",
      action: "Downloaded",
      document: "Policy Document.pdf",
    },
    {
      id: 3,
      user: "admin@agency.gov",
      timestamp: "2025-10-21 16:30:55",
      ip: "192.168.1.12",
      action: "Revoked Access",
      document: "Internal Memo.pdf",
    },
  ]);

  // Active Links
  const [activeLinks, setActiveLinks] = useState([
    {
      id: 1,
      document: "Budget Report Q3.pdf",
      recipient: "Finance Dept",
      expires: "2025-10-25",
      status: "active",
    },
    {
      id: 2,
      document: "Policy Document.pdf",
      recipient: "Legal Team",
      expires: "2025-10-24",
      status: "active",
    },
  ]);

  // Documents for redaction
  const [documents] = useState([
    {
      id: 1,
      name: "FOI Request 2025-001.pdf",
      status: "pending",
      redactions: 3,
    },
    {
      id: 2,
      name: "Meeting Minutes March.pdf",
      status: "approved",
      redactions: 5,
    },
    { id: 3, name: "Employee Records.pdf", status: "pending", redactions: 8 },
  ]);

  const handleGenerateLink = () => {
    if (!linkPassword || !expiryDate || !expiryTime) {
      alert("Please fill in all required fields");
      return;
    }

    const link = `https://secure.doc-share.gov/d/${Math.random()
      .toString(36)
      .substr(2, 12)}`;
    setGeneratedLink({
      url: link,
      password: linkPassword,
      expires: `${expiryDate} ${expiryTime}`,
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const revokeLink = (id) => {
    setActiveLinks(
      activeLinks.map((link) =>
        link.id === id ? { ...link, status: "revoked" } : link
      )
    );
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);

      // Create preview for images and PDFs
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setFilePreview("pdf");
      }
    }
  };

  const handleMouseDown = (e) => {
    if (!redactionMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentRedaction({
      x,
      y,
      width: 0,
      height: 0,
      tool: redactionTool,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !currentRedaction) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentRedaction({
      ...currentRedaction,
      width: x - currentRedaction.x,
      height: y - currentRedaction.y,
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRedaction) {
      // Only add if redaction has meaningful size
      if (
        Math.abs(currentRedaction.width) > 5 &&
        Math.abs(currentRedaction.height) > 5
      ) {
        setRedactions([...redactions, { ...currentRedaction, id: Date.now() }]);
      }
      setIsDrawing(false);
      setCurrentRedaction(null);
    }
  };

  const removeRedaction = (id) => {
    setRedactions(redactions.filter((r) => r.id !== id));
  };

  const clearAllRedactions = () => {
    setRedactions([]);
  };

  const getRedactionStyle = (tool) => {
    switch (tool) {
      case "blackbox":
        return { backgroundColor: "black" };
      case "blur":
        return {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
        };
      case "whiteout":
        return { backgroundColor: "white" };
      default:
        return { backgroundColor: "black" };
    }
  };

  const handleSubmitForApproval = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    // Simulate submission process
    setShowSubmitModal(false);
    setSubmitSuccess(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
      setUploadedFile(null);
      setFilePreview(null);
      clearAllRedactions();
      setRedactionMode(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Secure Document Sharing
            </h1>
          </div>
          <p className="text-slate-600 ml-14">
            Generate password-protected links and manage document access with
            full audit trails
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 border border-slate-200">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("share")}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "share"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Share2 className="w-5 h-5" />
              Generate Secure Link
            </button>
            <button
              onClick={() => setActiveTab("redaction")}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "redaction"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-5 h-5" />
              Document Redaction
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === "logs"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Eye className="w-5 h-5" />
              Access Logs
            </button>
          </div>
        </div>

        {/* Share Link Tab */}
        {activeTab === "share" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Link Generation Form */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Create Secure Share Link
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Document
                  </label>
                  <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option>Budget Report Q3.pdf</option>
                    <option>Policy Document.pdf</option>
                    <option>Strategic Plan 2025.pdf</option>
                    <option>Compliance Report.pdf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={linkPassword}
                      onChange={(e) => setLinkPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
                      placeholder="Enter secure password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      min={getTomorrowDate()}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={expiryTime}
                      onChange={(e) => setExpiryTime(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Recipient Email (Optional)
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="recipient@agency.gov"
                  />
                </div>

                <button
                  onClick={handleGenerateLink}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Share2 className="w-5 h-5" />
                  Generate Secure Link
                </button>
              </div>

              {generatedLink && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800">
                        Link Generated Successfully
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Expires: {generatedLink.expires}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200 mb-2">
                    <p className="text-xs font-medium text-slate-600 mb-1">
                      Secure Link:
                    </p>
                    <p className="text-sm text-slate-800 break-all font-mono">
                      {generatedLink.url}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-200 mb-3">
                    <p className="text-xs font-medium text-slate-600 mb-1">
                      Password:
                    </p>
                    <p className="text-sm text-slate-800 font-mono">
                      {generatedLink.password}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `Link: ${generatedLink.url}\nPassword: ${generatedLink.password}`
                      )
                    }
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied!" : "Copy Link & Password"}
                  </button>
                </div>
              )}
            </div>

            {/* Active Links */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Active Share Links
              </h2>
              <div className="space-y-4">
                {activeLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`p-4 border rounded-lg ${
                      link.status === "revoked"
                        ? "border-red-200 bg-red-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">
                          {link.document}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Shared with: {link.recipient}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <p className="text-sm text-slate-600">
                            Expires: {link.expires}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          link.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {link.status}
                      </span>
                    </div>
                    {link.status === "active" && (
                      <button
                        onClick={() => revokeLink(link.id)}
                        className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Revoke Access
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Redaction Tab */}
        {activeTab === "redaction" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document List */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Documents for Review
              </h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedDocument?.id === doc.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <FileText className="w-5 h-5 text-slate-600" />
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          doc.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800 text-sm mb-1">
                      {doc.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {doc.redactions} redactions required
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Redaction Interface */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              {selectedDocument ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {selectedDocument.name}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-600">
                        {redactions.length} redaction(s)
                      </span>
                      <button
                        onClick={() => setRedactionMode(!redactionMode)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          redactionMode
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {redactionMode
                          ? "Redaction Mode ON"
                          : "Enable Redaction"}
                      </button>
                    </div>
                  </div>

                  {/* File Upload */}
                  {!uploadedFile && (
                    <div className="mb-6">
                      <label className="block w-full cursor-pointer">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-400 transition-colors bg-slate-50">
                          <div className="text-center">
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-700 font-medium mb-1">
                              Upload Document for Redaction
                            </p>
                            <p className="text-sm text-slate-500 mb-3">
                              Click to browse or drag and drop
                            </p>
                            <p className="text-xs text-slate-400">
                              Supports PDF, PNG, JPG (Max 10MB)
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Document Preview Area with Redaction */}
                  {uploadedFile && (
                    <>
                      <div className="mb-4 flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-slate-600" />
                          <span className="text-sm font-medium text-slate-700">
                            {uploadedFile.name}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setUploadedFile(null);
                            setFilePreview(null);
                            clearAllRedactions();
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>

                      <div
                        className={`relative bg-slate-100 border-2 rounded-lg mb-6 overflow-hidden ${
                          redactionMode
                            ? "border-blue-500 cursor-crosshair"
                            : "border-slate-300"
                        }`}
                        style={{ minHeight: "500px" }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        {/* Document Preview */}
                        {filePreview && filePreview !== "pdf" ? (
                          <img
                            src={filePreview}
                            alt="Document preview"
                            className="w-full h-auto"
                            draggable="false"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full min-h-[500px] bg-white">
                            <div className="text-center">
                              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                              <p className="text-slate-600">
                                PDF Document Loaded
                              </p>
                              <p className="text-sm text-slate-500 mt-2">
                                {redactionMode
                                  ? "Click and drag to mark areas for redaction"
                                  : "Enable redaction mode to begin"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Existing Redactions */}
                        {redactions.map((redaction) => (
                          <div
                            key={redaction.id}
                            className="absolute border-2 border-red-500 group"
                            style={{
                              left: Math.min(
                                redaction.x,
                                redaction.x + redaction.width
                              ),
                              top: Math.min(
                                redaction.y,
                                redaction.y + redaction.height
                              ),
                              width: Math.abs(redaction.width),
                              height: Math.abs(redaction.height),
                              ...getRedactionStyle(redaction.tool),
                            }}
                          >
                            <button
                              onClick={() => removeRedaction(redaction.id)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {/* Current Drawing Redaction */}
                        {currentRedaction && (
                          <div
                            className="absolute border-2 border-blue-500 pointer-events-none"
                            style={{
                              left: Math.min(
                                currentRedaction.x,
                                currentRedaction.x + currentRedaction.width
                              ),
                              top: Math.min(
                                currentRedaction.y,
                                currentRedaction.y + currentRedaction.height
                              ),
                              width: Math.abs(currentRedaction.width),
                              height: Math.abs(currentRedaction.height),
                              ...getRedactionStyle(currentRedaction.tool),
                              opacity: 0.7,
                            }}
                          />
                        )}
                      </div>

                      {/* Redaction Tools */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-sm font-medium text-slate-700">
                          Redaction Tool:
                        </span>
                        <button
                          onClick={() => setRedactionTool("blackbox")}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            redactionTool === "blackbox"
                              ? "bg-slate-800 text-white"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          Black Box
                        </button>
                        <button
                          onClick={() => setRedactionTool("blur")}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            redactionTool === "blur"
                              ? "bg-slate-800 text-white"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          Blur
                        </button>
                        <button
                          onClick={() => setRedactionTool("whiteout")}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            redactionTool === "whiteout"
                              ? "bg-slate-800 text-white"
                              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          }`}
                        >
                          White Out
                        </button>
                        <button
                          onClick={clearAllRedactions}
                          className="ml-auto px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  {uploadedFile && (
                    <>
                      {selectedDocument.status === "pending" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-yellow-800">
                                Approval Required
                              </p>
                              <p className="text-sm text-yellow-700 mt-1">
                                This document cannot be published until all
                                redactions are reviewed and approved.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={handleSubmitForApproval}
                          disabled={redactions.length === 0}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Submit for Approval ({redactions.length} redactions)
                        </button>
                        <button className="px-6 bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors flex items-center justify-center gap-2">
                          <Download className="w-5 h-5" />
                          Preview
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-slate-500">
                    Select a document to begin redaction
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Access Logs Tab */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Access Audit Trail
              </h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option>All Actions</option>
                  <option>Accessed</option>
                  <option>Downloaded</option>
                  <option>Revoked</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {accessLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">
                          {log.user}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700">
                          {log.document}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            log.action === "Accessed"
                              ? "bg-blue-100 text-blue-700"
                              : log.action === "Downloaded"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                        {log.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Submit for Approval
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Are you ready to submit this document with {redactions.length}{" "}
                  redaction{redactions.length !== 1 ? "s" : ""} for approval?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Document:
                </span>
                <span className="text-sm text-slate-600">
                  {uploadedFile?.name}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Redactions:
                </span>
                <span className="text-sm text-slate-600">
                  {redactions.length} areas marked
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Status:
                </span>
                <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                  Pending Approval
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Once submitted, this document will be
                reviewed by an approver. The document cannot be published until
                all redactions are approved.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-slide-in">
          <CheckCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Successfully Submitted!</p>
            <p className="text-sm text-green-100">
              Document sent for approval with {redactions.length} redaction
              {redactions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export default SecureDocumentSharing;