import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-8xl mx-auto px-4 sm:px-12 lg:px-22 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="max-w-2xl lg:max-w-none">
            <div className="mb-6">
              <span className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                Republic of Liberia National Archives
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Preserving Liberia's Rich Heritage
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-slate-200 leading-relaxed">
              Discover the stories, documents, and treasures that chronicle
              Liberia's journey from its founding to the present day. Access our
              comprehensive digital collection of historical records,
              photographs, and cultural artifacts.
            </p>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              <Link to="/search" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Search Archives
                  
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            {/* <div className="mt-12 pt-8 border-t border-slate-600">
              <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">
                    50+
                  </div>
                  <div className="text-sm text-slate-300">Years of History</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">
                    50K+
                  </div>
                  <div className="text-sm text-slate-300">Digital Records</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">
                    1000+
                  </div>
                  <div className="text-sm text-slate-300">Collections</div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Column - Visual Element */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl transform rotate-6 opacity-20"></div>

              {/* Main content card */}
              <div className="relative bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-6">
                    Access digitized documents, photographs, maps, and more from
                    Liberia's national collection.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-sm">Historical Documents</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-sm">Government Records</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-sm">Cultural Heritage</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-sm">Maps & Photographs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
