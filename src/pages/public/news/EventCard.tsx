import React from "react";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  capacity: number | null;
  price: string;
  registrationRequired: boolean;
  registrationUrl: string | null;
  imageUrl?: string;
}

interface EventCardProps {
  event: Event;
  getEventTypeColor: (
    type: string
  ) => "default" | "success" | "warning" | "danger" | "info";
  formatEventDate: (dateString: string) => string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  getEventTypeColor,
  formatEventDate,
}) => {
  return (
    <Card hover>
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="">
        <div className="flex items-center justify-between mb-3">
          <Badge
            variant={getEventTypeColor(event.type)}
            size="sm"
            className="capitalize"
          >
            {event.type}
          </Badge>
          <div className="text-right">
            <div className="text-lg font-bold text-slate-900">
              {new Date(event.date).getDate()}
            </div>
            <div className="text-xs text-slate-500 uppercase">
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
              })}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-3 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          {event.capacity && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Max {event.capacity} participants</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-900">
            {event.price}
          </span>
          {event.registrationRequired && event.registrationUrl ? (
            <Button size="sm" icon={<ExternalLink className="h-3 w-3" />}>
              Register
            </Button>
          ) : (
            <Link to={`/events/${event.id}`} className="ml-2">
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Link>
          )}
        </div>

        {event.registrationRequired && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            Registration required for this event
          </div>
        )}
      </div>
    </Card>
  );
};
