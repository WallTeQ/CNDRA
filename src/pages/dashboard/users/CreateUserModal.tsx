// components/users/CreateUserModal.tsx
import React from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { NewUserForm, UserRole } from "../../../types/user";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  newUser: NewUserForm;
  setNewUser: React.Dispatch<React.SetStateAction<NewUserForm>>;
  onSubmit: (e: React.FormEvent) => void;
  departments: string[];
  roles: string[];
  permissions: string[];
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  newUser,
  setNewUser,
  onSubmit,
  departments,
  roles,
  permissions,
}) => {
  const handlePermissionToggle = (permission: string) => {
    const updatedPermissions = newUser.permissions.includes(permission)
      ? newUser.permissions.filter((p) => p !== permission)
      : [...newUser.permissions, permission];
    setNewUser({ ...newUser, permissions: updatedPermissions });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New User" size="lg">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Role
            </label>
            <select
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value as UserRole })
              }
              required
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Department
            </label>
            <select
              className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
              value={newUser.department}
              onChange={(e) =>
                setNewUser({ ...newUser, department: e.target.value })
              }
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Permissions
          </label>
          <div className="grid grid-cols-2 gap-2">
            {permissions.map((permission) => (
              <label key={permission} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newUser.permissions.includes(permission)}
                  onChange={() => handlePermissionToggle(permission)}
                  className="rounded border-border"
                />
                <span className="text-sm capitalize">
                  {permission.replace("_", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create User</Button>
        </div>
      </form>
    </Modal>
  );
};
