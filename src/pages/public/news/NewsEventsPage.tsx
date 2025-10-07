// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Calendar, 
//   Clock, 
//   MapPin, 
//   Users, 
//   ExternalLink, 
//   Search,
//   Tag,
//   User,
//   ChevronRight,
//   Bookmark,
//   Share2
// } from 'lucide-react';
// import { Card } from '../../components/ui/Card';
// import { Button } from '../../components/ui/Button';
// import { Badge } from '../../components/ui/Badge';
// import { mockNews, mockEvents} from '../../data/newsData';

// export const NewsEventsPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
//   const [newsFilter, setNewsFilter] = useState<string>('all');
//   const [eventFilter, setEventFilter] = useState<string>('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredNews = mockNews.filter(article => {
//     const matchesSearch = searchQuery === '' || 
//       article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
//     const matchesFilter = newsFilter === 'all' || article.category === newsFilter;
    
//     return matchesSearch && matchesFilter;
//   });

//   const filteredEvents = mockEvents.filter(event => {
//     const matchesSearch = searchQuery === '' || 
//       event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesFilter = eventFilter === 'all' || event.type === eventFilter;
    
//     return matchesSearch && matchesFilter;
//   });

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatEventDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getCategoryColor = (category: string) => {
//     const colors: { [key: string]: 'default' | 'success' | 'warning' | 'danger' | 'info' } = {
//       news: 'info',
//       announcement: 'success',
//       research: 'warning',
//       acquisition: 'default'
//     };
//     return colors[category] || 'default';
//   };

//   const getEventTypeColor = (type: string) => {
//     const colors: { [key: string]: 'default' | 'success' | 'warning' | 'danger' | 'info' } = {
//       exhibition: 'info',
//       workshop: 'warning',
//       lecture: 'success',
//       tour: 'default',
//       conference: 'danger'
//     };
//     return colors[type] || 'default';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-900 mb-4">News & Events</h1>
//           <p className="text-lg text-slate-600">
//             Stay updated with the latest news from the National Archive and upcoming events.
//           </p>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Filters Sidebar */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-8">
//               <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
              
//               {/* Search */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Search
//                 </label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
//                   <input
//                     type="text"
//                     placeholder="Search news and events..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Content Type */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Content Type
//                 </label>
//                 <div className="space-y-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="contentType"
//                       checked={activeTab === 'news'}
//                       onChange={() => setActiveTab('news')}
//                       className="text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="ml-2 text-sm text-slate-700">News Articles</span>
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="contentType"
//                       checked={activeTab === 'events'}
//                       onChange={() => setActiveTab('events')}
//                       className="text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="ml-2 text-sm text-slate-700">Events</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Category/Type Filters */}
//               {activeTab === 'news' ? (
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     News Category
//                   </label>
//                   <select
//                     value={newsFilter}
//                     onChange={(e) => setNewsFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   >
//                     <option value="all">All Categories</option>
//                     <option value="news">News</option>
//                     <option value="announcement">Announcements</option>
//                     <option value="research">Research</option>
//                     <option value="acquisition">Acquisitions</option>
//                   </select>
//                 </div>
//               ) : (
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Event Type
//                   </label>
//                   <select
//                     value={eventFilter}
//                     onChange={(e) => setEventFilter(e.target.value)}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                   >
//                     <option value="all">All Types</option>
//                     <option value="exhibition">Exhibitions</option>
//                     <option value="workshop">Workshops</option>
//                     <option value="lecture">Lectures</option>
//                     <option value="tour">Tours</option>
//                     <option value="conference">Conferences</option>
//                   </select>
//                 </div>
//               )}
//             </Card>
//           </div>

//           {/* Content Area */}
//           <div className="lg:col-span-3">
//             {activeTab === 'news' ? (
//               <div>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-slate-900">News Articles</h2>
//                   <span className="text-sm text-slate-600">
//                     {filteredNews.length} articles found
//                   </span>
//                 </div>

//                 <div className="space-y-6">
//                   {filteredNews.map((article) => (
//                     <Card key={article.id} className="overflow-hidden" hover>
//                       <div className="md:flex">
//                         {article.imageUrl && (
//                           <div className="md:flex-shrink-0">
//                             <img
//                               src={article.imageUrl}
//                               alt={article.title}
//                               className="h-48 w-full object-cover md:h-full md:w-48"
//                             />
//                           </div>
//                         )}
//                         <div className="p-6 flex-1">
//                           <div className="flex items-center space-x-2 mb-3">
//                             <Badge variant={getCategoryColor(article.category)} size="sm" className="capitalize">
//                               {article.category}
//                             </Badge>
//                             <span className="text-sm text-slate-500">
//                               {formatDate(article.publishedAt)}
//                             </span>
//                           </div>
                          
//                           <h3 className="text-xl font-semibold text-slate-900 mb-3">
//                             <Link to={`/news/${article.id}`} className="hover:text-blue-600 transition-colors">
//                               {article.title}
//                             </Link>
//                           </h3>
                          
//                           <p className="text-slate-600 mb-4 line-clamp-3">
//                             {article.excerpt}
//                           </p>
                          
//                           <div className="flex flex-wrap gap-2 mb-4">
//                             {article.tags.slice(0, 3).map((tag, index) => (
//                               <Badge key={index} variant="default" size="sm">
//                                 <Tag className="h-3 w-3 mr-1" />
//                                 {tag}
//                               </Badge>
//                             ))}
//                           </div>
                          
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-2 text-sm text-slate-500">
//                               <User className="h-4 w-4" />
//                               <span>{article.author}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <Button variant="ghost" size="sm">
//                                 <Bookmark className="h-4 w-4" />
//                               </Button>
//                               <Button variant="ghost" size="sm">
//                                 <Share2 className="h-4 w-4" />
//                               </Button>
//                               <Link to={`/news/${article.id}`}>
//                                 <Button size="sm" icon={<ChevronRight className="h-4 w-4" />}>
//                                   Read More
//                                 </Button>
//                               </Link>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-slate-900">Events</h2>
//                   <span className="text-sm text-slate-600">
//                     {filteredEvents.length} events found
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {filteredEvents.map((event) => (
//                     <Card key={event.id} hover>
//                       {event.imageUrl && (
//                         <img
//                           src={event.imageUrl}
//                           alt={event.title}
//                           className="w-full h-48 object-cover rounded-t-lg"
//                         />
//                       )}
//                       <div className={event.imageUrl ? 'p-6' : 'p-6'}>
//                         <div className="flex items-center justify-between mb-3">
//                           <Badge variant={getEventTypeColor(event.type)} size="sm" className="capitalize">
//                             {event.type}
//                           </Badge>
//                           <div className="text-right">
//                             <div className="text-lg font-bold text-slate-900">
//                               {new Date(event.date).getDate()}
//                             </div>
//                             <div className="text-xs text-slate-500 uppercase">
//                               {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
//                             </div>
//                           </div>
//                         </div>
                        
//                         <h3 className="text-lg font-semibold text-slate-900 mb-3 line-clamp-2">
//                           {event.title}
//                         </h3>
                        
//                         <p className="text-slate-600 text-sm mb-4 line-clamp-3">
//                           {event.description}
//                         </p>
                        
//                         <div className="space-y-2 text-sm text-slate-600 mb-4">
//                           <div className="flex items-center space-x-2">
//                             <Calendar className="h-4 w-4" />
//                             <span>{formatEventDate(event.date)}</span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Clock className="h-4 w-4" />
//                             <span>{event.time}</span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <MapPin className="h-4 w-4" />
//                             <span>{event.location}</span>
//                           </div>
//                           {event.capacity && (
//                             <div className="flex items-center space-x-2">
//                               <Users className="h-4 w-4" />
//                               <span>Max {event.capacity} participants</span>
//                             </div>
//                           )}
//                         </div>
                        
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-slate-900">
//                             {event.price}
//                           </span>
//                           {event.registrationRequired && event.registrationUrl ? (
//                             <Button size="sm" icon={<ExternalLink className="h-3 w-3" />}>
//                               Register
//                             </Button>
//                           ) : (
//                             <Button variant="outline" size="sm">
//                               Learn More
//                             </Button>
//                           )}
//                         </div>
                        
//                         {event.registrationRequired && (
//                           <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
//                             Registration required for this event
//                           </div>
//                         )}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };


import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
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
      author: news.author || "National Archive",
      publishedAt: news.createdAt,
      imageUrl: news.fileAssets?.[0]?.cloudinaryPublicId
        ? `https://res.cloudinary.com/your-cloud-name/image/upload/${news.fileAssets[0].cloudinaryPublicId}`
        : news.fileAssets?.[0]?.localPath || undefined,
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
          tag.toLowerCase().includes(searchQuery.toLowerCase())
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