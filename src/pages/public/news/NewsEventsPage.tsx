import React, { useState, useMemo } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import Pagination from "../../../components/Pagination";
import { NewsCard } from "./NewsCard";
import { EventCard } from "./EventCard";
import { FiltersSidebar } from "./FilterSidebar";
import {
  usePublishedNews,
  usePublishedEvents,
} from "../../../hooks/useGovernance";
import { formatDate } from "../../../utils/FormatDate";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";

const ITEMS_PER_PAGE = 6;

export const NewsEventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");
  const [newsFilter, setNewsFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from API
  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
  } = usePublishedNews();
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = usePublishedEvents();

  // Transform API data to match component structure
  const transformedNews = useMemo(() => {
    if (!newsData) return [];

    return newsData.map((news) => ({
      id: news.id,
      title: news.title,
      excerpt: news.content.replace(/<[^>]*>/g, "").substring(0, 200) + "...",
      content: news.content,
      category: "news",
      tags: [],
      author: news.author?.displayName || "National Archive",
      publishedAt: news.createdAt,
      imageUrl: news.fileAssets?.[0]?.storagePath
    }));
  }, [newsData]);

  const transformedEvents = useMemo(() => {
    if (!eventsData) return [];

    return eventsData.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description.replace(/<[^>]*>/g, ""),
      type: "event",
      date: event.startsAt,
      endDate: event.endsAt,
      time: new Date(event.startsAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: event.location,
      capacity: null,
      price: "Free",
      registrationRequired: false,
      registrationUrl: null,
      imageUrl: undefined,
    }));
  }, [eventsData]);

  const filteredNews = useMemo(() => {
    const filtered = transformedNews.filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) =>
          tag?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesFilter =
        newsFilter === "all" || article.category === newsFilter;

      return matchesSearch && matchesFilter;
    });

    return filtered;
  }, [transformedNews, searchQuery, newsFilter]);

  const filteredEvents = useMemo(() => {
    const filtered = transformedEvents.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = eventFilter === "all" || event.type === eventFilter;

      return matchesSearch && matchesFilter;
    });

    return filtered;
  }, [transformedEvents, searchQuery, eventFilter]);

  // Pagination logic
  const currentItems = useMemo(() => {
    const items = activeTab === "news" ? filteredNews : filteredEvents;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  }, [activeTab, filteredNews, filteredEvents, currentPage]);

  const totalPages = useMemo(() => {
    const totalItems =
      activeTab === "news" ? filteredNews.length : filteredEvents.length;
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  }, [activeTab, filteredNews, filteredEvents]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, newsFilter, eventFilter, searchQuery]);


  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: {
      [key: string]: "default" | "success" | "warning" | "danger" | "info";
    } = {
      news: "info",
      announcement: "success",
      research: "warning",
      acquisition: "default",
    };
    return colors[category] || "default";
  };

  const getEventTypeColor = (type: string) => {
    const colors: {
      [key: string]: "default" | "success" | "warning" | "danger" | "info";
    } = {
      exhibition: "info",
      workshop: "warning",
      lecture: "success",
      tour: "default",
      conference: "danger",
      event: "info",
    };
    return colors[type] || "default";
  };

  // Loading state
  if (
    (activeTab === "news" && newsLoading) ||
    (activeTab === "events" && eventsLoading)
  ) {
    return (
      <LoadingSpinner size="lg" message="Loading content..." />
    );
  }

  // Error state
  if (
    (activeTab === "news" && newsError) ||
    (activeTab === "events" && eventsError)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading {activeTab}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            News & Events
          </h1>
          <p className="text-lg text-slate-600">
            Stay updated with the latest news from the National Archive and
            upcoming events.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FiltersSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              newsFilter={newsFilter}
              setNewsFilter={setNewsFilter}
              eventFilter={eventFilter}
              setEventFilter={setEventFilter}
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "news" ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    News Articles
                  </h2>
                  <span className="text-sm text-slate-600">
                    {filteredNews.length} articles found
                  </span>
                </div>

                {filteredNews.length === 0 ? (
                  <Card className="text-center py-12">
                    <p className="text-slate-600">No news articles found</p>
                  </Card>
                ) : (
                  <>
                    <div className="space-y-6">
                      {currentItems.map((article) => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          getCategoryColor={getCategoryColor}
                          formatDate={formatDate}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Events</h2>
                  <span className="text-sm text-slate-600">
                    {filteredEvents.length} events found
                  </span>
                </div>

                {filteredEvents.length === 0 ? (
                  <Card className="text-center py-12">
                    <p className="text-slate-600">No events found</p>
                  </Card>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentItems.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          getEventTypeColor={getEventTypeColor}
                          formatEventDate={formatEventDate}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-8">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};