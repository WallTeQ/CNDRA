import { RecordCard } from "./ui/Record-card";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import { useRecords } from "../hooks/useRecords";

export default function FeaturedRecords() {
  const { data: records = [], isLoading: recordsLoading } = useRecords();

  const featuredRecords = records.slice(0, 6);

  return (
    <>
      <div className="max-w-8xl mx-auto px-4 sm:px-12 lg:px-22 py-10">
        {/* Featured Records */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg md:text-3xl font-bold text-foreground">
                Featured Records
              </h2>
              <p className="text-muted-foreground text-xs md:text-base">
                Recently published and frequently accessed documents
              </p>
            </div>
            <div className="text-center mt-10 hidden md:block">
              <Link to="/search">
                <Button size="lg">View All records</Button>
              </Link>
            </div>
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
          <div className="text-center mt-10 md:hidden">
            <Link to="/search">
              <Button size="lg" className="text-sm md:text-base">
                View All records
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}