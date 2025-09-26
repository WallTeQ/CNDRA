import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import {
  fetchCollections,
  addCollection,
  updateCollection,
  deleteCollection,
} from "../../store/slices/collections/collectionThunk";
import { fetchDepartments } from "../../store/slices/depatments/departmentThunk";
import { clearError } from "../../store/slices/collections/collectionSlice";
import { type RootState, type AppDispatch, useAppSelector, useAppDispatch } from "../../store";

interface Collection {
  id: string;
  title: string; // Changed from 'name' to 'title'
  description?: string;
  departments: Array<{
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }>;
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
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collections</h1>
            <p className="text-muted-foreground">
              Organize and manage record collections by category
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Collections
            </Button>
            <Button onClick={() => setIsNewCollectionModalOpen(true)}>
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
              New Collection
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
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
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
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
                <div className="w-8 h-8 bg-chart-1/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-chart-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
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
                <div className="w-8 h-8 bg-chart-2/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-chart-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Loading
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? "Yes" : "No"}
                  </p>
                </div>
                <div className="w-8 h-8 bg-chart-3/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-chart-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
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
              <Button
                variant="outline"
                onClick={() => dispatch(fetchCollections())}
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </Button>
              <Button variant="outline">
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">
              Loading collections...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <Card
                key={collection.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {collection.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Departments:
                      </span>
                      <span className="font-medium">
                        {collection.departments.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {collection.departments.slice(0, 2).map((dept) => (
                        <Badge
                          key={dept.id}
                          variant="outline"
                          className="text-xs"
                        >
                          {dept.name}
                        </Badge>
                      ))}
                      {collection.departments.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{collection.departments.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(collection.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCollectionDetail(collection)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                        <Badge variant="outline">{dept.name}</Badge>
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

