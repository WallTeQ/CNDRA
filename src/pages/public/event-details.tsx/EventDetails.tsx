import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useEvent, usePublishedEvents } from "../../../hooks/useGovernance";
import { EventHeader } from "./EventHeader";
import { EventDescription } from "./EventDescription";
import { EventInfoCard } from "./EventInfo";
import { EventImportantNotes } from "./EventNote";
import { EventContactInfo } from "./EventContact";
import { RelatedEvents } from "./RelatedEvent";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { formatDate } from "../../../utils/FormatDate";

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEvent(id || "", !!id);
  const { data: allEvents } = usePublishedEvents();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateRange = () => {
    if (!event) return "";

    const start = new Date(event.startsAt);
    const end = new Date(event.endsAt);

    const isSameDay = start.toDateString() === end.toDateString();

    if (isSameDay) {
      return formatDate(event.startsAt);
    }

    return `${formatDate(event.startsAt)} - ${formatDate(event.endsAt)}`;
  };

  const isEventPast = () => {
    if (!event) return false;
    return new Date(event.endsAt) < new Date();
  };

  const isEventOngoing = () => {
    if (!event) return false;
    const now = new Date();
    return new Date(event.startsAt) <= now && new Date(event.endsAt) >= now;
  };

  const getEventStatus = () => {
    if (isEventPast())
      return { text: "Past Event", variant: "default" as const };
    if (isEventOngoing())
      return { text: "Happening Now", variant: "success" as const };
    return { text: "Upcoming", variant: "info" as const };
  };

  if (isLoading) {
    return (
     
          <LoadingSpinner size="lg" message="Loading Event details" />
         
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            The event you're looking for could not be found.
          </p>
          <Link to="/news-events">
            <Button>Back to News & Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Related events (same location or similar time frame)
  const relatedEvents =
    allEvents
      ?.filter(
        (e) =>
          e.id !== event.id &&
          (e.location === event.location ||
            Math.abs(
              new Date(e.startsAt).getTime() -
                new Date(event.startsAt).getTime()
            ) <
              30 * 24 * 60 * 60 * 1000)
      )
      .slice(0, 3) || [];

  const status = getEventStatus();
  const isPast = isEventPast();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/news-events"
            className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to News & Events</span>
          </Link>
        </div>

        {/* Event Header */}
        <EventHeader
          title={event.title}
          status={status}
          startsAt={event.startsAt}
          endsAt={event.endsAt}
          location={event.location}
          isEventPast={isPast}
          formatDateRange={formatDateRange}
          formatTime={formatTime}
        />

        {/* Event Description */}
        <EventDescription description={event.description} />

        {/* Event Information */}
        <EventInfoCard
          startsAt={event.startsAt}
          endsAt={event.endsAt}
          status={status}
        />

        {/* Important Notes */}
        <EventImportantNotes isEventPast={isPast} />

        {/* Contact Information */}
        <EventContactInfo />

        {/* Related Events */}
        <RelatedEvents events={relatedEvents} />
      </div>
    </div>
  );
};
