import React from "react";
import { Link } from "react-router-dom";
import { User, Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { formatDate } from "../utils/FormatDate";
import { usePublishedNews, usePublishedEvents } from "../hooks/useGovernance";

const FeaturedNewsSection: React.FC = () => {
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

  const upcomingEvents = eventsData
    ?.filter((event) => new Date(event.startsAt) > new Date())
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    )
    .slice(0, 3);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* News Section */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Latest News</h2>
        <div className="grid grid-cols-1 gap-2">
          {newsData?.slice(0, 4).map((article) => (
            <Link key={article.id} to={`/news/${article.id}`}>
              <div className="overflow-hidden p-4 border bg-white rounded-lg hover:shadow-lg transition-all duration-300 hover:border-red-300 space-y-12">
                <div className="flex items-start gap-4 ">
                  {/* Image on the left */}
                  <div className="w-32 h-24 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden">
                    {article.fileAssets?.[0]?.storagePath ? (
                      <img
                        src={article.fileAssets[0].storagePath}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <svg
                          className="w-8 h-8 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content on the right */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={getCategoryColor(article.category)}
                        size="xs"
                        className="capitalize"
                      >
                        {article.category}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-sm text-slate-700 mb-4 line-clamp-3">
                      {article.content.replace(/<[^>]*>/g, "")}
                    </p>
                    {article?.author && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="h-3.5 w-3.5" />
                        <span>{article.author}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-gradient-to-br from-red-50 to-indigo-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 text-lg">
                Upcoming Events
              </h3>
            </div>

            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                      {event.description.replace(/<[^>]*>/g, "")}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(event.startsAt)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    {event.requiresRegistration && (
                      <Link
                        to={event.registrationUrl || `/events/${event.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" className="w-full">
                          Register Now
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
                <Link to="/news-events">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All Events
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No upcoming events</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeaturedNewsSection;
