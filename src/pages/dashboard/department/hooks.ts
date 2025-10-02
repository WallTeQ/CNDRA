// hooks/useDepartments.ts
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../store/slices/depatments/departmentThunk";
import { clearError } from "../../../store/slices/depatments/departmentSlice";
import { type RootState, type AppDispatch, useAppSelector } from "../../../store";
import { Department, DepartmentFormData } from "../../../types/departments";

export const useDepartments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading, error } = useAppSelector(
    (state: RootState) => state.departments
  );

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

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.error("Department error:", error);
    }
  }, [error]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredDepartments = departments?.filter(
    (dept) =>
      dept?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept?.description &&
        dept?.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(
    startIndex,
    startIndex + itemsPerPage
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
    // State
    departments: paginatedDepartments,
    allDepartments: departments,
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems: filteredDepartments.length,

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
