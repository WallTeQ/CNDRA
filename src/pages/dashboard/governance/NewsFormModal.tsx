import { Trash2, Upload } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { RichTextEditor } from "../../../components/ui/RichTextEditor";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { useEffect, useState } from "react";
import { News } from "../../../types/governance";


interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: News | null;
  isEdit: boolean;
  createMutation: any;
  updateMutation: any;
}

export const NewsFormModal: React.FC<NewsFormModalProps> = ({
  isOpen,
  onClose,
  news,
  isEdit,
  createMutation,
  updateMutation,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && news) {
        setFormData({
          title: news.title,
          content: news.content,
        });
      } else {
        setFormData({
          title: "",
          content: "",
        });
      }
      setFiles([]);
    }
  }, [isOpen, isEdit, news]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const newsData = {
        title: formData.title,
        content: formData.content,
        files: files,
      };

      if (isEdit && news) {
        await updateMutation.mutateAsync({ id: news.id, data: newsData });
      } else {
        await createMutation.mutateAsync(newsData);
      }

      onClose();
    } catch (error) {
      console.error("Failed to save news:", error);
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

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit News Article" : "Create News Article"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Title *"
          placeholder="Enter news title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
            placeholder="Write your news content here..."
            className="min-h-[300px]"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Attachments
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <div className="mt-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-slate-600">
                    Upload files or drag and drop
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Images, PDFs, and documents up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded"
                >
                  <span className="text-sm text-slate-700">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
