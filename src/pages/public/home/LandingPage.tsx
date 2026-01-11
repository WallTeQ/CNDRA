import React from "react";
import FeaturedDepartments from "../../../components/FeaturedDepartment";
import FeaturedRecords from "../../../components/FeautredRecord";

// Import the separated components
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeatureSection";
// import { CollectionsSection } from "./CollectionSection";
import { NewsEventsSection } from "./NewsEventSection";
import { AboutSection } from "./AboutSection";
import LiberiaMapHero from "../../../components/map";
import ExploreHero from "./Hero2";

export const LandingPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <LiberiaMapHero />
      {/* <HeroSection /> */}
      <ExploreHero />
      <FeaturesSection />
      <FeaturedRecords />
      {/* <FeaturedDepartments /> */}
      {/* <CollectionsSection records={records} /> */}
      <NewsEventsSection />
      <AboutSection />
    </div>
  );
};