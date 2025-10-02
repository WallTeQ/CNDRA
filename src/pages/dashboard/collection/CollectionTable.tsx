// components/collections/CollectionsTable.tsx
import { Card, CardContent } from "../../../components/ui/Card";
import Pagination from "../../../components/Pagination";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Dropdown } from "../../../components/ui/Dropdown";
import {
  FolderOpen,
  MoreHorizontal,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { Collection } from "../../../types";


interface CollectionsTableProps {
  collections: Collection[];
  onViewDetails: (collection: Collection) => void;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function CollectionsTable({
  collections,
  onViewDetails,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: CollectionsTableProps) {
  const getRecordCount = (collection: Collection): number => {
    return collection.records?.length || 0;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <Card>
      <CardContent className="p-0">
        <div>
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Collection
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Departments
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {collections.map((collection) => (
                <tr
                  key={collection.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <FolderOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {collection.title}
                        </div>
                      </div>
                    </div>
                  </td>
                   <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                              {collection.departments.slice(0, 2).map((dept) => (
                                                <Badge
                                                  key={dept.id}
                                                  variant="default"
                                                  size="xs"
                                                  className="bg-blue-100 text-blue-800"
                                                >
                                                  {dept.name}
                                                </Badge>
                                              ))}
                                              {collection.departments.length > 2 && (
                                                <Badge variant="default" size="xs" className="bg-muted text-muted-foreground">
                                                  +{collection.departments.length - 2}
                                                </Badge>
                                              )}
                                            </div>
                                          </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {getRecordCount(collection)}
                    </span>
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
                          icon: <FileText className="w-4 h-4" />,
                          onClick: () => onViewDetails(collection),
                        },
                        {
                          label: "Edit",
                          icon: <Edit className="w-4 h-4" />,
                          onClick: () => onEdit(collection),
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 className="w-4 h-4" />,
                          variant: "destructive",
                          onClick: () => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this collection?"
                              )
                            ) {
                              onDelete(collection);
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-muted/30 px-6 py-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {endIndex} of {totalItems}{" "}
                collections
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
    </Card>
  );
}
