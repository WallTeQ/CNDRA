import React from "react";
import { Card } from "../../../components/ui/Card";

interface EventImportantNotesProps {
  isEventPast: boolean;
}

export const EventImportantNotes: React.FC<EventImportantNotesProps> = ({
  isEventPast,
}) => {
  if (isEventPast) {
    return null;
  }

  return (
    <Card className="mb-8 bg-red-50 border-red-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-3">
        Important Information
      </h3>
      <ul className="space-y-2 text-sm text-slate-700">
        <li className="flex items-start space-x-2">
          <span className="text-red-600 mt-0.5">•</span>
          <span>Please arrive 15 minutes before the event starts</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-red-600 mt-0.5">•</span>
          <span>Registration is required for this event</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-red-600 mt-0.5">•</span>
          <span>Photography and recording may be restricted</span>
        </li>
        <li className="flex items-start space-x-2">
          <span className="text-red-600 mt-0.5">•</span>
          <span>
            For accessibility requirements, please contact us in advance
          </span>
        </li>
      </ul>
    </Card>
  );
};
