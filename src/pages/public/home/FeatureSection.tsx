import React from "react";
import { Search, Book, Users, Shield } from "lucide-react";
import { Card } from "../../../components/ui/Card";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-red-600" />,
      title: "Advanced Search",
      description:
        "Search through millions of documents using keywords, dates, authors, and advanced filters.",
    },
    {
      icon: <Book className="h-8 w-8 text-green-600" />,
      title: "Digital Collections",
      description:
        "Access digitized historical documents, photographs, maps, and multimedia content.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Public Access",
      description:
        "Open access to selected archives for researchers, students, and the general public.",
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      title: "Secure Preservation",
      description:
        "State-of-the-art preservation techniques ensure documents remain accessible for future generations.",
    },
  ];

  return (
    <section className="pt-16 pb-4">
      <div className="max-w-8xl mx-auto px-4 sm:px-12 lg:px-22">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            How to Use the Archive
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our digital archive system provides powerful tools for researchers,
            historians, and the public to discover and access historical
            documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center" hover>
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
