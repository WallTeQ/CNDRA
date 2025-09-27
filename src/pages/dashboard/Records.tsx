
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Dropdown } from "../../components/ui/Dropdown";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchRecords, deleteRecord } from "../../store/slices/records/recordsThunk";
import { fetchDepartments } from "../../store/slices/depatments/departmentThunk";
import { clearError } from "../../store/slices/records/recordsSlice";
import { Record } from "../../types";
import { formatDateTime } from "../../utils/FormatDate";
import { Plus, FileText, Building2, Eye, CheckCircle, Search, RefreshCw, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2, Download, File } from "lucide-react";
import UploadDocumentPage from "./UploadDocument";

export default function RecordsPage() {
  const dispatch = useAppDispatch();
  const { records, isLoading, error } = useAppSelector(
    (state) => state.records
  );
  const { departments } = useAppSelector((state) => state.departments);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [previewFileIndex, setPreviewFileIndex] = useState(0);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [shouldRefetchRecords, setShouldRefetchRecords] = useState(false);

  // Edit modal state
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecordForEdit, setSelectedRecordForEdit] = useState<Record | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    if (shouldRefetchRecords) {
      dispatch(fetchRecords());
      setShouldRefetchRecords(false);
    }
  }, [shouldRefetchRecords, dispatch]);

  useEffect(() => {
    dispatch(fetchRecords());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const accessLevels = ["PUBLIC", "RESTRICTED", "CONFIDENTIAL"];

  const filteredRecords = (records || [])
    .filter((record) => {
      // Filter out invalid records
      if (!record || typeof record !== 'object') return false;
      if (!record.id) return false;

      const matchesSearch =
        (record.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (record.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        record.subjectTags?.some((tag) =>
          tag?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || false;

    const matchesDepartment =
      !selectedDepartment ||
      (record.collection &&
        departments.find(
          (dept) =>
            dept.collections?.some((col) => col.id === record.collection?.id) &&
            dept.id === selectedDepartment
        ));      const matchesAccessLevel =
        !selectedAccessLevel || record.accessLevel === selectedAccessLevel;

      return matchesSearch && matchesDepartment && matchesAccessLevel;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime(); // Newest records first
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment, selectedAccessLevel]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  const getAccessLevelVariant = (level?: string) => {
    switch (level) {
      case "PUBLIC":
        return "success";
      case "RESTRICTED":
        return "warning";
      case "CONFIDENTIAL":
        return "danger";
      case "SECRET":
        return "info";
      default:
        return "default";
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await dispatch(deleteRecord(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete record:", error);
      }
    }
  };

  const handleViewRecord = (record: Record) => {
    setSelectedRecord(record);
    setPreviewFileIndex(0);
    setIsPreviewOpen(true);
    // No need to pre-fetch files - we'll handle them on demand
  };



  const handleDownloadFile = async (fileAsset: any) => {
    try {
      // Fetch the file as a blob
      const response = await fetch(fileAsset.storagePath);
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileAsset.filename || 'download';
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab if download fails
      window.open(fileAsset.storagePath, '_blank');
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return 'image';
    }
    if (['pdf'].includes(extension || '')) {
      return 'pdf';
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
      return 'document';
    }
    return 'other';
  };

  const formatFileSize = (sizeStr: string) => {
    const size = Number.parseInt(sizeStr);
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (size === 0) return "0 Bytes";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return Math.round((size / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Records Management
            </h1>
            <p className="text-muted-foreground">
              Manage and organize institutional records
            </p>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            New Record
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-destructive">Error Loading Records</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(clearError())}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {records.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Departments
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Records
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {records.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                className="flex h-10 w-full lg:w-48 rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <select
                className="flex h-10 w-full lg:w-48 rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedAccessLevel}
                onChange={(e) => setSelectedAccessLevel(e.target.value)}
              >
                <option value="">All Access Levels</option>
                {accessLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch(fetchRecords());
                  }}
                  className="whitespace-nowrap"
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Refresh
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="whitespace-nowrap"
                  icon={<Filter className="w-4 h-4" />}
                >
                  Advanced Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        {isLoading ? (
          <Card className="py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center">
                <RefreshCw className="animate-spin w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Loading Records</h3>
                <p className="text-muted-foreground">Please wait while we fetch your records...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredRecords.length === 0 ? (
          <Card className="py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm || selectedDepartment || selectedAccessLevel ? 'No Records Found' : 'No Records Yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchTerm || selectedDepartment || selectedAccessLevel
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                    : 'Get started by creating your first record to organize your institutional documents.'
                  }
                </p>
                {(!searchTerm && !selectedDepartment && !selectedAccessLevel) && (
                  <Button onClick={() => setIsUploadModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                    Create Your First Record
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Record
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Collection
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Access Level
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {paginatedRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                              <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {record.title || "Untitled"}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-xs">
                                {record.description || "No description"}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDateTime(record.createdAt)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-muted-foreground">
                            {record.collection?.title || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            size="xs"
                            variant={getAccessLevelVariant(record.accessLevel)}
                            className="text-xs"
                          >
                            {record.accessLevel}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Dropdown
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            }
                            items={[
                              {
                                label: "View Details",
                                icon: <Eye className="w-4 h-4" />,
                                onClick: () => handleViewRecord(record)
                              },
                              {
                                label: "Edit",
                                icon: <Edit className="w-4 h-4" />,
                                onClick: () => {
                                  setSelectedRecordForEdit(record);
                                  setIsEditMode(true);
                                }
                              },
                              {
                                label: "Delete",
                                icon: <Trash2 className="w-4 h-4" />,
                                variant: "destructive",
                                onClick: () => handleDeleteRecord(record.id)
                              }
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-muted/30 px-6 py-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum > totalPages) return null;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "primary" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {/* Header */}

      {/* Document Preview Modal */}
      {selectedRecord && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewError(null);
          }}
          title={`Record Details: ${selectedRecord?.title || "Untitled"}`}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Record Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                    <p className="text-foreground font-medium">{selectedRecord?.title || "Untitled"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-foreground">{selectedRecord?.description || "No description"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Collection</label>
                    <p className="text-foreground">{selectedRecord?.collection?.title || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Access Level</label>
                    <Badge variant={getAccessLevelVariant(selectedRecord?.accessLevel)} size="xs" className="mt-1">
                      {selectedRecord?.accessLevel || "Unknown"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                    <p className="text-foreground">{formatDateTime(selectedRecord?.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Files & Tags</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">File Assets</label>
                    <div className="mt-2 space-y-2">
                      {selectedRecord.fileAssets.map((fileAsset, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <File className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {fileAsset.filename || `File ${index + 1}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(fileAsset.size)}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadFile(fileAsset)}
                              className="text-xs"
                              icon={<Download className="w-3 h-3" />}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subject Tags</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRecord.subjectTags.map((tag: string) => (
                        <Badge key={tag} variant="default" size="xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedRecord.fileAssets && selectedRecord.fileAssets.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Preview</h3>
                  {selectedRecord.fileAssets.length > 1 && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewFileIndex(prev => Math.max(0, prev - 1));
                          setPreviewError(null);
                        }}
                        disabled={previewFileIndex === 0}
                        icon={<ChevronLeft className="w-4 h-4" />}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {previewFileIndex + 1} of {selectedRecord.fileAssets.length}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewFileIndex(prev => Math.min(selectedRecord.fileAssets.length - 1, prev + 1));
                          setPreviewError(null);
                        }}
                        disabled={previewFileIndex === selectedRecord.fileAssets.length - 1}
                        icon={<ChevronRight className="w-4 h-4" />}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-center bg-slate-100 p-4 rounded-lg min-h-[400px]">
                  {(() => {
                    const currentFile = selectedRecord.fileAssets[previewFileIndex];
                    const fileType = getFileType(currentFile.filename || '');

                    if (previewError) {
                      return (
                        <div className="flex flex-col items-center justify-center text-center">
                          <File className="w-16 h-16 text-muted-foreground mb-4" />
                          <h4 className="text-lg font-medium text-foreground mb-2">
                            {currentFile.filename || 'File'}
                          </h4>
                          <p className="text-muted-foreground mb-4">
                            {previewError}
                          </p>
                          <Button
                            onClick={() => handleDownloadFile(currentFile)}
                            icon={<Download className="w-4 h-4" />}
                          >
                            Download to View
                          </Button>
                        </div>
                      );
                    }

                    if (fileType === 'image') {
                      return (
                        <img
                          src={currentFile.storagePath}
                          alt={currentFile.filename || selectedRecord.title}
                          className="max-w-full max-h-[600px] object-contain shadow-lg"
                          onError={() => {
                            setPreviewError('This file cannot be previewed directly.');
                          }}
                          onLoad={() => {
                            setPreviewError(null);
                          }}
                        />
                      );
                    } else {
                      // For all non-image files, show download prompt
                      return (
                        <div className="flex flex-col items-center justify-center text-center">
                          <File className="w-16 h-16 text-muted-foreground mb-4" />
                          <h4 className="text-lg font-medium text-foreground mb-2">
                            {currentFile.filename || 'File'}
                          </h4>
                          <p className="text-muted-foreground mb-4">
                            This file type cannot be previewed directly.
                          </p>
                          <Button
                            onClick={() => handleDownloadFile(currentFile)}
                            icon={<Download className="w-4 h-4" />}
                          >
                            Download to View
                          </Button>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // Handle edit - you can implement this
                  setIsPreviewOpen(false);
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Edit Record
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Document Modal */}
      <UploadDocumentPage
        isOpen={isUploadModalOpen || isEditMode}
        onClose={() => {
          setIsUploadModalOpen(false);
          setIsEditMode(false);
          setSelectedRecordForEdit(null);
          setShouldRefetchRecords(true);
        }}
        onSuccess={() => {}}
        isEdit={isEditMode}
        record={selectedRecordForEdit}
      />
    </div>
  );
}

