import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
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
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../store/slices/depatments/departmentThunk";
import { clearError } from "../../store/slices/depatments/departmentSlice";
import { type RootState, type AppDispatch, useAppSelector } from "../../store";

interface Collection {
  id: string;
  title: string;
  description: string;
  records: any[];
  createdAt: string;
  updatedAt: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
  collections?: Collection[];
  createdAt: string;
  updatedAt: string;
}

interface DepartmentFormData {
  name: string;
  description: string;
}

export default function DepartmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading, error } = useAppSelector(
    (state: RootState) => state.departments
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isNewDepartmentModalOpen, setIsNewDepartmentModalOpen] =
    useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDepartmentForm, setNewDepartmentForm] =
    useState<DepartmentFormData>({
      name: "",
      description: "",
    });
  const [editDepartmentForm, setEditDepartmentForm] =
    useState<DepartmentFormData>({
      name: "",
      description: "",
    });

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Department error:", error);
      // You can show a toast notification here
    }
  }, [error]);

  const filteredDepartments = departments?.filter(
    (dept) =>
      dept?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept?.description &&
        dept?.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartmentForm?.name?.trim()) return;

    try {
      await dispatch(
        addDepartment({
          name: newDepartmentForm.name.trim(),
          description: newDepartmentForm.description.trim() || undefined,
        })
      ).unwrap();

      setNewDepartmentForm({ name: "", description: "" });
      setIsNewDepartmentModalOpen(false);
    } catch (error) {
      console.error("Failed to create department:", error);
    }
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setEditDepartmentForm({
      name: department.name,
      description: department.description || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartment || !editDepartmentForm.name.trim()) return;

    try {
      await dispatch(
        updateDepartment({
          id: selectedDepartment.id,
          updates: {
            name: editDepartmentForm.name.trim(),
            description: editDepartmentForm.description.trim() || undefined,
          },
        })
      ).unwrap();

      setSelectedDepartment(null);
      setEditDepartmentForm({ name: "", description: "" });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await dispatch(deleteDepartment(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete department:", error);
      }
    }
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  const getRecordCount = (department: Department): number => {
    return (
      department.collections?.reduce(
        (sum, collection) => sum + (collection.records?.length || 0),
        0
      ) || 0
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-destructive">{error}</p>
              <Button variant="ghost" size="sm" onClick={clearErrorMessage}>
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Department Management
            </h1>
            <p className="text-muted-foreground">
              Manage organizational departments and access
            </p>
          </div>
          <Button
            onClick={() => setIsNewDepartmentModalOpen(true)}
            disabled={loading}
          >
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
            {loading ? "Loading..." : "New Department"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M7 7h10M7 11h10M7 15h10"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Departments
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-success/10 rounded-lg">
                  <svg
                    className="w-6 h-6 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <svg
                    className="w-6 h-6 text-warning"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M7 7h10M7 11h10M7 15h10"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Collections
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.reduce(
                      (sum, d) => sum + (d.collections?.length || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-info/10 rounded-lg">
                  <svg
                    className="w-6 h-6 text-info"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Records
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.reduce((sum, d) => sum + getRecordCount(d), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Departments Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Departments ({filteredDepartments.length})
              {loading && (
                <span className="text-muted-foreground ml-2">(Loading...)</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{department.name}</p>
                        {department.description && (
                          <p className="text-sm text-muted-foreground">
                            {department.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {department.collections?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRecordCount(department)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {new Date(department.createdAt).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDepartment(department)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDepartment(department.id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDepartments.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No departments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* New Department Modal */}
        <Modal
          isOpen={isNewDepartmentModalOpen}
          onClose={() => {
            setIsNewDepartmentModalOpen(false);
            setNewDepartmentForm({ name: "", description: "" });
          }}
          title="Create New Department"
          size="lg"
        >
          <form onSubmit={handleNewDepartmentSubmit} className="space-y-4">
            <Input
              label="Department Name"
              placeholder="Enter department name"
              value={newDepartmentForm.name}
              onChange={(e) =>
                setNewDepartmentForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
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
                value={newDepartmentForm.description}
                onChange={(e) =>
                  setNewDepartmentForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsNewDepartmentModalOpen(false);
                  setNewDepartmentForm({ name: "", description: "" });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !newDepartmentForm.name.trim()}
              >
                {loading ? "Creating..." : "Create Department"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Department Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDepartment(null);
            setEditDepartmentForm({ name: "", description: "" });
          }}
          title={`Edit Department: ${selectedDepartment?.name}`}
          size="lg"
        >
          {selectedDepartment && (
            <form onSubmit={handleEditDepartmentSubmit} className="space-y-4">
              <Input
                label="Department Name"
                value={editDepartmentForm.name}
                onChange={(e) =>
                  setEditDepartmentForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
              />
              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  className="mt-2 flex min-h-[80px] w-full rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={editDepartmentForm.description}
                  onChange={(e) =>
                    setEditDepartmentForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedDepartment(null);
                    setEditDepartmentForm({ name: "", description: "" });
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !editDepartmentForm.name.trim()}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}
