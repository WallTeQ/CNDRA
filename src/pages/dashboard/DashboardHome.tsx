import React from 'react';
import { FileText, Clock, Users, TrendingUp, Upload, Eye, Download } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { mockDocuments } from '../../data/mockData';
import { useAuth } from '../../hooks/useAuth';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Documents',
      value: '12,847',
      change: '+12%',
      changeType: 'increase',
      icon: FileText,
      color: 'blue'
    },
    {
      name: 'Pending Reviews',
      value: '23',
      change: '-5%',
      changeType: 'decrease',
      icon: Clock,
      color: 'yellow'
    },
    {
      name: 'New Uploads',
      value: '156',
      change: '+23%',
      changeType: 'increase',
      icon: Upload,
      color: 'green'
    },
    {
      name: 'Active Users',
      value: '1,247',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'purple'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'upload',
      user: 'Dr. Sarah Wilson',
      action: 'uploaded a new document',
      resource: 'Colonial Settlement Records - Boston 1630',
      time: '2 hours ago',
      icon: Upload
    },
    {
      id: '2',
      type: 'view',
      user: 'Public User',
      action: 'viewed document',
      resource: 'Civil War Correspondence - General Grant',
      time: '3 hours ago',
      icon: Eye
    },
    {
      id: '3',
      type: 'download',
      user: 'Dr. Michael Chen',
      action: 'downloaded document',
      resource: 'Industrial Revolution Factory Photos',
      time: '5 hours ago',
      icon: Download
    },
    {
      id: '4',
      type: 'upload',
      user: 'Dr. Sarah Wilson',
      action: 'uploaded a new document',
      resource: 'Treaty Documents - 1783',
      time: '1 day ago',
      icon: Upload
    }
  ];

  const getStatColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'text-blue-600 bg-blue-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100'
    };
    return colors[color];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return 'text-green-600 bg-green-100';
      case 'view':
        return 'text-blue-600 bg-blue-100';
      case 'download':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your archive today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name} padding="sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                        <span className="sr-only">
                          {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <p className="mt-1 text-sm text-gray-600">
                Latest actions performed on the archive system.
              </p>
            </div>
            
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className={`relative px-1 ${getActivityIcon(activity.type)} rounded-full flex items-center justify-center h-10 w-10`}>
                          <activity.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">
                                {activity.user}
                              </span>{' '}
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

          {/* Recent Documents */}
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Documents</h3>
              <p className="mt-1 text-sm text-gray-600">
                Recently uploaded and reviewed documents.
              </p>
            </div>

            <div className="space-y-4">
              {mockDocuments.slice(0, 4).map((document) => (
                <div key={document.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    {document.previewUrl ? (
                      <img
                        src={document.previewUrl}
                        alt={document.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {document.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {document.author || 'Unknown'}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <Badge variant="info" size="sm" className="capitalize">
                        {document.type}
                      </Badge>
                      <Badge variant="success" size="sm" className="capitalize">
                        {document.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};