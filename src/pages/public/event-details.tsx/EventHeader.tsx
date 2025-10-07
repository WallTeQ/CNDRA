import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share2,
  Printer as Print,
  Download,
  ExternalLink,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

interface EventHeaderProps {
  title: string;
  status: {
    text: string;
    variant: "default" | "success" | "warning" | "danger" | "info";
  };
  startsAt: string;
  endsAt: string;
  location: string;
  isEventPast: boolean;
  formatDateRange: () => string;
  formatTime: (dateString: string) => string;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  status,
  startsAt,
  endsAt,
  location,
  isEventPast,
  formatDateRange,
  formatTime,
}) => {
  return (
    <Card className="mb-8">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant={status.variant}>{status.text}</Badge>
          <Badge variant="default" className="capitalize">
            Event
          </Badge>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
          {title}
        </h1>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Date</p>
                <p className="text-slate-900">{formatDateRange()}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Time</p>
                <p className="text-slate-900">
                  {formatTime(startsAt)} - {formatTime(endsAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-700">Location</p>
                <p className="text-slate-900">{location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Print className="h-4 w-4" />
            </Button>
          </div>

          {!isEventPast && (
            <div className="flex items-center space-x-2">
              <Button size="sm" icon={<Download className="h-4 w-4" />}>
                Add to Calendar
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<ExternalLink className="h-4 w-4" />}
              >
                Register Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
