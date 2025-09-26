import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Archive,
  HelpCircle,
  // Globe,
  // Eye,
  User,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  isPublic?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();

  const publicNavItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/" },
    { name: "Services", path: "/" },
    { name: "Collections", path: "/search" },
    { name: "News/Events", path: "/news-events" },
    // { name: "Resources", path: "/resources" },
    // { name: "Related Repositories", path: "/repositories" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 sticky top-0 z-50">
      {/* Top Section with Logo and Search */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded">
                  <Archive className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-white">
                  <div className="text-2xl font-bold">National Archive</div>
                  <div className="text-sm opacity-90">Digital Library</div>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for:"
                    className="flex-1 px-4 py-2 text-gray-900 bg-white border-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-md border-l border-gray-300 transition-colors"
                  >
                    <Search className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-3">
              <button className="text-white hover:text-blue-200 transition-colors p-2">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-white hover:text-blue-200 transition-colors p-2">
                <HelpCircle className="h-5 w-5" />
              </button>
             
              
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 text-white hover:bg-blue-600 hover:bg-opacity-50 rounded transition-colors text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* display Login Button or logout if there is a user */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  {(isAdmin() !== null || isSuperAdmin() !== null) && (
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="flex items-center space-x-2 bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                    >
                      <Archive className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  )}
                  <Button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                  >
                    <User className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-blue-600 hover:bg-opacity-50"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-gradient-to-r from-blue-500 to-blue-600 px-4 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for:"
              className="flex-1 px-4 py-2 text-gray-900 bg-white border-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-md border-l border-gray-300 transition-colors"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-600">
          <div className="px-4 py-4">
            <div className="flex flex-col space-y-2">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 text-white hover:bg-blue-600 hover:bg-opacity-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ?  (
                <div className="pt-2 space-y-2">
                  {(isAdmin() !== null || isSuperAdmin() !== null) && (
                    <Button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Logout {isSuperAdmin() || isAdmin() ? `(${isSuperAdmin() || isAdmin()})` : ''}
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
