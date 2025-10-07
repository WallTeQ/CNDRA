import React from "react";
import { Card } from "../../../components/ui/Card";

export const EventContactInfo: React.FC = () => {
  return (
    <Card className="mb-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        Contact & Inquiries
      </h3>
      <div className="space-y-3 text-slate-700">
        <p>For more information about this event, please contact:</p>
        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
          <p>
            <strong>Email:</strong> events@nationalarchive.gov.ng
          </p>
          <p>
            <strong>Phone:</strong> +234 (0) 123 456 7890
          </p>
          <p>
            <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM
          </p>
        </div>
      </div>
    </Card>
  );
};
