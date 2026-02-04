import { useState, useEffect } from "react";
import { Collection, NewCollectionForm } from "../../../types";
import {
  useCollections as useCollectionsQuery,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "../../../hooks/useCollection";
import { Department } from "../../../types/departments";
import { useAllDepartments } from "../../../hooks/useDepartments";

export const useCollections = () => {
  // State declarations FIRST
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newCollection, setNewCollection] = useState<NewCollectionForm>({
    title: "",
    description: "",
    departmentIds: [],
  });

  const [editCollection, setEditCollection] = useState<NewCollectionForm>({
    title: "",
    description: "",
    departmentIds: [],
  });

  const itemsPerPage = 10;

  // React Query hooks - NOW they can use the state variables
  const { data: departments = [], isLoading: departmentsLoading } =
    useAllDepartments();

  const {
    data: collectionsData,
    isLoading: collectionsLoading,
    error: queryError,
    refetch,
  } = useCollectionsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    department: departmentFilter === "all" ? undefined : departmentFilter,
  });

  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const deleteMutation = useDeleteCollection();

  // Extract data from API response
  const collections = collectionsData?.items || [];
  const totalPages = collectionsData?.totalPages || 0;
  const totalItems = collectionsData?.total || 0;

  // Combined loading state
  const loading =
    collectionsLoading ||
    departmentsLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // Handle errors from mutations
  useEffect(() => {
    if (createMutation.error) {
      setErrorMessage("Failed to create collection");
    } else if (updateMutation.error) {
      setErrorMessage("Failed to update collection");
    } else if (deleteMutation.error) {
      setErrorMessage("Failed to delete collection");
    } else if (queryError) {
      setErrorMessage("Failed to load collections");
    }
  }, [
    createMutation.error,
    updateMutation.error,
    deleteMutation.error,
    queryError,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, departmentFilter]);

  // REMOVE client-side filtering - server handles it
  // Just validate the records are valid
  const paginatedCollections = collections.filter((collection) => {
    return collection && collection.id && collection.title;
  });

  // Event handlers
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollection.title && newCollection.departmentIds.length > 0) {
      try {
        await createMutation.mutateAsync(newCollection);
        setNewCollection({ title: "", description: "", departmentIds: [] });
        setIsNewCollectionModalOpen(false);
        setErrorMessage(null);
      } catch (error) {
        console.error("Failed to create collection:", error);
      }
    }
  };

  const handleViewDetails = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (collection: Collection) => {
    setSelectedCollection(collection);
    setEditCollection({
      title: collection.title,
      description: collection.description || "",
      departmentIds: collection.departments.map((dept) => dept.id),
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedCollection ||
      !editCollection.title ||
      editCollection.departmentIds.length === 0
    )
      return;

    try {
      await updateMutation.mutateAsync({
        id: selectedCollection.id,
        data: editCollection,
      });
      setSelectedCollection(null);
      setEditCollection({ title: "", description: "", departmentIds: [] });
      setIsEditModalOpen(false);
      setErrorMessage(null);
    } catch (error) {
      console.error("Failed to update collection:", error);
    }
  };

  const handleDelete = async (collection: Collection) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      try {
        await deleteMutation.mutateAsync(collection.id);
        setErrorMessage(null);
      } catch (error) {
        console.error("Failed to delete collection:", error);
      }
    }
  };

  const handleEditFromDetail = (collection: Collection) => {
    setIsDetailModalOpen(false);
    handleEdit(collection);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  const hasFilters = searchTerm !== "" || departmentFilter !== "all";

  return {
    // Data
    collections: paginatedCollections,
    allCollections: collections,
    departments,
    loading,
    error: errorMessage,

    // Modal states
    selectedCollection,
    isDetailModalOpen,
    isNewCollectionModalOpen,
    isEditModalOpen,

    // Form states
    newCollection,
    editCollection,

    // Filter states
    searchTerm,
    departmentFilter,
    currentPage,
    totalPages, // From API
    itemsPerPage,
    totalItems, // From API
    hasFilters,

    // Actions
    setSearchTerm,
    setDepartmentFilter,
    setCurrentPage,
    setNewCollection,
    setEditCollection,
    setIsDetailModalOpen,
    setIsNewCollectionModalOpen,
    setIsEditModalOpen,
    setSelectedCollection,
    handleCreateCollection,
    handleViewDetails,
    handleEdit,
    handleEditSubmit,
    handleDelete,
    handleEditFromDetail,
    clearError,
  };
};
