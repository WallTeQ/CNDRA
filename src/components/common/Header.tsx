import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Archive } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  isPublic?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isPublic = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'News & Events', path: '/news-events' },
    // { name: 'About', path: '/about' },
    // { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Archive className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">National Archive</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {publicNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isPublic && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/search')}
                  className="flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Staff Login
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isPublic && (
                <>
                  <Link
                    to="/search"
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors flex items-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Link>
                  <div className="px-3 pt-2">
                    <Button 
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }} 
                      className="w-full"
                    >
                      Staff Login
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};