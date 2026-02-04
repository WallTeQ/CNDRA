import { Building2, CheckCircle, FolderOpen, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { StatCard } from "../components/StatsCard";
import CollectionFilters from "./CollectionFilters";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import CollectionsTable from "./CollectionTable";
import CollectionDetailModal from "./CollectionDetailModal";
import CreateCollectionModal from "./CreateCollectionModal";
import EditCollectionModal from "./EditCollectionModal";
import { useCollections } from "./hook";

export default function CollectionsPage() {
  const {
    collections,
    allCollections,
    departments,
    loading,
    error,
    selectedCollection,
    isDetailModalOpen,
    isNewCollectionModalOpen,
    isEditModalOpen,
    newCollection,
    editCollection,
    searchTerm,
    departmentFilter,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    hasFilters,
    setSearchTerm,
    setDepartmentFilter,
    setCurrentPage,
    setNewCollection,
    setEditCollection,
    setIsDetailModalOpen,
    setIsNewCollectionModalOpen,
    setIsEditModalOpen,
    handleCreateCollection,
    handleViewDetails,
    handleEdit,
    handleEditSubmit,
    handleDelete,
    handleEditFromDetail,
    clearError,
  } = useCollections();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Error Display */}
        {error && (
          <ErrorDisplay error={error} onClose={clearError} />
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
              disabled={loading}
            >
              New Collection
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            name="Total Collections"
            value={allCollections.length.toString()}
            icon={FolderOpen}
            color="red"
          />

          <StatCard
            name="Departments"
            value={departments?.length.toString()}
            icon={Building2}
            color="green"
          />

          <StatCard
            name="Active Collections"
            value={allCollections.length.toString()}
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
          onRefresh={() => {
            // React Query will automatically refetch
            window.location.reload();
          }}
        />

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : totalItems === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            title="collection"
            description="Create Your First Collection"
            onCreateCollection={() => setIsNewCollectionModalOpen(true)}
          />
        ) : (
          <CollectionsTable
            collections={collections}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Modals */}
        <CollectionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          collection={selectedCollection}
          onEdit={handleEditFromDetail}
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

        <EditCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditCollection({ title: "", description: "", departmentIds: [] });
          }}
          editCollection={editCollection}
          setEditCollection={setEditCollection}
          departments={departments}
          onSubmit={handleEditSubmit}
          loading={loading}
          collectionTitle={selectedCollection?.title}
        />
      </div>
    </div>
  );
}
