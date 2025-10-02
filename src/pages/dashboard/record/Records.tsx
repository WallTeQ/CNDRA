
import { useEffect, useState } from "react";
import { Plus, FileText, Building2, CheckCircle } from "lucide-react";

// Redux imports
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchRecords, deleteRecord } from "../../../store/slices/records/recordsThunk";
import { fetchDepartments } from "../../../store/slices/depatments/departmentThunk";
import { clearError } from "../../../store/slices/auth/authSlice";

// Component imports
import { Button } from "../../../components/ui/Button";
import { StatsGrid } from "../overview/StatGrid";
import ErrorDisplay from "../components/ErrorDisplay";
import { RecordsFilters } from "./RecordsFilters";
import { RecordsTable } from "./RecordsTable";
import EmptyState from "../components/EmptyState";
import UploadDocumentPage from "../UploadDocument";
import { RecordPreviewModal } from "./RecordPreviewModal";

// Types
import { Record } from "../../../types/record";
import { RecordsLoadingState } from "./RecordsLoadingState";

export default function RecordsPage() {
  const dispatch = useAppDispatch();
  const { records, isLoading, error } = useAppSelector((state) => state.records);
  const { departments } = useAppSelector((state) => state.departments);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [shouldRefetchRecords, setShouldRefetchRecords] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecordForEdit, setSelectedRecordForEdit] = useState<Record | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Effects
  useEffect(() => {
    if (shouldRefetchRecords) {
      dispatch(fetchRecords());
      setShouldRefetchRecords(false);
    }
  }, [shouldRefetchRecords, dispatch]);

  useEffect(() => {
    dispatch(fetchRecords());
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
  }, [searchTerm, selectedDepartment, selectedAccessLevel]);

  // Calculate statistics for StatCards
  const activeRecords = records.filter(record => record.accessLevel !== 'CONFIDENTIAL').length;
  const totalFileAssets = records.reduce((sum, record) => sum + (record.fileAssets?.length || 0), 0);

  // Stats configuration for reusable StatCard components
  const recordStats = [
    {
      name: 'Total Records',
      value: records.length.toString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'blue' as const
    },
    {
      name: 'Departments',
      value: departments.length.toString(),
      change: '+3%',
      changeType: 'increase' as const,
      icon: Building2,
      color: 'green' as const
    },
    {
      name: 'Active Records',
      value: activeRecords.toString(),
      change: '+8%',
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'purple' as const
    },
    {
      name: 'File Assets',
      value: totalFileAssets.toString(),
      change: '+15%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'yellow' as const
    }
  ];

  // Filter and pagination logic
  const filteredRecords = (records || [])
    .filter((record) => {
      if (!record || typeof record !== 'object') return false;
      if (!record.id) return false;

      const matchesSearch =
        (record.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (record.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        record.subjectTags?.some((tag) =>
          tag?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || false;

      const matchesDepartment =
        !selectedDepartment ||
        (record.collection &&
          departments.find(
            (dept) =>
              dept.collections?.some((col) => col.id === record.collection?.id) &&
              dept.id === selectedDepartment
          ));

      const matchesAccessLevel =
        !selectedAccessLevel || record.accessLevel === selectedAccessLevel;

      return matchesSearch && matchesDepartment && matchesAccessLevel;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Event handlers
  const handleDeleteRecord = async (id: string) => {
    try {
      await dispatch(deleteRecord(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const handleViewRecord = (record: Record) => {
    setSelectedRecord(record);
    setIsPreviewOpen(true);
  };

  const handleEditRecord = (record: Record) => {
    setSelectedRecordForEdit(record);
    setIsEditMode(true);
  };

  const handleRefresh = () => {
    dispatch(fetchRecords());
  };

  const hasFilters = searchTerm !== "" || selectedDepartment !== "" || selectedAccessLevel !== "";

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Records Management
            </h1>
            <p className="text-muted-foreground">
              Manage and organize institutional records
            </p>
          </div>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            New Record
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <ErrorDisplay error={error} onClose={() => dispatch(clearError())} />
        )}

        {/* Stats Cards - Using Reusable StatsGrid Component */}
        <StatsGrid stats={recordStats} />

        {/* Filters */}
        <RecordsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedAccessLevel={selectedAccessLevel}
          setSelectedAccessLevel={setSelectedAccessLevel}
          departments={departments}
          onRefresh={handleRefresh}
        />

        {/* Content */}
        {isLoading ? (
          <RecordsLoadingState />
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            title="record"
            description="Create Your First Record"
            onCreateCollection={() => setIsUploadModalOpen(true)}
          />
        ) : (
          <RecordsTable
            records={paginatedRecords}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRecords.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onViewRecord={handleViewRecord}
            onEditRecord={handleEditRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {/* Modals */}
        <RecordPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          record={selectedRecord}
          onEditRecord={handleEditRecord}
        />

        <UploadDocumentPage
          isOpen={isUploadModalOpen || isEditMode}
          onClose={() => {
            setIsUploadModalOpen(false);
            setIsEditMode(false);
            setSelectedRecordForEdit(null);
            setShouldRefetchRecords(true);
          }}
          onSuccess={() => {}}
          isEdit={isEditMode}
          record={selectedRecordForEdit}
        />
      </div>
    </div>
  );
}