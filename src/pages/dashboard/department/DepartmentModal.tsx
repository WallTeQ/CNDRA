import React from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Department, DepartmentFormData } from "../../../types/departments";

interface DepartmentModalsProps {
  // New Department Modal
  isNewModalOpen: boolean;
  onNewModalClose: () => void;
  newForm: DepartmentFormData;
  onNewFormChange: (form: DepartmentFormData) => void;
  onNewSubmit: (e: React.FormEvent) => void;

  // Edit Department Modal
  isEditModalOpen: boolean;
  onEditModalClose: () => void;
  editForm: DepartmentFormData;
  onEditFormChange: (form: DepartmentFormData) => void;
  onEditSubmit: (e: React.FormEvent) => void;

  // View Department Modal
  isViewModalOpen: boolean;
  onViewModalClose: () => void;
  selectedDepartment: Department | null;
  onEditFromView: (department: Department) => void;

  loading: boolean;
}

export const DepartmentModals: React.FC<DepartmentModalsProps> = ({
  isNewModalOpen,
  onNewModalClose,
  newForm,
  onNewFormChange,
  onNewSubmit,
  isEditModalOpen,
  onEditModalClose,
  editForm,
  onEditFormChange,
  onEditSubmit,
  isViewModalOpen,
  onViewModalClose,
  selectedDepartment,
  onEditFromView,
  loading,
}) => {
  const getRecordCount = (department: Department): number => {
    return (
      department.collections?.reduce(
        (sum, collection) => sum + (collection.records?.length || 0),
        0
      ) || 0
    );
  };

  return (
    <>
      {/* New Department Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={onNewModalClose}
        title="Create New Department"
        size="lg"
      >
        <form onSubmit={onNewSubmit} className="space-y-4">
          <Input
            label="Department Name"
            placeholder="Enter department name"
            value={newForm.name}
            onChange={(e) =>
              onNewFormChange({
                ...newForm,
                name: e.target.value,
              })
            }
            required
          />
          <div>
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              className="mt-2 flex min-h-[80px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Enter department description"
              value={newForm.description}
              onChange={(e) =>
                onNewFormChange({
                  ...newForm,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onNewModalClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !newForm.name.trim()}>
              {loading ? "Creating..." : "Create Department"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Department Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={onViewModalClose}
        title={`Department Details: ${selectedDepartment?.name}`}
        size="lg"
      >
        {selectedDepartment && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Department Name
                    </label>
                    <p className="text-foreground font-medium">
                      {selectedDepartment.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Description
                    </label>
                    <p className="text-foreground">
                      {selectedDepartment.description ||
                        "No description provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Created Date
                    </label>
                    <p className="text-foreground">
                      {new Date(
                        selectedDepartment.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </label>
                    <p className="text-foreground">
                      {new Date(
                        selectedDepartment.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">
                      Collections
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {selectedDepartment.collections?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-900">
                      Total Records
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {getRecordCount(selectedDepartment)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedDepartment.collections &&
              selectedDepartment.collections.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Collections
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDepartment.collections.map((collection) => (
                      <div
                        key={collection.id}
                        className="p-4 border border-border rounded-lg"
                      >
                        <h4 className="font-medium text-foreground mb-2">
                          {collection.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Records:
                          </span>
                          <span className="font-medium">
                            {collection.records?.length || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={onViewModalClose}>
                Close
              </Button>
              <Button
                onClick={() => onEditFromView(selectedDepartment)}
                className="bg-primary hover:bg-primary/90"
              >
                Edit Department
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        title={`Edit Department: ${selectedDepartment?.name}`}
        size="lg"
      >
        {selectedDepartment && (
          <form onSubmit={onEditSubmit} className="space-y-4">
            <Input
              label="Department Name"
              value={editForm.name}
              onChange={(e) =>
                onEditFormChange({
                  ...editForm,
                  name: e.target.value,
                })
              }
              required
            />
            <div>
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                className="mt-2 flex min-h-[80px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={editForm.description}
                onChange={(e) =>
                  onEditFormChange({
                    ...editForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onEditModalClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !editForm.name.trim()}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};
