import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

interface Collection {
  id: string;
  title: string;
  records?: any[];
}

interface Department {
  id: string;
  name: string;
  description?: string;
  collections?: Collection[];
  createdAt: string;
}

interface DepartmentCardProps {
  department: Department;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const collectionsCount = department.collections?.length || 0;
  const recordsCount =
    department.collections?.reduce(
      (total, collection) => total + (collection.records?.length || 0),
      0
    ) || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-lg">
            {department.name}
          </h3>
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {collectionsCount} collection{collectionsCount !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {recordsCount} record{recordsCount !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {department.description}
        </p>

        {/* Collections Preview */}
        {department.collections && department.collections.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Collections:
            </h4>
            <div className="space-y-1">
              {department.collections.slice(0, 3).map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground truncate">
                    {collection.title}
                  </span>
                  <Badge variant="outline" className="text-xs ml-2">
                    {collection.records?.length || 0}
                  </Badge>
                </div>
              ))}
              {department.collections.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{department.collections.length - 3} more collections
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto text-primary hover:text-primary/80"
            asChild
          >
            {/* <a href={`/public/departments/${department.id}`}>
              Browse Department →
            </a> */}
          </Button>
          <span className="text-xs text-muted-foreground">
            Created {new Date(department.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
