import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { formatDate, copyToClipboard } from "./recordUtils";

interface CitationSectionProps {
  record: any;
}

export function CitationSection({ record }: CitationSectionProps) {
  const formattedDate = formatDate(record.createdAt);
  const citationText = `"${record.title}." ${
    record.collection?.title || "Unknown Collection"
  }, ${formattedDate}. Web. ${formatDate(new Date().toISOString())}.`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Cite This Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm text-slate-700 font-mono leading-relaxed">
            {citationText}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => copyToClipboard(citationText)}
          >
            Copy Citation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
