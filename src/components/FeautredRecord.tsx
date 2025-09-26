import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RecordCard } from "./ui/Record-card";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "./ui/Button";
import { fetchRecords } from "../store/slices/records/recordsThunk";
import type { RootState, AppDispatch } from "../store";

export default function FeaturedRecords() {
  const dispatch = useDispatch<AppDispatch>();
  const { records, isLoading: recordsLoading } = useSelector(
    (state: RootState) => state.records
  );

  useEffect(() => {
    dispatch(fetchRecords()); 
  }, [dispatch]);
  const featuredRecords = records.slice(0, 3);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Records */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Featured Records
              </h2>
              <p className="text-muted-foreground">
                Recently published and frequently accessed documents
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/search">View All Records</a>
            </Button>
          </div>

          {recordsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecords.map((record) => (
                <RecordCard key={record.id} {...record} />
              ))}
            </div>
          )}
        </section>

      </div>
    </>
  );
}
