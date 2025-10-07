import React, { useState } from "react";
import {
  Plus,
  CreditCard as Edit,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { RichTextEditor } from "../../../components/ui/RichTextEditor";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import {
  useAllEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  usePublishEvent,
  useUnpublishEvent,
} from "../../../hooks/useGovernance";
import { Event } from "../../../types/governance";
import { formatDate } from "../../../utils/FormatDate";

export const EventManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // React Query hooks
  const { data: eventsList = [], isLoading, error } = useAllEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const publishEventMutation = usePublishEvent();
  const unpublishEventMutation = useUnpublishEvent();

  // Filter events based on search term
  const filteredEvents = eventsList.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsCreateModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEventMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handlePublishToggle = async (event: Event) => {
    try {
      if (event.status === "published") {
        await unpublishEventMutation.mutateAsync({ eventId: event.id });
      } else {
        await publishEventMutation.mutateAsync({ eventId: event.id });
      }
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading events: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Event Management
          </h1>
          <p className="text-slate-600">Create and manage events</p>
        </div>
        <Button
          onClick={handleCreateEvent}
          size="sm"
          className="whitespace-nowrap flex items-center space-x-2"
          icon={<Plus className="w-4 h-4" />}
        >
          <span>Create Event</span>
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full">
            <Card className="text-center py-12">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No events found
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Get started by creating your first event."}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateEvent}>Create Event</Button>
              )}
            </Card>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {event.title}
                      </h3>
                      <Badge
                        variant={
                          event.status === "published" ? "success" : "warning"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>

                    <div
                      className="text-slate-600 mb-4 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          event.description.substring(0, 150) +
                          (event.description.length > 150 ? "..." : ""),
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePublishToggle(event)}
                      disabled={
                        publishEventMutation.isPending ||
                        unpublishEventMutation.isPending
                      }
                    >
                      {event.status === "published" ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deleteEventMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.startsAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(event.startsAt)} - {formatTime(event.endsAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:col-span-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <EventFormModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        isEdit={isEditModalOpen}
        createMutation={createEventMutation}
        updateMutation={updateEventMutation}
      />
    </div>
  );
};

// Event Form Modal Component
interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  isEdit: boolean;
  createMutation: any;
  updateMutation: any;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  event,
  isEdit,
  createMutation,
  updateMutation,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startsAt: "",
    endsAt: "",
    location: "",
  });

  React.useEffect(() => {
    if (isOpen) {
      if (isEdit && event) {
        setFormData({
          title: event.title,
          description: event.description,
          startsAt: new Date(event.startsAt).toISOString().slice(0, 16),
          endsAt: new Date(event.endsAt).toISOString().slice(0, 16),
          location: event.location,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          startsAt: "",
          endsAt: "",
          location: "",
        });
      }
    }
  }, [isOpen, isEdit, event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.startsAt ||
      !formData.endsAt ||
      !formData.location.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (new Date(formData.startsAt) >= new Date(formData.endsAt)) {
      alert("End time must be after start time");
      return;
    }

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: new Date(formData.endsAt).toISOString(),
        location: formData.location,
        status: "draft" as const,
      };

      if (isEdit && event) {
        await updateMutation.mutateAsync({ id: event.id, data: eventData });
      } else {
        await createMutation.mutateAsync(eventData);
      }

      onClose();
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Event" : "Create Event"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Title *"
          placeholder="Enter event title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description *
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(description) =>
              setFormData((prev) => ({ ...prev, description }))
            }
            placeholder="Describe your event..."
            className="min-h-[200px]"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date & Time *"
            type="datetime-local"
            value={formData.startsAt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startsAt: e.target.value }))
            }
            required
          />
          <Input
            label="End Date & Time *"
            type="datetime-local"
            value={formData.endsAt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, endsAt: e.target.value }))
            }
            required
          />
        </div>

        {/* Location */}
        <Input
          label="Location *"
          placeholder="Enter event location"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          required
        />

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
