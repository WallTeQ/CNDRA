import React from "react";
import { Card } from "../../../components/ui/Card";

interface EventDescriptionProps {
  description: string;
}

export const EventDescription: React.FC<EventDescriptionProps> = ({
  description,
}) => {
  const renderDescription = () => {
    return description.split("\n\n").map((paragraph, index) => {
      // Check if it's HTML content
      if (paragraph.includes("<p>")) {
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: paragraph }}
            className="text-slate-700 leading-relaxed mb-4"
          />
        );
      }
      return (
        <p key={index} className="text-slate-700 leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <Card className="mb-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        About This Event
      </h3>
      <div className="prose prose-slate prose-lg max-w-none">
        {renderDescription()}
      </div>
    </Card>
  );
};
