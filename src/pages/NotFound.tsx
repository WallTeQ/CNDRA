import React from 'react';
import { Link } from 'react-router-dom';
import { Archive, Home, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Archive className="mx-auto h-16 w-16 text-blue-600" />
          <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-4 text-lg text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            The document or page you requested may have been moved, deleted, or never existed.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <Link to="/">
              <Button icon={<Home className="h-4 w-4" />}>
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <Link to="/search">
              <Button variant="outline" icon={<Search className="h-4 w-4" />}>
                Search Archives
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Helpful Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/search" className="text-blue-600 hover:text-blue-700">
                Search our document archive
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-blue-600 hover:text-blue-700">
                Learn about our archive
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-blue-600 hover:text-blue-700">
                Contact our support team
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Staff login portal
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};