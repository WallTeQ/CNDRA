import { Tag } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";

interface TagsKeywordsSectionProps {
  subjectTags: string[];
}

export function TagsKeywordsSection({ subjectTags }: TagsKeywordsSectionProps) {
  if (subjectTags?.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags and Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {subjectTags?.map((tag, index) => (
            <Link
              key={index}
              to={`/search?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors"
            >
              <Tag className="h-3 w-3" />
              <span>{tag.term}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
