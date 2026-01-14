import React from "react";
import { Card } from "../../../components/ui/Card";

interface ArticleContentProps {
  content: string;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  const renderContent = () => {
    // Check if content is HTML
    if (content.includes("<p>") || content.includes("<")) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-slate-700 leading-relaxed"
        />
      );
    }

    // Plain text content with special formatting
    return content.split("\n\n").map((paragraph, index) => {
      // Check for special formatting like lists
      if (
        paragraph.startsWith("Key highlights") ||
        paragraph.startsWith("The donation includes") ||
        paragraph.startsWith("Fellowship Benefits") ||
        paragraph.startsWith("Tour highlights")
      ) {
        const [title, ...items] = paragraph.split("\n");
        return (
          <div key={index} className="my-6">
            <p className="font-semibold text-slate-900 mb-3">{title}</p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{item.replace(/^- /, "")}</li>
              ))}
            </ul>
          </div>
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
    <div className="mb-8">
      <div className="prose prose-slate prose-lg max-w-none">
        {renderContent()}
      </div>
    </div>
  );
};
