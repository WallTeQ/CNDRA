import React from "react";
import { Card } from "../../../components/ui/Card";
import { Activity } from "../../../types/activity";

interface RecentActivityProps {
  activities: Activity[];
  title?: string;
  description?: string;
  maxItems?: number;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  title = "Recent Activity",
  description = "Latest actions performed on the archive system.",
  maxItems = 4,
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return "text-green-600 bg-green-100";
      case "view":
        return "text-red-600 bg-red-100";
      case "download":
        return "text-purple-600 bg-purple-100";
      case "edit":
        return "text-orange-600 bg-orange-100";
      case "delete":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {displayedActivities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== displayedActivities.length - 1 ? (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div
                    className={`relative px-1 ${getActivityIcon(
                      activity.type
                    )} rounded-full flex items-center justify-center h-10 w-10`}
                  >
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {activity.user}
                        </span>{" "}
                        <span className="text-gray-600">{activity.action}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-600">
                        {activity.resource}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
