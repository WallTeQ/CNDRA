
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { NewCollectionForm } from "../../../types";

interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editCollection: NewCollectionForm;
  setEditCollection: React.Dispatch<React.SetStateAction<NewCollectionForm>>;
  departments: Department[];
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  collectionTitle?: string;
}

export default function EditCollectionModal({
  isOpen,
  onClose,
  editCollection,
  setEditCollection,
  departments,
  onSubmit,
  loading,
  collectionTitle,
}: EditCollectionModalProps) {
  const handleDepartmentSelection = (
    departmentId: string,
    checked: boolean
  ) => {
    setEditCollection((prev) => ({
      ...prev,
      departmentIds: checked
        ? [...prev.departmentIds, departmentId]
        : prev.departmentIds.filter((id) => id !== departmentId),
    }));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Edit Collection: ${collectionTitle}`}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Collection Title"
            placeholder="Enter collection title"
            value={editCollection.title}
            onChange={(e) =>
              setEditCollection((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Description
          </label>
          <textarea
            className="w-full min-h-[100px] rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Describe the collection and its contents"
            value={editCollection.description}
            onChange={(e) =>
              setEditCollection((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Select Departments
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
            {departments.map((dept) => (
              <label
                key={dept.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={editCollection.departmentIds.includes(dept.id)}
                  onChange={(e) =>
                    handleDepartmentSelection(dept.id, e.target.checked)
                  }
                  className="rounded border-border"
                />
                <span className="text-sm">{dept.name}</span>
              </label>
            ))}
          </div>
          {editCollection.departmentIds.length === 0 && (
            <p className="text-xs text-destructive mt-1">
              Please select at least one department
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              loading ||
              !editCollection.title ||
              editCollection.departmentIds.length === 0
            }
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
