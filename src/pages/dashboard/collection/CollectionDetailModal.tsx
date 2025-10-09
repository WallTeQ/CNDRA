import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Collection } from "../../../types";

interface CollectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection | null;
  onEdit?: (collection: Collection) => void;
}

export default function CollectionDetailModal({
  isOpen,
  onClose,
  collection,
  onEdit,
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
            <div className="flex flex-wrap gap-2">
              {collection.departments.map((dept) => (
                <Badge
                  key={dept.id}
                  variant="default"
                  size="sm"
                  className="bg-red-100 text-red-800"
                >
                  {dept.name}
                </Badge>
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

        {collection.records && collection.records.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">Records</h3>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Total Records:</span>{" "}
                {collection.records.length}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button onClick={() => onEdit(collection)}>Edit Collection</Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
