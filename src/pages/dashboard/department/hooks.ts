import { useState, useEffect } from "react";
import { Department, DepartmentFormData } from "../../../types/departments";
import {
  useDepartments as useDepartmentsQuery,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from "../../../hooks/useDepartments";

export const useDepartments = () => {
  // State declarations FIRST
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isNewDepartmentModalOpen, setIsNewDepartmentModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  // Form states
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

  // Error message state (for UI display)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // React Query hooks - NOW these can use the state variables declared above
  const {
    data: departmentsData,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useDepartmentsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  // Extract data from API response
  const departments = departmentsData?.items || [];
  const allDepartments = departmentsData?.items || [];
  const totalPages = departmentsData?.totalPages || 0;
  const totalItems = departmentsData?.total || 0;

  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  // Handle errors from mutations
  useEffect(() => {
    if (createMutation.error) {
      setErrorMessage("Failed to create department");
    } else if (updateMutation.error) {
      setErrorMessage("Failed to update department");
    } else if (deleteMutation.error) {
      setErrorMessage("Failed to delete department");
    } else if (queryError) {
      setErrorMessage("Failed to load departments");
    }
  }, [
    createMutation.error,
    updateMutation.error,
    deleteMutation.error,
    queryError,
  ]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // REMOVE client-side filtering and pagination - the API handles this
  // Just use the departments directly from the API
  const paginatedDepartments = departments;

  const handleNewDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartmentForm?.name?.trim()) return;

    try {
      await createMutation.mutateAsync({
        name: newDepartmentForm.name.trim(),
        description: newDepartmentForm.description.trim() || undefined,
      });

      setNewDepartmentForm({ name: "", description: "" });
      setIsNewDepartmentModalOpen(false);
      setErrorMessage(null);
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
      await updateMutation.mutateAsync({
        id: selectedDepartment.id,
        data: {
          name: editDepartmentForm.name.trim(),
          description: editDepartmentForm.description.trim() || undefined,
        },
      });

      setSelectedDepartment(null);
      setEditDepartmentForm({ name: "", description: "" });
      setIsEditModalOpen(false);
      setErrorMessage(null);
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteMutation.mutateAsync(id);
        setErrorMessage(null);
      } catch (error) {
        console.error("Failed to delete department:", error);
      }
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const handleEditFromView = (department: Department) => {
    setIsViewModalOpen(false);
    handleEditDepartment(department);
  };

  const resetModalsAndForms = () => {
    setIsNewDepartmentModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedDepartment(null);
    setNewDepartmentForm({ name: "", description: "" });
    setEditDepartmentForm({ name: "", description: "" });
  };

  return {
    // State - use data from API
    departments: paginatedDepartments,
    allDepartments: allDepartments,
    loading:
      loading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: errorMessage,
    searchTerm,
    currentPage,
    totalPages, // From API
    itemsPerPage,
    totalItems, // From API

    // Modal states
    isNewDepartmentModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    selectedDepartment,

    // Form states
    newDepartmentForm,
    editDepartmentForm,

    // Actions
    setSearchTerm,
    setCurrentPage,
    setIsNewDepartmentModalOpen,
    setIsEditModalOpen,
    setIsViewModalOpen,
    setSelectedDepartment,
    handleNewDepartmentSubmit,
    handleEditDepartment,
    handleViewDepartment,
    handleEditDepartmentSubmit,
    handleDeleteDepartment,
    handleEditFromView,
    clearErrorMessage,
    resetModalsAndForms,
    setNewDepartmentForm,
    setEditDepartmentForm,
  };
};
