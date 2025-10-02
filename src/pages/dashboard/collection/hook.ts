
import { useState, useEffect } from "react";
import { Collection, NewCollectionForm } from "../../../types";
import {
  useCollections as useCollectionsQuery,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "../../../hooks/useCollection";
import { Department } from "../../../types/departments";
import { useDepartments as useDepartmentsQuery } from "../../../hooks/useDepartments";

export const useCollections = () => {
  // React Query hooks
  const {
    data: collections = [],
    isLoading: collectionsLoading,
    error: collectionsError,
  } = useCollectionsQuery();
  const { data: departments = [], isLoading: departmentsLoading } =
    useDepartmentsQuery();
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const deleteMutation = useDeleteCollection();

  // State
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
    } else if (collectionsError) {
      setErrorMessage("Failed to load collections");
    }
  }, [
    createMutation.error,
    updateMutation.error,
    deleteMutation.error,
    collectionsError,
  ]);

  // Reset to first page when filters change
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
      collection.departments.some((dept: Department) => dept.name === departmentFilter);

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
    totalPages,
    itemsPerPage,
    totalItems: filteredCollections.length,
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
