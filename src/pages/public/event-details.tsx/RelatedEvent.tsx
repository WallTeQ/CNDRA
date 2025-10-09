import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

interface RelatedEvent {
  id: string;
  title: string;
  startsAt: string;
  location: string;
}

interface RelatedEventsProps {
  events: RelatedEvent[];
}

export const RelatedEvents: React.FC<RelatedEventsProps> = ({ events }) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Related Events
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="block group"
          >
            <div className="space-y-3">
              <div className="bg-slate-100 rounded-lg p-4 group-hover:bg-slate-200 transition-colors">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {new Date(event.startsAt).getDate()}
                  </div>
                  <div className="text-sm text-slate-600 uppercase">
                    {new Date(event.startsAt).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </div>
                </div>
              </div>
              <div>
                <Badge variant="info" size="sm">
                  Event
                </Badge>
                <h4 className="font-medium text-slate-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors mt-2">
                  {event.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {event.location}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};
