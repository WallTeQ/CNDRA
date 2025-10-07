import React from "react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

interface EventInfoCardProps {
  startsAt: string;
  endsAt: string;
  status: {
    text: string;
    variant: "default" | "success" | "warning" | "danger" | "info";
  };
}

export const EventInfoCard: React.FC<EventInfoCardProps> = ({
  startsAt,
  endsAt,
  status,
}) => {
  const calculateDuration = () => {
    const duration =
      (new Date(endsAt).getTime() - new Date(startsAt).getTime()) /
      (1000 * 60 * 60);
    return Math.round(duration);
  };

  return (
    <Card className="mb-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        Event Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">
            Event Type
          </h4>
          <p className="text-slate-900">Public Event</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Admission</h4>
          <p className="text-slate-900">Free</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Duration</h4>
          <p className="text-slate-900">{calculateDuration()} hours</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Status</h4>
          <Badge variant={status.variant}>{status.text}</Badge>
        </div>
      </div>
    </Card>
  );
};
