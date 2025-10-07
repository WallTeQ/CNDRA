import React from "react";
import { Search } from "lucide-react";
import { Card } from "../../../components/ui/Card";

interface FiltersSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: "news" | "events";
  setActiveTab: (tab: "news" | "events") => void;
  newsFilter: string;
  setNewsFilter: (filter: string) => void;
  eventFilter: string;
  setEventFilter: (filter: string) => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  newsFilter,
  setNewsFilter,
  eventFilter,
  setEventFilter,
}) => {
  return (
    <Card className="sticky top-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search news and events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Content Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Content Type
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="contentType"
              checked={activeTab === "news"}
              onChange={() => setActiveTab("news")}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-slate-700">News Articles</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="contentType"
              checked={activeTab === "events"}
              onChange={() => setActiveTab("events")}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-slate-700">Events</span>
          </label>
        </div>
      </div>

      {/* Category/Type Filters */}
      {activeTab === "news" ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            News Category
          </label>
          <select
            value={newsFilter}
            onChange={(e) => setNewsFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Categories</option>
            <option value="news">News</option>
            <option value="announcement">Announcements</option>
            <option value="research">Research</option>
            <option value="acquisition">Acquisitions</option>
          </select>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Event Type
          </label>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Types</option>
            <option value="exhibition">Exhibitions</option>
            <option value="workshop">Workshops</option>
            <option value="lecture">Lectures</option>
            <option value="tour">Tours</option>
            <option value="conference">Conferences</option>
          </select>
        </div>
      )}
    </Card>
  );
};
