// components/collections/CollectionDetailModal.tsx
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Collection } from "../../../types";

interface CollectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
}

export default function CollectionDetailModal({
  isOpen,
  onClose,
  collection,
}: CollectionDetailModalProps) {
  if (!collection) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Collection Details - ${collection.title}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Collection Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Title:</span> {collection.title}
              </p>
              <p>
                <span className="font-medium">ID:</span> {collection.id}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(collection.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(collection.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Departments</h3>
            <div className="space-y-2">
              {collection.departments.map((dept) => (
                <div key={dept.id} className="flex items-center space-x-2">
                  <Badge variant="default" size="xs" className="bg-muted">
                    {dept.name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Description</h3>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            {collection.description || "No description provided"}
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline">Edit Collection</Button>
          <Button>View Records</Button>
        </div>
      </div>
    </Modal>
  );
}
