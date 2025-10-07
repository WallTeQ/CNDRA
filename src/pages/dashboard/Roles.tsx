import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdDate: string;
  isSystem: boolean;
}

const mockRoles: Role[] = [
  {
    id: "role-1",
    name: "Super Administrator",
    description: "Full system access with all permissions",
    permissions: ["all"],
    userCount: 2,
    createdDate: "2024-01-01",
    isSystem: true,
  },
  {
    id: "role-2",
    name: "Administrator",
    description: "Administrative access with user and content management",
    permissions: ["user_management", "content_management", "system_settings"],
    userCount: 5,
    createdDate: "2024-01-01",
    isSystem: true,
  },
  {
    id: "role-3",
    name: "Records Manager",
    description: "Manage records, collections, and retention policies",
    permissions: [
      "records_management",
      "retention_management",
      "collection_management",
    ],
    userCount: 8,
    createdDate: "2024-01-01",
    isSystem: false,
  },
  {
    id: "role-4",
    name: "Staff User",
    description: "Basic staff access to internal systems",
    permissions: ["records_view", "dashboard_access", "profile_management"],
    userCount: 25,
    createdDate: "2024-01-01",
    isSystem: true,
  },
];

const availablePermissions = [
  { id: "all", name: "All Permissions", category: "System" },
  {
    id: "user_management",
    name: "User Management",
    category: "Administration",
  },
  {
    id: "content_management",
    name: "Content Management",
    category: "Administration",
  },
  {
    id: "system_settings",
    name: "System Settings",
    category: "Administration",
  },
  { id: "records_management", name: "Records Management", category: "Records" },
  {
    id: "retention_management",
    name: "Retention Management",
    category: "Records",
  },
  {
    id: "collection_management",
    name: "Collection Management",
    category: "Records",
  },
  { id: "records_view", name: "View Records", category: "Records" },
  { id: "dashboard_access", name: "Dashboard Access", category: "General" },
  { id: "profile_management", name: "Profile Management", category: "General" },
  { id: "audit_logs", name: "View Audit Logs", category: "Security" },
  {
    id: "access_requests",
    name: "Manage Access Requests",
    category: "Requests",
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: typeof availablePermissions } = {};
    availablePermissions.forEach((permission) => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Role Management
            </h1>
            <p className="text-muted-foreground">
              Manage user roles and permissions
            </p>
          </div>
          <Button onClick={() => setIsNewRoleModalOpen(true)}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Role
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Roles ({filteredRoles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {role.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{role.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.userCount} users</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 2).map((permission) => (
                          <Badge
                            key={permission}
                            variant="secondary"
                            className="text-xs"
                          >
                            {permission === "all"
                              ? "All"
                              : permission.replace("_", " ")}
                          </Badge>
                        ))}
                        {role.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.isSystem ? "outline" : "secondary"}>
                        {role.isSystem ? "System" : "Custom"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                        >
                          Edit
                        </Button>
                        {!role.isSystem && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* New Role Modal */}
        <Modal
          isOpen={isNewRoleModalOpen}
          onClose={() => setIsNewRoleModalOpen(false)}
          title="Create New Role"
          size="lg"
        >
          <form className="space-y-6">
            <Input label="Role Name" placeholder="Enter role name" required />
            <div>
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                className="mt-2 flex min-h-[80px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Enter role description"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-4 block">
                Permissions
              </label>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {Object.entries(getPermissionsByCategory()).map(
                  ([category, permissions]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm text-foreground mb-2">
                        {category}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 ml-4">
                        {permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-border text-primary focus:ring-primary"
                            />
                            <span className="text-sm">{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsNewRoleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Role</Button>
            </div>
          </form>
        </Modal>

        {/* Edit Role Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Role: ${selectedRole?.name}`}
          size="lg"
        >
          {selectedRole && (
            <form className="space-y-6">
              <Input label="Role Name" value={selectedRole.name} />
              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  className="mt-2 flex min-h-[80px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedRole.description}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-4 block">
                  Permissions
                </label>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {Object.entries(getPermissionsByCategory()).map(
                    ([category, permissions]) => (
                      <div key={category}>
                        <h4 className="font-medium text-sm text-foreground mb-2">
                          {category}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 ml-4">
                          {permissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                className="rounded border-border text-primary focus:ring-primary"
                                defaultChecked={selectedRole.permissions.includes(
                                  permission.id
                                )}
                              />
                              <span className="text-sm">{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
  );
}
