import React from "react";
import { Button } from "../../../components/ui/Button";

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-12 lg:px-22">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-4">
              <span className="inline-block bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                About Us
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              Preserving Liberia's Legacy for Future Generations
            </h2>
            <div className="space-y-4 text-slate-600 text-lg">
              <p>
                The Republic of Liberia National Archives serves as the guardian
                of our nation's historical heritage. Since our establishment, we
                have been dedicated to collecting, preserving, and providing
                access to the documents that chronicle Liberia's unique story.
              </p>
              <p>
                Our collection includes millions of documents, photographs,
                maps, and multimedia materials spanning from Liberia's founding
                in 1847 to the present day. Through advanced digitization
                efforts, we make these invaluable resources accessible to
                researchers, students, and citizens worldwide.
              </p>
              <p>
                Whether you're researching Liberia's founding fathers, exploring
                our rich cultural heritage, or studying contemporary
                developments, our digital library provides comprehensive
                resources to support your journey of discovery.
              </p>
            </div>
            {/* <div className="mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Learn More About Our Mission
              </Button>
            </div> */}
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-slate-800 rounded-lg transform rotate-6"></div>
            <img
              src="https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Liberian National Archives interior showing historical documents and research facilities"
              className="relative rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
