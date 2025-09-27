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
import { Modal } from "../../components/ui/Modal";
import { Dropdown } from "../../components/ui/Dropdown";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../store/slices/depatments/departmentThunk";
import { clearError } from "../../store/slices/depatments/departmentSlice";
import { type RootState, type AppDispatch, useAppSelector } from "../../store";
import { Plus, Building2, ChevronLeft, ChevronRight, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Pagination logic
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[id^="dropdown-"]') && !target.closest('button')) {
        document.querySelectorAll('[id^="dropdown-"]').forEach(dropdown => {
          dropdown.classList.add('hidden');
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleViewDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
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
            icon={<Plus className="w-4 h-4" />}
          >
            {loading ? "Loading..." : "New Department"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* <Card>
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
          </Card> */}

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
        {loading ? (
          <Card className="py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="animate-spin w-8 h-8 text-primary mb-4"></div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Loading Departments</h3>
                <p className="text-muted-foreground">Please wait while we fetch your departments...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredDepartments.length === 0 ? (
          <Card className="py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'No Departments Found' : 'No Departments Yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchTerm
                    ? 'Try adjusting your search criteria to find what you\'re looking for.'
                    : 'Get started by creating your first department to organize your organizational structure.'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsNewDepartmentModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                    Create Your First Department
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Collections
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Records
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {paginatedDepartments.map((department) => (
                      <tr key={department.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {department.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {department.collections?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {getRecordCount(department)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Dropdown
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            }
                            items={[
                              {
                                label: "View",
                                icon: <Eye className="w-4 h-4" />,
                                onClick: () => handleViewDepartment(department)
                              },
                              {
                                label: "Edit",
                                icon: <Edit className="w-4 h-4" />,
                                onClick: () => handleEditDepartment(department)
                              },
                              {
                                label: "Delete",
                                icon: <Trash2 className="w-4 h-4" />,
                                variant: "destructive",
                                onClick: () => handleDeleteDepartment(department.id)
                              }
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-muted/30 px-6 py-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDepartments.length)} of {filteredDepartments.length} departments
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum > totalPages) return null;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "primary" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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

        {/* View Department Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedDepartment(null);
          }}
          title={`Department Details: ${selectedDepartment?.name}`}
          size="lg"
        >
          {selectedDepartment && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Department Name</label>
                      <p className="text-foreground font-medium">{selectedDepartment.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-foreground">{selectedDepartment.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                      <p className="text-foreground">{new Date(selectedDepartment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                      <p className="text-foreground">{new Date(selectedDepartment.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">Collections</span>
                      <span className="text-lg font-bold text-blue-600">{selectedDepartment.collections?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-900">Total Records</span>
                      <span className="text-lg font-bold text-green-600">{getRecordCount(selectedDepartment)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedDepartment.collections && selectedDepartment.collections.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Collections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDepartment.collections.map((collection) => (
                      <div key={collection.id} className="p-4 border border-border rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">{collection.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{collection.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Records:</span>
                          <span className="font-medium">{collection.records?.length || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedDepartment(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditDepartment(selectedDepartment);
                  }}
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
