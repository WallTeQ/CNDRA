import type React from "react";
import { useState, useEffect } from "react";
import { Upload, X, FileText, ImageIcon, Music, Video } from "lucide-react";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useDepartments } from "../../hooks/useDepartments";
import { useCollections } from "../../hooks/useCollection";
import { useCreateRecord, useUpdateRecord } from "../../hooks/useRecords";
import { RichTextEditor } from "../../components/ui/RichTextEditor";

export default function UploadDocumentPage({
  isOpen = true,
  onClose,
  onSuccess,
  isEdit = false,
  record,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  isEdit?: boolean;
  record?: any;
}) {
  // React Query hooks
  const { data: departments = [], isLoading: departmentsLoading } =
    useDepartments();
  const { data: collections = [], isLoading: collectionsLoading } =
    useCollections();
  const createRecordMutation = useCreateRecord();
  const updateRecordMutation = useUpdateRecord();

  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    collectionId: "",
    accessLevel: "PUBLIC",
  });
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFiles([]);
      setExistingFiles([]);
      setFormData({
        title: "",
        description: "",
        tags: "",
        collectionId: "",
        accessLevel: "PUBLIC",
      });
      setSelectedDepartment("");

      // Pre-fill if editing
      if (isEdit && record) {
        setFormData({
          title: record.title || "",
          description: record.description || "",
          tags: record.subjectTags ? record.subjectTags.join(", ") : "",
          collectionId: record.collection?.id || "",
          accessLevel: record.accessLevel || "PUBLIC",
        });
        setExistingFiles(record.fileAssets || []);
      }
    }
  }, [isOpen, isEdit, record]);

  useEffect(() => {
    if (isEdit && record && departments.length > 0) {
      setFormData({
        title: record.title || "",
        description: record.description || "",
        tags: record.subjectTags ? record.subjectTags.join(", ") : "",
        collectionId: record.collection?.id || "",
        accessLevel: record.accessLevel || "PUBLIC",
      });
      // Find the department that contains this collection
      const dept = departments.find((d) =>
        d.collections?.some((c) => c.id === record.collection?.id)
      );
      if (dept) {
        setSelectedDepartment(dept.id);
      }
      setExistingFiles(record.fileAssets || []);
    }
  }, [isEdit, record, departments]);

  const accessLevels = [
    {
      value: "PUBLIC",
      label: "Public",
      description: "Accessible to all users and searchable",
    },
    {
      value: "RESTRICTED",
      label: "Restricted",
      description: "Only accessible to staff and authorized users",
    },
    {
      value: "CONFIDENTIAL",
      label: "Confidential",
      description: "Restricted access - admin approval required",
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon;
    if (type.startsWith("audio/")) return Music;
    if (type.startsWith("video/")) return Video;
    return FileText;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.collectionId) {
      alert("Please select a collection");
      return;
    }

    if (!isEdit && files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    const recordData = {
      title: formData.title,
      description: formData.description,
      collectionId: formData.collectionId,
      accessLevel: formData.accessLevel,
      subjectTags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      files: files,
    };

    try {
      if (isEdit && record) {
        await updateRecordMutation.mutateAsync({
          id: record.id,
          data: recordData,
        });
      } else {
        await createRecordMutation.mutateAsync(recordData);
      }
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Failed to save record:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseModal = () => {
    onClose?.();
  };

  // Filter collections based on selected department
  const filteredCollections = selectedDepartment
    ? collections.filter((collection) =>
        collection.departments?.some((dept) => dept.id === selectedDepartment)
      )
    : collections;

  // Combined loading and error states
  const isLoading =
    createRecordMutation.isPending || updateRecordMutation.isPending;
  const error = createRecordMutation.error || updateRecordMutation.error;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={isEdit ? "Edit Record" : "Upload Document"}
      size="xl"
    >
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Document Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-foreground">
                      {isEdit
                        ? "Add new files to the record"
                        : "Drop files here or click to browse"}
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {isEdit
                      ? "Add new files (optional)"
                      : "PDF, images, audio, video files up to 50MB each"}
                  </p>
                </div>
              </div>
            </div>

            {/* Existing Files (for edit mode) */}
            {isEdit && existingFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Existing Files
                </h4>
                {existingFiles.map((fileAsset: any, index: number) => {
                  const FileIcon = getFileIcon(fileAsset.filename || "");
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {fileAsset.filename || "Unnamed file"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(fileAsset.size || 0)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Existing
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  New Files to Upload
                </h4>
                {files.map((file, index) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Record Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Record Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                label="Title *"
                placeholder="Enter document title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Department
                </label>
                <select
                  className="mt-2 flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setFormData((prev) => ({ ...prev, collectionId: "" }));
                  }}
                  disabled={departmentsLoading}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Collection *
                </label>
                <select
                  className="mt-2 flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                  value={formData.collectionId}
                  onChange={(e) =>
                    handleInputChange("collectionId", e.target.value)
                  }
                  required
                  disabled={collectionsLoading}
                >
                  <option value="">Select Collection</option>
                  {filteredCollections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

           
            <div>
              <label htmlFor="">Description</label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
              />
            </div>

            <div>
              <Input
                label="Tags"
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Separate multiple tags with commas (e.g., colonial, history,
                boston)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Access Level *
              </label>
              <div className="space-y-3">
                {accessLevels.map((level) => (
                  <label key={level.value} className="flex items-center">
                    <input
                      type="radio"
                      name="accessLevel"
                      value={level.value}
                      checked={formData.accessLevel === level.value}
                      onChange={(e) =>
                        handleInputChange("accessLevel", e.target.value)
                      }
                      className="focus:ring-primary h-4 w-4 text-primary border-border"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-foreground">
                        {level.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {level.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.title || !formData.collectionId}
          >
            {isLoading
              ? isEdit
                ? "Updating..."
                : "Uploading..."
              : isEdit
              ? "Update Record"
              : "Upload Record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}