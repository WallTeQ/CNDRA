
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchRecords, deleteRecord } from "../../store/slices/records/recordsThunk";
import { fetchDepartments } from "../../store/slices/depatments/departmentThunk";
import { clearError } from "../..//store/slices/records/recordsSlice";

export default function RecordsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { records, isLoading, error } = useAppSelector(
    (state) => state.records
  );
  const { departments } = useAppSelector((state) => state.departments);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState("");

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

  const accessLevels = ["PUBLIC", "RESTRICTED", "CONFIDENTIAL"];

  const filteredRecords = records?.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.subjectTags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDepartment =
      !selectedDepartment ||
      (record.collection &&
        departments.find(
          (dept) =>
            dept.collections?.some((col) => col.id === record.collection.id) &&
            dept.id === selectedDepartment
        ));

    const matchesAccessLevel =
      !selectedAccessLevel || record.accessLevel === selectedAccessLevel;

    return matchesSearch && matchesDepartment && matchesAccessLevel;
  });

  const getAccessLevelVariant = (level: string) => {
    switch (level) {
      case "PUBLIC":
        return "success";
      case "RESTRICTED":
        return "warning";
      case "CONFIDENTIAL":
        return "destructive";
      case "SECRET":
        return "outline";
      default:
        return "default";
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await dispatch(deleteRecord(id)).unwrap();
      } catch (error) {
        console.error("Failed to delete record:", error);
      }
    }
  };

  const formatFileSize = (sizeStr: string) => {
    const size = Number.parseInt(sizeStr);
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (size === 0) return "0 Bytes";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return Math.round((size / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Records Management
            </h1>
            <p className="text-muted-foreground">
              Manage and organize institutional records
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/upload")}>
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
            New Record
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <select
                className="flex h-10 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
                value={selectedAccessLevel}
                onChange={(e) => setSelectedAccessLevel(e.target.value)}
              >
                <option value="">All Access Levels</option>
                {accessLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
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

        {/* Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Records ({filteredRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading records...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Collection</TableHead>
                    <TableHead>Access Level</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.description}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {record.subjectTags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.collection?.title || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getAccessLevelVariant(record.accessLevel)}
                        >
                          {record.accessLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {record.fileAssets.length} file
                          {record.fileAssets.length !== 1 ? "s" : ""}
                          {record.fileAssets.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {formatFileSize(record.fileAssets[0].size)}
                              {record.fileAssets.length > 1 &&
                                ` + ${record.fileAssets.length - 1} more`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/records/${record.id}`)}
                          >
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Header */}
    </div>
  );
}

