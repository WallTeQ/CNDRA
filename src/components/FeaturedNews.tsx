import React from "react";
import { Link } from "react-router-dom";
import { User, ChevronRight, FileText, HelpCircle } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { formatDate } from "../utils/FormatDate";
import { mockNews } from "../data/newsData";

const FeaturedNewsSection: React.FC = () => {
  const featuredNews = mockNews.filter((article) => article.featured);

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
        <div className="space-y-6">
          {featuredNews.slice(0, 4).map((article) => (
            <Link key={article.id} to={`/news/${article.id}`}>
            <div key={article.id} className="overflow-hidden p-2 border bg-gray-100 ">
              <div className="">
                <div className="flex items-start gap-4">
                  {/* Image on the left */}
                  <div className=" w-32 md:h-24 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden">
                    {article.imageUrl && (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Content on the right */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            variant={getCategoryColor(article.category)}
                            size="xs"
                            className="capitalize text-xs "
                          >
                            {article.category}
                          </Badge>
                          <span className="text-xs md:text-sm text-slate-500">
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                        <h4 className="text-xs md:text-md font-semibold text-slate-900 mb-2 line-clamp-2">
                          {article.title}
                        </h4>
                        {/* <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p> */}
                        <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-500">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                      </div>
                      <Link to={`/news/${article.id}`} className="ml-2 hidden md:block">
                        <button
                          className="p-1 rounded flex  items-center space-x-1 shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          <span>Read More</span>
                          {/* <ChevronRight className="h-4 w-4" /> */}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Quick Actions
        </h2>
        <div className="space-y-4">
          <Card className="p-0" hover>
            <div className="">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Request Access</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Submit a Freedom of Information request for restricted records
              </p>
              <Link to="/public/request">
                <Button size="sm" className="w-full">
                  Submit Request
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-0" hover>
            <div className="">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Need Help?</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Contact our support team for assistance with record searches
              </p>
              <Link to="/contact">
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNewsSection;
