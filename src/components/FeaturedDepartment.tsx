import {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { fetchDepartments } from "../store/slices/depatments/departmentThunk";
import type { RootState, AppDispatch } from "../store/";
import { Link } from "react-router-dom";

export default function FeaturedDepartments() {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading } = useSelector(
    (state: RootState) => state.departments
  );

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const displayDepartments = departments.slice(0, 4);

  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-12 lg:px-22">
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg md:text-3xl font-bold text-foreground">
                Browse Departments
              </h2>
              <p className="text-muted-foreground text-xs">
                Explore records organized by department and collection
              </p>
            </div>
            <div className="text-center mt-10 hidden md:block">
              <Link to="/departments">
                <Button size="lg">View All departments</Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-3"></div>
                    <div className="h-3 bg-muted rounded mb-4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayDepartments.map((department) => {
                const collectionsCount = department.collections?.length || 0;
                const recordsCount =
                  department.collections?.reduce(
                    (total, collection) =>
                      total + (collection.records?.length || 0),
                    0
                  ) || 0;

                return (
                  <Card
                    key={department.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="md:p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-sm md:text-base">
                          {department.name}
                        </h3>
                        <div className="flex  gap-2">
                          <Badge variant="secondary" className="white-space-nowrap">
                            {collectionsCount} collection
                            {collectionsCount !== 1 ? "s" : ""}
                          </Badge>
                          <Badge variant="outline">
                            {recordsCount} record
                            {recordsCount !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {department.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-primary hover:text-primary/80"
                        asChild
                      >
                        <a href={`/departments`}>Browse Department →</a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          <div className="text-center mt-10 md:hidden">
            <Link to="/departments">
              <Button size="lg" className="text-sm md:text-base">View All Deparments</Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
