import { ExternalLink, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export function UsageRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Rights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Public Domain
              </p>
              <p className="text-xs text-slate-600">
                Free to use for any purpose
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Research Permitted
              </p>
              <p className="text-xs text-slate-600">
                Academic and scholarly use allowed
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Attribution Required
              </p>
              <p className="text-xs text-slate-600">
                Please cite the National Archive
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function HelpSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Need Help?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Have questions about this document or need assistance with your
            research?
          </p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              icon={<ExternalLink className="h-4 w-4 mr-2" />}
            >
              Contact Research Services
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              icon={<MapPin className="h-4 w-4 mr-2" />}
            >
              Visit Reading Room
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
