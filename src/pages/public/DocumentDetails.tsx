import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Download,
  Calendar,
  User,
  Tag,
  FileText,
  Eye,
  Share2,
  Clock,
  MapPin,
  Archive,
  Shield,
  ExternalLink,
  Bookmark,
  Printer as Print,
  ZoomIn as Zoom,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Header } from "../../components/common/Header";
import { Footer } from "../../components/common/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { fetchRecordById } from "../../store/slices/records/recordsThunk";
import type { RootState, AppDispatch } from "../../store";

// Mock related records for now - you can replace this with actual API call later
const mockRelatedRecords = [
  {
    id: "REC-2023-012",
    title: "Annual Budget Report 2023",
    author: "Department of Finance",
    date: "2023-01-15",
    previewUrl: "/api/placeholder/150/100",
  },
  {
    id: "REC-2024-015",
    title: "Q4 Financial Summary",
    author: "Finance Division",
    date: "2024-01-10",
    previewUrl: "/api/placeholder/150/100",
  },
  {
    id: "REC-2024-008",
    title: "Budget Allocation Guidelines",
    author: "Treasury Department",
    date: "2024-01-05",
    previewUrl: "/api/placeholder/150/100",
  },
];

export const RecordDetailsPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentRecord: record, isLoading } = useSelector(
    (state: RootState) => state.records
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchRecordById(params.id as string));
    }
  }, [dispatch, params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isPublic={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-12 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-slate-200 rounded"></div>
                <div className="h-48 bg-slate-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-slate-200 rounded"></div>
                <div className="h-48 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isPublic={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Archive className="mx-auto h-16 w-16 text-slate-400 mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Document Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            The document you're looking for could not be found in our archives.
          </p>
          <Button size="lg" onClick={() => navigate("/search")}>
            Search Our Archives
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Helper functions
  const formatFileSize = (sizeInBytes: string) => {
    const bytes = parseInt(sizeInBytes);
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAccessLevelInfo = (level: string) => {
    switch (level.toLowerCase()) {
      case "public":
        return {
          color: "success",
          description: "Freely accessible to all users",
        };
      case "internal":
        return {
          color: "warning",
          description: "Restricted to registered users",
        };
      case "confidential":
        return {
          color: "danger",
          description: "Limited access - special permission required",
        };
      default:
        return { color: "default", description: "Access level not specified" };
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Extract data from record
  const primaryFile = record.fileAssets[0];
  const fileType = primaryFile
    ? primaryFile.mimeType.split("/")[1].toUpperCase()
    : "UNKNOWN";
  const fileSize = primaryFile ? formatFileSize(primaryFile.size) : "Unknown";
  const formattedDate = formatDate(record.createdAt);
  const accessInfo = getAccessLevelInfo(record.accessLevel);

  // Determine preview URL based on file type
  const isImage =
    primaryFile &&
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
      primaryFile.mimeType.split("/")[1].toLowerCase()
    );
  const previewUrl = isImage
    ? primaryFile.storagePath
    : "/api/placeholder/400/600";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Link to="/" className="hover:text-slate-900">
            Home
          </Link>
          <span>/</span>
          <Link to="/search" className="hover:text-slate-900">
            Search
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Document Details</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/search")}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Search Results</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Header */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="secondary" className="capitalize">
                      {fileType}
                    </Badge>
                    <Badge
                      variant={
                        accessInfo.color === "success"
                          ? "default"
                          : accessInfo.color === "warning"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {record.accessLevel}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      Active
                    </Badge>
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                    {record.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Archive className="h-5 w-5" />
                      <span>{record.collection.title}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => setIsPreviewOpen(true)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Document</span>
                    </Button>

                    {record.accessLevel === "PUBLIC" && primaryFile && (
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download ({fileSize})</span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => setIsShareOpen(true)}
                      className="flex items-center space-x-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>Save</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Print className="h-4 w-4" />
                      <span>Print</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {record.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* File Assets */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Document Files ({record.fileAssets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {record.fileAssets.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">
                              {file.filename}
                            </p>
                            <p className="text-sm text-slate-600">
                              {file.mimeType} • {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags and Keywords */}
            {record.subjectTags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags and Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {record.subjectTags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/search?tag=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Citation Information */}
            <Card>
              <CardHeader>
                <CardTitle>How to Cite This Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-700 font-mono leading-relaxed">
                    "{record.title}." {record.collection.title}, {formattedDate}
                    . Web. {formatDate(new Date().toISOString())}.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      copyToClipboard(
                        `"${record.title}." ${
                          record.collection.title
                        }, ${formattedDate}. Web. ${formatDate(
                          new Date().toISOString()
                        )}.`
                      )
                    }
                  >
                    Copy Citation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Related Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRelatedRecords.map((relatedDoc) => (
                    <Link
                      key={relatedDoc.id}
                      to={`/records/${relatedDoc.id}`}
                      className="block p-4 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      {relatedDoc.previewUrl && (
                        <img
                          src={relatedDoc.previewUrl}
                          alt={relatedDoc.title}
                          className="w-full h-24 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-medium text-slate-900 text-sm line-clamp-2 mb-2">
                        {relatedDoc.title}
                      </h3>
                      <p className="text-xs text-slate-600">
                        {relatedDoc.author && `by ${relatedDoc.author} • `}
                        {formatDate(relatedDoc.date)}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <img
                    src={previewUrl}
                    alt={record.title}
                    className="w-full rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-full p-3 shadow-lg">
                        <Eye className="h-6 w-6 text-slate-700" />
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Zoom className="h-4 w-4 mr-2" />
                  View Full Size
                </Button>
              </CardContent>
            </Card>

            {/* Document Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Document ID
                    </p>
                    <p className="text-sm text-slate-900 font-mono">
                      {record.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      File Type
                    </p>
                    <p className="text-sm text-slate-900">{fileType}</p>
                  </div>

                  {primaryFile && (
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">
                        File Size
                      </p>
                      <p className="text-sm text-slate-900">{fileSize}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Created Date
                    </p>
                    <p className="text-sm text-slate-900">{formattedDate}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Collection
                    </p>
                    <p className="text-sm text-slate-900">
                      {record.collection.title}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Access Level
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          accessInfo.color === "success"
                            ? "default"
                            : accessInfo.color === "warning"
                            ? "secondary"
                            : "destructive"
                        }
                        size="sm"
                        className="capitalize"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {record.accessLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {accessInfo.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      Version
                    </p>
                    <Badge variant="outline" size="sm">
                      v{record.version}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Public Domain
                      </p>
                      <p className="text-xs text-slate-600">
                        Free to use for any purpose
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Research Permitted
                      </p>
                      <p className="text-xs text-slate-600">
                        Academic and scholarly use allowed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Attribution Required
                      </p>
                      <p className="text-xs text-slate-600">
                        Please cite the National Archive
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Have questions about this document or need assistance with
                    your research?
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Contact Research Services
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Visit Reading Room
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={record.title}
        size="xl"
      >
        <div className="space-y-4">
          {/* Preview Controls - Only show for images */}
          {isImage && (
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-slate-600 min-w-[60px] text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRotation((rotation + 90) % 360)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of 1
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Preview Image */}
          <div className="flex justify-center bg-slate-100 p-4 rounded-lg min-h-[400px]">
            <img
              src={previewUrl}
              alt={record.title}
              className="max-w-full max-h-[600px] object-contain shadow-lg"
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.2s ease",
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Document"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Document URL
            </label>
            <div className="flex">
              <input
                type="text"
                value={`${window.location.origin}/records/${record.id}`}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md bg-slate-50 text-sm"
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l-0"
                onClick={() =>
                  copyToClipboard(
                    `${window.location.origin}/records/${record.id}`
                  )
                }
              >
                Copy
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Citation
            </label>
            <div className="flex">
              <textarea
                value={`"${record.title}." ${
                  record.collection.title
                }, ${formattedDate}. Web. ${formatDate(
                  new Date().toISOString()
                )}.`}
                readOnly
                rows={3}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md bg-slate-50 text-sm resize-none"
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l-0 self-start"
                onClick={() =>
                  copyToClipboard(
                    `"${record.title}." ${
                      record.collection.title
                    }, ${formattedDate}. Web. ${formatDate(
                      new Date().toISOString()
                    )}.`
                  )
                }
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};
