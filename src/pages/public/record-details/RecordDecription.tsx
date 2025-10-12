import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";

interface DocumentDescriptionProps {
  description: string;
}

export function DocumentDescription({ description }: DocumentDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About This Document</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed text-lg">
            <span dangerouslySetInnerHTML={{ __html: description }} />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
