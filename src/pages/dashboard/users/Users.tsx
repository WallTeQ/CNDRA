import { useState } from "react";
import {
  Users,
  CheckCircle,
  Shield,
  UserX,
  Download,
  Plus,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { StatsGrid } from "../overview/StatGrid";
import { UsersFilters } from "./UsersFilter";
import { UsersTable } from "./UsersTable";
import { UserDetailModal } from "./UserDeatilModal";
import { CreateUserModal } from "./CreateUserModal";
import {
  User,
  NewUserForm,
  UserStatus,
  UserRole,
} from "../../../types/user";
import { useUsers } from "../../../hooks/useUser";
import { useDepartments } from "../../../hooks/useDepartments";





const roles: UserRole[] = ["super_admin", "admin", "staff", "public"];
const permissions = ["read", "write", "delete", "admin", "user_management"];

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [newUser, setNewUser] = useState<NewUserForm>({
    name: "",
    email: "",
    role: "staff",
    department: "",
    permissions: ["read"],
  });
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: departments = [], isLoading: loading } = useDepartments();
  console.log("Fetched Users:", users);

  const itemsPerPage = 10;

  // Calculate statistics
  const activeUsers = users.filter((u) => u.isActive === true).length;
  const administrators = users.filter(
    (u) => u.roles[0].name === "admin" || u.roles[0].name === "super-admin"
  ).length;
  const inactiveUsers = users.filter(
    (u) => u.isActive === false).length;

  // Stats configuration for reusable StatCard components
  const userStats = [
    {
      name: "Total Users",
      value: users.length.toString(),
      change: "+8%",
      changeType: "increase" as const,
      icon: Users,
      color: "red" as const,
    },
    {
      name: "Active Users",
      value: activeUsers.toString(),
      change: "+12%",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      name: "Administrators",
      value: administrators.toString(),
      change: "+2%",
      changeType: "increase" as const,
      icon: Shield,
      color: "purple" as const,
    },
    {
      name: "Inactive Users",
      value: inactiveUsers.toString(),
      change: "-5%",
      changeType: "decrease" as const,
      icon: UserX,
      color: "red" as const,
    },
  ];

  // Filter and pagination logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Event handlers
  const handleStatusUpdate = (userId: string, newStatus: UserStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: (users.length + 1).toString(),
      ...newUser,
      avatar: "/diverse-user-avatars.png",
      createdDate: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setUsers([...users, user]);
    setNewUser({
      displayName: "",
      email: "",
      role: "staff",
      department: "",
      permissions: ["read"],
    });
    setIsNewUserModalOpen(false);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            size="sm"
            variant="outline"
            className="whitespace-nowrap"
            icon={<Download className="w-4 h-4" />}
          >
            Export Users
          </Button>
          <Button
            onClick={() => setIsNewUserModalOpen(true)}
            size="sm"
            className="whitespace-nowrap"
            icon={<Plus className="w-4 h-4" />}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards - Using Reusable StatsGrid Component */}
      <StatsGrid
        stats={userStats}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      />

      {/* Filters */}
      <UsersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Users Table */}
      <UsersTable
        users={paginatedUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onViewUser={handleViewUser}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={selectedUser}
      />

      {/* New User Modal */}
      <CreateUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        newUser={newUser}
        setNewUser={setNewUser}
        onSubmit={handleCreateUser}
        departments={departments}
        roles={roles}
        permissions={permissions}
      />
    </div>
  );
}
