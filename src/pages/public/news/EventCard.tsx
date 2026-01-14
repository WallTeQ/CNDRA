import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
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
    <Card className="overflow-hidden group h-full flex flex-col" hover>
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-slate-400" />
          </div>
        )}

        {/* Date Badge Overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-center min-w-[60px]">
          <div className="text-2xl font-bold text-slate-900 leading-none">
            {new Date(event.date).getDate()}
          </div>
          <div className="text-xs text-slate-600 uppercase font-medium mt-1">
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </div>
        </div>

        {/* Event Type Badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant={getEventTypeColor(event.type)}
            size="sm"
            className="capitalize shadow-md"
          >
            {event.type}
          </Badge>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2 leading-tight">
          <Link
            to={`/events/${event.id}`}
            className="hover:text-slate-700 transition-colors"
          >
            {event.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2.5 text-sm text-slate-700 mb-4">
          <div className="flex items-start space-x-2.5">
            <Calendar className="h-4 w-4 mt-0.5 text-slate-500 flex-shrink-0" />
            <span className="line-clamp-1">{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <Clock className="h-4 w-4 mt-0.5 text-slate-500 flex-shrink-0" />
            <span className="line-clamp-1">{event.time}</span>
          </div>
          <div className="flex items-start space-x-2.5">
            <MapPin className="h-4 w-4 mt-0.5 text-slate-500 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {event.capacity && (
            <div className="flex items-start space-x-2.5">
              <Users className="h-4 w-4 mt-0.5 text-slate-500 flex-shrink-0" />
              <span>Max {event.capacity} participants</span>
            </div>
          )}
        </div>

        {/* Registration Notice */}
        {event.registrationRequired && (
          <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium">
            ⚠️ Registration required
          </div>
        )}

        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 mb-0.5">Price</span>
            <span className="text-lg font-bold text-slate-900">
              {event.price}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {event.registrationRequired && event.registrationUrl ? (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  icon={<ExternalLink className="h-4 w-4" />}
                  className="shadow-sm"
                >
                  Register
                </Button>
              </a>
            ) : (
              <Link to={`/events/${event.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ChevronRight className="h-4 w-4" />}
                  className="shadow-sm"
                >
                  Details
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
