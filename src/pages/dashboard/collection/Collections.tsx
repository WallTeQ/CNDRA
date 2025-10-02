import { useState, useEffect } from "react";
import { Building2, CheckCircle, FolderOpen, Plus } from "lucide-react";

// Redux imports
import { useAppSelector, useAppDispatch } from "../../../store";
import {
  fetchCollections,
  addCollection,
  updateCollection,
  deleteCollection,
} from "../../../store/slices/collections/collectionThunk";
import { fetchDepartments } from "../../../store/slices/depatments/departmentThunk";
import { clearError } from "../../../store/slices/collections/collectionSlice";

// Component imports
import { Button } from "../../../components/ui/Button";
import { StatCard } from "../components/StatsCard";
import CollectionFilters from "./CollectionFilters";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import CollectionsTable from "./CollectionTable";
import CollectionDetailModal from "./CollectionDetailModal";
import CreateCollectionModal from "./CreateCollectionModal";

// Types
import { Collection, NewCollectionForm } from "../../../types";

export default function CollectionsPage() {
  const dispatch = useAppDispatch();
  const { collections, loading, error } = useAppSelector(
    (state) => state.collections
  );
  const { departments } = useAppSelector((state) => state.departments);

  // State
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [newCollection, setNewCollection] = useState<NewCollectionForm>({
    title: "",
    description: "",
    departmentIds: [],
  });

  const itemsPerPage = 10;

  // Effects
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter]);

  // Filter and pagination logic
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

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCollections = filteredCollections.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Event handlers
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollection.title && newCollection.departmentIds.length > 0) {
      await dispatch(addCollection(newCollection));
      setNewCollection({ title: "", description: "", departmentIds: [] });
      setIsNewCollectionModalOpen(false);
    }
  };

  const handleViewDetails = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (collection: Collection) => {
    // Implement edit functionality
    console.log("Edit collection:", collection);
  };

  const handleDelete = (collection: Collection) => {
    // Implement delete functionality
    console.log("Delete collection:", collection);
  };

  const handleRefresh = () => {
    dispatch(fetchCollections());
  };

  const hasFilters = searchTerm !== "" || departmentFilter !== "all";

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Error Display */}
        {error && (
          <ErrorDisplay error={error} onClose={() => dispatch(clearError())} />
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            name="Total Collections"
            value={collections.length.toString()}
            icon={FolderOpen}
            color="blue"
          />

          <StatCard
            name="Departments"
            value={departments.length.toString()}
            icon={Building2}
            color="green"
          />

          <StatCard
            name="Active Collections"
            value={collections.length.toString()}
            icon={CheckCircle}
            color="purple"
          />
        </div>

        {/* Filters */}
        <CollectionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          departments={departments}
          onRefresh={handleRefresh}
        />

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : filteredCollections.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            title="collection"
            description="Create Your First Collection"
            onCreateCollection={() => setIsNewCollectionModalOpen(true)}
          />
        ) : (
          <CollectionsTable
            collections={paginatedCollections}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCollections.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Modals */}
        <CollectionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          collection={selectedCollection}
        />

        <CreateCollectionModal
          isOpen={isNewCollectionModalOpen}
          onClose={() => setIsNewCollectionModalOpen(false)}
          newCollection={newCollection}
          setNewCollection={setNewCollection}
          departments={departments}
          onSubmit={handleCreateCollection}
          loading={loading}
        />
      </div>
    </div>
  );
}
