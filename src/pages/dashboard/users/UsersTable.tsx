// components/users/UsersTable.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/Table";
import Pagination from "../../../components/Pagination";
import { User, UserStatus } from "../../../types/user";

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewUser: (user: User) => void;
  onStatusUpdate: (userId: string, newStatus: UserStatus) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewUser,
  onStatusUpdate,
}) => {
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users ({totalItems})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getRoleVariant(user.role)}
                    className="capitalize"
                  >
                    {user.role.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(user.status)}
                    className="capitalize"
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    {user.lastLogin ? (
                      <>
                        <p className="text-sm">
                          {user.lastLogin.split(" ")[0]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.lastLogin.split(" ")[1]}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Never
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{user.createdDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewUser(user)}
                    >
                      View
                    </Button>
                    <select
                      className="text-xs border border-border rounded px-2 py-1"
                      value={user.status}
                      onChange={(e) =>
                        onStatusUpdate(user.id, e.target.value as UserStatus)
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {endIndex} of {totalItems} users
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
