import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Dropdown } from "../../components/ui/Dropdown";
import {
  fetchCollections,
  addCollection,
  updateCollection,
  deleteCollection,
} from "../../store/slices/collections/collectionThunk";
import { fetchDepartments } from "../../store/slices/depatments/departmentThunk";
import { clearError } from "../../store/slices/collections/collectionSlice";
import { type RootState, type AppDispatch, useAppSelector, useAppDispatch } from "../../store";
import { Plus, FolderOpen, Building2, CheckCircle, FileText, Search, RefreshCw, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2 } from "lucide-react";

interface Collection {
  id: string;
  title: string; // Changed from 'name' to 'title'
  description?: string;
  departments: Array<{
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  records?: any[]; // Make records optional but handle properly
  createdAt: string;
  updatedAt: string;
}

export default function CollectionsPage() {
  const dispatch = useAppDispatch();
  const { collections, loading, error } = useAppSelector(
    (state) => state.collections
  );
  const { departments } = useAppSelector((state) => state.departments);

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accessLevelFilter, setAccessLevelFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const [newCollection, setNewCollection] = useState({
    title: "",
    description: "",
    departmentIds: [] as string[],
  });

  useEffect(() => {
    dispatch(fetchCollections());
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (collection.description &&
        collection.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesDepartment =
      departmentFilter === "all" ||
      collection.departments.some((dept) => dept.name === departmentFilter);

    return matchesSearch && matchesDepartment;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollections = filteredCollections.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  const getRecordCount = (collection: Collection): number => {
    return collection.records?.length || 0;
  };

  const openCollectionDetail = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsDetailModalOpen(true);
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollection.title && newCollection.departmentIds.length > 0) {
      await dispatch(addCollection(newCollection));
      setNewCollection({ title: "", description: "", departmentIds: [] });
      setIsNewCollectionModalOpen(false);
    }
  };

  const handleDepartmentSelection = (
    departmentId: string,
    checked: boolean
  ) => {
    setNewCollection((prev) => ({
      ...prev,
      departmentIds: checked
        ? [...prev.departmentIds, departmentId]
        : prev.departmentIds.filter((id) => id !== departmentId),
    }));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-destructive">Error Loading Collections</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Collections
            </h1>
            <p className="text-muted-foreground text-lg">
              Organize and manage record collections by category
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={() => setIsNewCollectionModalOpen(true)} 
              size="md" 
              icon={<Plus className="w-4 h-4" />}
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              New Collection
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Collections
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {collections.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Departments
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {departments.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Collections
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {collections.length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <select
                className="flex h-10 w-full lg:w-48 rounded-lg border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch(fetchCollections());
                  }}
                  className="whitespace-nowrap"
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Refresh
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="whitespace-nowrap"
                  icon={<Filter className="w-4 h-4" />}
                >
                  Advanced Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collections Table */}
        {loading ? (
          <Card className="py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center">
                <RefreshCw className="animate-spin w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Loading Collections</h3>
                <p className="text-muted-foreground">Please wait while we fetch your collections...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredCollections.length === 0 ? (
          <Card className="py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm || departmentFilter !== 'all' ? 'No Collections Found' : 'No Collections Yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchTerm || departmentFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                    : 'Get started by creating your first collection to organize your records.'
                  }
                </p>
                {(!searchTerm && departmentFilter === 'all') && (
                  <Button onClick={() => setIsNewCollectionModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                    Create Your First Collection
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Collection
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Departments
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
                    {paginatedCollections.map((collection) => (
                      <tr key={collection.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                              <FolderOpen className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {collection.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {collection.departments.slice(0, 2).map((dept) => (
                              <Badge
                                key={dept.id}
                                variant="default"
                                size="xs"
                                className="bg-blue-100 text-blue-800"
                              >
                                {dept.name}
                              </Badge>
                            ))}
                            {collection.departments.length > 2 && (
                              <Badge variant="default" size="xs" className="bg-muted text-muted-foreground">
                                +{collection.departments.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {getRecordCount(collection)}
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
                                label: "View Details",
                                icon: <FileText className="w-4 h-4" />,
                                onClick: () => openCollectionDetail(collection)
                              },
                              {
                                label: "Edit",
                                icon: <Edit className="w-4 h-4" />,
                                onClick: () => {
                                  // Handle edit - you can implement this
                                }
                              },
                              {
                                label: "Delete",
                                icon: <Trash2 className="w-4 h-4" />,
                                variant: "destructive",
                                onClick: () => {
                                  if (window.confirm("Are you sure you want to delete this collection?")) {
                                    // Handle delete - you can implement this
                                  }
                                }
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
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCollections.length)} of {filteredCollections.length} collections
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

        {/* Collection Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Collection Details - ${selectedCollection?.title}`}
          size="lg"
        >
          {selectedCollection && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Collection Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Title:</span>{" "}
                      {selectedCollection.title}
                    </p>
                    <p>
                      <span className="font-medium">ID:</span>{" "}
                      {selectedCollection.id}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(
                        selectedCollection.createdAt
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(
                        selectedCollection.updatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Departments
                  </h3>
                  <div className="space-y-2">
                    {selectedCollection.departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="flex items-center space-x-2"
                      >
                        <Badge variant="default" size="xs" className="bg-muted">{dept.name}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Description
                </h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {selectedCollection.description || "No description provided"}
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <Button variant="outline">Edit Collection</Button>
                <Button>View Records</Button>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isNewCollectionModalOpen}
          onClose={() => setIsNewCollectionModalOpen(false)}
          title="Create New Collection"
          size="lg"
        >
          <form onSubmit={handleCreateCollection} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Collection Title"
                placeholder="Enter collection title"
                value={newCollection.title}
                onChange={(e) =>
                  setNewCollection((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Describe the collection and its contents"
                value={newCollection.description}
                onChange={(e) =>
                  setNewCollection((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Departments
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                {departments.map((dept) => (
                  <label
                    key={dept.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newCollection.departmentIds.includes(dept.id)}
                      onChange={(e) =>
                        handleDepartmentSelection(dept.id, e.target.checked)
                      }
                      className="rounded border-border"
                    />
                    <span className="text-sm">{dept.name}</span>
                  </label>
                ))}
              </div>
              {newCollection.departmentIds.length === 0 && (
                <p className="text-xs text-destructive mt-1">
                  Please select at least one department
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewCollection({
                    title: "",
                    description: "",
                    departmentIds: [],
                  });
                  setIsNewCollectionModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !newCollection.title ||
                  newCollection.departmentIds.length === 0
                }
              >
                {loading ? "Creating..." : "Create Collection"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

