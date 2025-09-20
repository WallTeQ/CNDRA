import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, Users, Shield, ArrowRight } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: 'Advanced Search',
      description: 'Search through millions of documents using keywords, dates, authors, and advanced filters.'
    },
    {
      icon: <Book className="h-8 w-8 text-green-600" />,
      title: 'Digital Collections',
      description: 'Access digitized historical documents, photographs, maps, and multimedia content.'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Public Access',
      description: 'Open access to selected archives for researchers, students, and the general public.'
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-600" />,
      title: 'Secure Preservation',
      description: 'State-of-the-art preservation techniques ensure documents remain accessible for future generations.'
    }
  ];

  const collections = [
    {
      title: 'Colonial Era Records',
      description: 'Documents from the founding of our nation',
      count: '12,000+ documents',
      image: 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'Civil War Archives',
      description: 'Letters, photographs, and official records',
      count: '25,000+ documents',
      image: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      title: 'Industrial Revolution',
      description: 'Documentation of American industrialization',
      count: '18,000+ documents',
      image: 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Preserving History for Future Generations
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-200">
              Access millions of historical documents, photographs, and records from our nation's archives. 
              Discover the stories that shaped our past and continue to influence our future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/search">
                <Button size="lg" className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Our Records</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="bg-white text-slate-900 border-white hover:bg-slate-100">
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Use the Archive</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our digital archive system provides powerful tools for researchers, historians, and the public 
              to discover and access historical documents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center" hover>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Collections</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Browse our featured collections spanning centuries of American history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Card key={index} className="overflow-hidden p-0" hover>
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {collection.title}
                  </h3>
                  <p className="text-slate-600 mb-3">
                    {collection.description}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {collection.count}
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Latest News & Events</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Stay informed about new acquisitions, research opportunities, and upcoming events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card hover>
              <div className="p-6">
                <Badge variant="success" size="sm" className="mb-3">
                  Announcement
                </Badge>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  New Digital Collection Available
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Over 5,000 Civil War letters have been digitized and are now accessible online.
                </p>
                <Link to="/news-events" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Read More →
                </Link>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <Badge variant="info" size="sm" className="mb-3">
                  Exhibition
                </Badge>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Founding Fathers Exhibition
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Explore original documents from America's founding era opening February 1st.
                </p>
                <Link to="/news-events" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Learn More →
                </Link>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <Badge variant="warning" size="sm" className="mb-3">
                  Workshop
                </Badge>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Digital Research Methods
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Learn to effectively search our digital collections. Registration required.
                </p>
                <Link to="/news-events" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Register →
                </Link>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/news-events">
              <Button size="lg" variant="outline">View All News & Events</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About the Archive</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  The National Archive serves as the cornerstone of our nation's historical preservation efforts. 
                  For over a century, we have been dedicated to collecting, preserving, and providing access to 
                  the documents that tell the story of our country.
                </p>
                <p>
                  Our collection includes millions of documents, photographs, maps, and multimedia materials 
                  spanning from the colonial period to the present day. Through advanced digitization efforts, 
                  we make these invaluable resources accessible to researchers worldwide.
                </p>
                <p>
                  Whether you're a professional historian, a student working on a research project, or simply 
                  curious about our nation's past, our archive provides the tools and resources you need to 
                  explore and discover.
                </p>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/1068166/pexels-photo-1068166.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Archive interior"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};