import React from "react";
import { Link } from "react-router-dom";

export default function ExploreHero() {
  return (
    <section className="relative md:h-96  flex flex-col overflow-hidden bg-slate-200">
      {/* Hero Image - Hidden on mobile, shown on md+ */}
      <div className="hidden md:block absolute top-0 right-0 w-1/2 lg:w-[45%] h-full">
        <img
          src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&h=1600&fit=crop"
          alt="Researcher examining historical documents"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mobile Image - Shown only on mobile */}
      <div className="block md:hidden w-full h-64 sm:h-80">
        <img
          src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&h=1600&fit=crop"
          alt="Researcher examining historical documents"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col justify-between flex-1 px-6 py-8 sm:px-12 sm:py-12 lg:px-16 lg:py-16 max-w-7xl w-full">
        {/* Hero Text */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-slate-900 mb-2 md:mb-4 leading-tight">
            Explore
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-slate-700 font-light">
            Liberia's years of history and records
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 lg:gap-6">
          
          <Link
            to="search"
            className="inline-block bg-slate-900 text-white px-6 py-3 md:px-10 md:py-5 text-sm md:text-base lg:text-lg font-normal border-2 border-slate-900 transition-all duration-200 hover:bg-slate-800 hover:border-slate-800 hover:shadow-lg text-center whitespace-nowrap"
          >
            Search the catalogue
          </Link>
          
        </div>
      </div>
    </section>
  );
}
