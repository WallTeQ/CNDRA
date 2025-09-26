import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Book,
  Users,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Header } from "../../components/common/Header";
import { Footer } from "../../components/common/Footer";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import  FeaturedNewsSection from "../../components/FeaturedNews";
import FeaturedDepartments from "../../components/FeaturedDepartment";
import { fetchRecords } from "../../store/slices/records/recordsThunk";
import { useAppDispatch, useAppSelector } from "../../store";

export const LandingPage: React.FC = () => {
  const dispatch = useAppDispatch();
   const { records, isLoading, error } = useAppSelector(
      (state) => state.records
    );

     useEffect(() => {
        dispatch(fetchRecords());
       
      }, [dispatch]);
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
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

  const collections = [
    {
      title: "Colonial Era Records",
      description: "Documents from the founding of our nation",
      count: "12,000+ documents",
      image:
        "https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      title: "Civil War Archives",
      description: "Letters, photographs, and official records",
      count: "25,000+ documents",
      image:
        "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
    {
      title: "Industrial Revolution",
      description: "Documentation of American industrialization",
      count: "18,000+ documents",
      image:
        "https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=300",
    },
  ];

  // const getEventTypeColor = (type: string) => {
  //   const colors: {
  //     [key: string]: "default" | "success" | "warning" | "danger" | "info";
  //   } = {
  //     exhibition: "info",
  //     workshop: "warning",
  //     lecture: "success",
  //     tour: "default",
  //     conference: "danger",
  //   };
  //   return colors[type] || "default";
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(data:image/jpeg;base64,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)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Preserving History for Future Generations
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-200">
              Access millions of historical documents, photographs, and records
              from our nation's archives. Discover the stories that shaped our
              past and continue to influence our future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/search">
                <Button size="lg" className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Our Records</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-slate-900 border-white hover:bg-slate-100"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How to Use the Archive
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our digital archive system provides powerful tools for
              researchers, historians, and the public to discover and access
              historical documents.
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

      <FeaturedDepartments />

      {/* Collections Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Explore Collections
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Browse our featured collections spanning centuries of American
              history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {records.map((record, index) => (
              <Card key={index} className="overflow-hidden p-0" hover>
                <img
                  src={record.fileAssets[0]?.storagePath}
                  alt={record.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {record.title}
                  </h3>
                  <p className="text-slate-600 mb-3">
                    {record.description}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {record.fileAssets.length} items
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/search">
              <Button size="lg">View All Collections</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News & Events Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Latest News & Events
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Stay informed about new acquisitions, research opportunities, and
              upcoming events.
            </p>
          </div>
          <div>
            <FeaturedNewsSection />
          </div>

          <div className="text-center mt-8">
            <Link to="/news-events">
              <Button size="lg" variant="outline">
                View All News & Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  About Us
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Preserving History for Future Generations
              </h2>
              <div className="space-y-4 text-slate-600 text-lg">
                <p>
                  The National Archive Digital Library serves as the cornerstone
                  of our nation's historical preservation efforts. For over a
                  century, we have been dedicated to collecting, preserving, and
                  providing access to the documents that tell the story of our
                  country.
                </p>
                <p>
                  Our collection includes millions of documents, photographs,
                  maps, and multimedia materials spanning from the colonial
                  period to the present day. Through advanced digitization
                  efforts, we make these invaluable resources accessible to
                  researchers worldwide.
                </p>
                <p>
                  Whether you're a professional historian, a student working on
                  a research project, or simply curious about our nation's past,
                  our digital library provides the tools and resources you need
                  to explore and discover.
                </p>
              </div>
              <div className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Learn More About Us
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg transform rotate-6"></div>
              <img
                src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&fit=crop"
                alt="Archive interior"
                className="relative rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
