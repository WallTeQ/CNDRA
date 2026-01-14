// components/records/RecordsTable.tsx
import React from "react";
import { FileText, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Dropdown } from "../../../components/ui/Dropdown";
import Pagination from "../../../components/Pagination";
import { Record } from "../../../types";
import { formatDateTime } from "../../../utils/FormatDate";

interface RecordsTableProps {
  records: Record[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewRecord: (record: Record) => void;
  onEditRecord: (record: Record) => void;
  onDeleteRecord: (id: string) => void;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({
  records,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
}) => {
  const getAccessLevelVariant = (level?: string) => {
    switch (level) {
      case "PUBLIC":
        return "success";
      case "RESTRICTED":
        return "warning";
      case "CONFIDENTIAL":
        return "danger";
      case "SECRET":
        return "info";
      default:
        return "default";
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <>
      <CardContent className="p-0">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Record
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Collection
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Access Level
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {record.title || "Untitled"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs line-clamp-2">
                        <div dangerouslySetInnerHTML={{ __html: record.description|| "No description" }} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(record.createdAt)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-xs text-muted-foreground">
                    {record.collection?.title || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    size="xs"
                    variant={getAccessLevelVariant(record.accessLevel)}
                    className="text-xs"
                  >
                    {record.accessLevel}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Dropdown
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    }
                    items={[
                      {
                        label: "View Details",
                        icon: <Eye className="w-4 h-4" />,
                        onClick: () => onViewRecord(record),
                      },
                      {
                        label: "Edit",
                        icon: <Edit className="w-4 h-4" />,
                        onClick: () => onEditRecord(record),
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4" />,
                        variant: "destructive",
                        onClick: () => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this record?"
                            )
                          ) {
                            onDeleteRecord(record.id);
                          }
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-muted/30 px-6 py-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {endIndex} of {totalItems} records
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
};
