import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import FeaturedNewsSection from "../../../components/FeaturedNews";

export const NewsEventsSection: React.FC = () => {
  return (
    <section className="py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-12 lg:px-22">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Latest News & Events
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay informed about new acquisitions, research opportunities, and
            upcoming events.
          </p>
        </div>

        <div>
          <FeaturedNewsSection />
        </div>
        <div className="text-center mt-10">
          <Link to="/news-events">
            <Button size="lg" >View All News & Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
