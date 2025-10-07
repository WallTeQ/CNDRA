// components/users/UserDetailModal.tsx
import React from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { User } from "../../../types";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  if (!user) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "destructive";
      case "admin":
        return "warning";
      case "staff":
        return "secondary";
      case "public":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`User Details - ${user.name}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              User Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Department:</span>{" "}
                {user.department}
              </p>
              <p>
                <span className="font-medium">Created:</span> {user.createdDate}
              </p>
              <p>
                <span className="font-medium">Last Login:</span>{" "}
                {user.lastLogin || "Never"}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Access Control
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Role:</span>
                <Badge
                  variant={getRoleVariant(user.role)}
                  className="capitalize"
                >
                  {user.role.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  variant={getStatusVariant(user.status)}
                  className="capitalize"
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {user.permissions.map((permission) => (
              <Badge key={permission} variant="outline" className="capitalize">
                {permission.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline">Edit User</Button>
          <Button variant="destructive">Reset Password</Button>
        </div>
      </div>
    </Modal>
  );
};
