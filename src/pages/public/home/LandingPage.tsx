import React from "react";
import FeaturedDepartments from "../../../components/FeaturedDepartment";
import FeaturedRecords from "../../../components/FeautredRecord";

// Import the separated components
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeatureSection";
// import { CollectionsSection } from "./CollectionSection";
import { NewsEventsSection } from "./NewsEventSection";
import { AboutSection } from "./AboutSection";

export const LandingPage: React.FC = () => {
  // const dispatch = useAppDispatch();
  // const { records} = useAppSelector(
  //   (state) => state.records
  // );

  // useEffect(() => {
  //   dispatch(fetchRecords());
  // }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <FeaturesSection />
      <FeaturedRecords />
      <FeaturedDepartments />
      {/* <CollectionsSection records={records} /> */}
      <NewsEventsSection />
      <AboutSection />
    </div>
  );
};