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

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  newCollection: NewCollectionForm;
  setNewCollection: React.Dispatch<React.SetStateAction<NewCollectionForm>>;
  departments: Department[];
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export default function CreateCollectionModal({
  isOpen,
  onClose,
  newCollection,
  setNewCollection,
  departments,
  onSubmit,
  loading,
}: CreateCollectionModalProps) {
  const handleDepartmentSelection = (
    departmentId: string,
    checked: boolean
  ) => {
    setNewCollection((prev) => ({
      ...prev,
      departmentIds: checked
        ? [...prev.departmentIds, departmentId]
        : prev.departmentIds.filter((id) => id !== departmentId),
    }));
  };

  const handleClose = () => {
    setNewCollection({
      title: "",
      description: "",
      departmentIds: [],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Collection"
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Collection Title"
            placeholder="Enter collection title"
            value={newCollection.title}
            onChange={(e) =>
              setNewCollection((prev) => ({
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
            value={newCollection.description}
            onChange={(e) =>
              setNewCollection((prev) => ({
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
                  checked={newCollection.departmentIds.includes(dept.id)}
                  onChange={(e) =>
                    handleDepartmentSelection(dept.id, e.target.checked)
                  }
                  className="rounded border-border"
                />
                <span className="text-sm">{dept.name}</span>
              </label>
            ))}
          </div>
          {newCollection.departmentIds.length === 0 && (
            <p className="text-xs text-destructive mt-1">
              Please select at least one department
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              loading ||
              !newCollection.title ||
              newCollection.departmentIds.length === 0
            }
          >
            {loading ? "Creating..." : "Create Collection"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
