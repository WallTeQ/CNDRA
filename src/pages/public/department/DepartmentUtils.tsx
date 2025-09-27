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

export function filterDepartments(
  departments: Department[],
  searchQuery: string,
  filterByRecords: string
): Department[] {
  return departments.filter((department) => {
    const matchesSearch =
      !searchQuery.trim() ||
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const recordsCount =
      department.collections?.reduce(
        (total, collection) => total + (collection.records?.length || 0),
        0
      ) || 0;

    const matchesFilter =
      filterByRecords === "all" ||
      (filterByRecords === "with-records" && recordsCount > 0) ||
      (filterByRecords === "no-records" && recordsCount === 0);

    return matchesSearch && matchesFilter;
  });
}

export function sortDepartments(
  departments: Department[],
  sortBy: string
): Department[] {
  return [...departments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "collections":
        return (b.collections?.length || 0) - (a.collections?.length || 0);
      case "records":
        const aRecords: number =
          a.collections?.reduce(
            (total: number, collection: Collection) =>
              total + (collection.records?.length || 0),
            0
          ) || 0;
        const bRecords =
          b.collections?.reduce(
            (total, collection) => total + (collection.records?.length || 0),
            0
          ) || 0;
        return bRecords - aRecords;
      case "date":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });
}
