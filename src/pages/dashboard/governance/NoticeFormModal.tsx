import { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { RichTextEditor } from "../../../components/ui/RichTextEditor";
import { Button } from "../../../components/ui/Button";
import { Notice } from "../../../types/governance";

// Notice Form Modal Component
interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
  isEdit: boolean;
  createMutation: any;
  updateMutation: any;
}

 export const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  notice,
  isEdit,
  createMutation,
  updateMutation,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    expiresAt: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && notice) {
        setFormData({
          title: notice.title,
          body: notice.body,
          expiresAt: new Date(notice.expiresAt).toISOString().slice(0, 16),
        });
      } else {
        setFormData({
          title: "",
          body: "",
          expiresAt: "",
        });
      }
    }
  }, [isOpen, isEdit, notice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.body.trim() ||
      !formData.expiresAt
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (new Date(formData.expiresAt) <= new Date()) {
      alert("Expiration time must be in the future");
      return;
    }

    try {
      const noticeData = {
        title: formData.title,
        body: formData.body,
        expiresAt: new Date(formData.expiresAt).toISOString(),
        status: "draft" as const,
      };

      if (isEdit && notice) {
        await updateMutation.mutateAsync({ id: notice.id, data: noticeData });
      } else {
        await createMutation.mutateAsync(noticeData);
      }

      onClose();
    } catch (error) {
      console.error("Failed to save notice:", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Notice" : "Create Notice"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Title *"
          placeholder="Enter notice title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notice *
          </label>
          <RichTextEditor
            value={formData.body}
            onChange={(body) =>
              setFormData((prev) => ({ ...prev, body }))
            }
            placeholder="Describe your notice..."
            className="min-h-[200px]"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Expiration Date & Time *"
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
            }
            required
          />
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