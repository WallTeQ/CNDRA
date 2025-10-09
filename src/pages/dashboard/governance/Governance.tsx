import React, { useState } from "react";
import { FileText, Calendar, Bell, TrendingUp, Eye } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { NewsManagement } from "./NewsManagement";
import { EventManagement } from "./EventMangement";
import {
  useAllNews,
  useAllEvents,
  useAllNotices,
} from "../../../hooks/useGovernance";
import { NoticeManagement } from "./NoticeManagement";
import { formatDateWithoutYear } from "../../../utils/FormatDate";

type TabType = "overview" | "news" | "events" | "notices";

export const GovernanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // React Query hooks for overview stats
  const { data: newsList = [] } = useAllNews();
  const { data: eventsList = [] } = useAllEvents();
  const { data: noticesList = [] } = useAllNotices();

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "news", label: "News", icon: FileText },
    { id: "events", label: "Events", icon: Calendar },
    { id: "notices", label: "Notices", icon: Bell },
  ];

  const stats = [
    {
      name: "Total News",
      value: newsList.length.toString(),
      change: "+12%",
      changeType: "increase" as const,
      icon: FileText,
      color: "red" as const,
      published: newsList.filter((n) => n.status === "published").length,
    },
    {
      name: "Total Events",
      value: eventsList.length.toString(),
      change: "+8%",
      changeType: "increase" as const,
      icon: Calendar,
      color: "green" as const,
      published: eventsList.filter((e) => e.status === "published").length,
    },
    {
      name: "Active Notices",
      value: noticesList
        .filter((n) => n.status === "published")
        .length.toString(),
      change: "+3%",
      changeType: "increase" as const,
      icon: Bell,
      color: "yellow" as const,
      published: noticesList.filter((n) => n.status === "published").length,
    },
    {
      name: "Total Views",
      value: "12.5K",
      change: "+15%",
      changeType: "increase" as const,
      icon: Eye,
      color: "purple" as const,
      published: 0,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            stats={stats}
            newsList={newsList}
            eventsList={eventsList}
          />
        );
      case "news":
        return <NewsManagement />;
      case "events":
        return <EventManagement />;
      case "notices":
        return (
          <NoticeManagement />
        );
      default:
        return (
          <OverviewTab
            stats={stats}
            newsList={newsList}
            eventsList={eventsList}
          />
        );
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Governance Dashboard
          </h1>
          <p className="text-slate-600">
            Manage news, events, and public communications
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

// Overview Tab Component
interface OverviewTabProps {
  stats: any[];
  newsList: any[];
  eventsList: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  newsList,
  eventsList,
}) => {
  const recentNews = newsList.slice(0, 5);
  const upcomingEvents = eventsList
    .filter((event) => new Date(event.startsAt) > new Date())
    .sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`p-3 rounded-lg ${
                    stat.color === "red"
                      ? "bg-red-100 text-red-600"
                      : stat.color === "green"
                      ? "bg-green-100 text-green-600"
                      : stat.color === "yellow"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-slate-900">
                      {stat.value}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">Increased by</span>
                      {stat.change}
                    </div>
                  </dd>
                  {stat.published > 0 && (
                    <dd className="text-xs text-slate-500 mt-1">
                      {stat.published} published
                    </dd>
                  )}
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent News */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-slate-900">Recent News</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentNews.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                No news articles yet
              </p>
            ) : (
              recentNews.map((news) => (
                <div
                  key={news.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {news.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant={
                          news.status === "published" ? "success" : "warning"
                        }
                        size="sm"
                      >
                        {news.status}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDateWithoutYear(news.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-slate-900">
              Upcoming Events
            </h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-slate-500 text-center py-4">
                No upcoming events
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant={
                          event.status === "published" ? "success" : "warning"
                        }
                        size="sm"
                      >
                        {event.status}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatDateWithoutYear(event.startsAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {event.location}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
