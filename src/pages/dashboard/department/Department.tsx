
import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { DepartmentTable } from "./DepartmentTable";
import { DepartmentModals } from "./DepartmentModal";
import { DepartmentStats } from "./DepartmentsStat";
import EmptyState from "../components/EmptyState";
import { useDepartments } from "./hooks";

export default function DepartmentsPage() {
  const {
    departments,
    allDepartments,
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    isNewDepartmentModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    selectedDepartment,
    newDepartmentForm,
    editDepartmentForm,
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
    // resetModalsAndForms,
    setNewDepartmentForm,
    setEditDepartmentForm,
  } = useDepartments();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[id^="dropdown-"]') && !target.closest("button")) {
        document.querySelectorAll('[id^="dropdown-"]').forEach((dropdown) => {
          dropdown.classList.add("hidden");
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const filteredDepartments = searchTerm
   ? allDepartments?.filter(
       (dept) =>
         dept?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (dept?.description &&
           dept?.description?.toLowerCase().includes(searchTerm.toLowerCase())),
     )
   : allDepartments;

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
        <div className="flex items-center justify-between mb-6">
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
        <div className="mb-6">
          <DepartmentStats departments={allDepartments} />
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        {/* Departments Table or Empty State */}
        {!loading && filteredDepartments.length === 0 ? (
          <EmptyState
            hasFilters={!!searchTerm}
            title="department"
            description="Create Your First Department"
            onCreateCollection={() => setIsNewDepartmentModalOpen(true)}
          />
        ) : (
          <DepartmentTable
            departments={departments}
            loading={loading}
            onView={handleViewDepartment}
            onEdit={handleEditDepartment}
            onDelete={handleDeleteDepartment}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        )}

        {/* Modals */}
        <DepartmentModals
          isNewModalOpen={isNewDepartmentModalOpen}
          onNewModalClose={() => {
            setIsNewDepartmentModalOpen(false);
            setNewDepartmentForm({ name: "", description: "" });
          }}
          newForm={newDepartmentForm}
          onNewFormChange={setNewDepartmentForm}
          onNewSubmit={handleNewDepartmentSubmit}
          isEditModalOpen={isEditModalOpen}
          onEditModalClose={() => {
            setIsEditModalOpen(false);
            setSelectedDepartment(null);
            setEditDepartmentForm({ name: "", description: "" });
          }}
          editForm={editDepartmentForm}
          onEditFormChange={setEditDepartmentForm}
          onEditSubmit={handleEditDepartmentSubmit}
          isViewModalOpen={isViewModalOpen}
          onViewModalClose={() => {
            setIsViewModalOpen(false);
            setSelectedDepartment(null);
          }}
          selectedDepartment={selectedDepartment}
          onEditFromView={handleEditFromView}
          loading={loading}
        />
      </div>
    </div>
  );
}