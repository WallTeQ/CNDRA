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
  LayoutDashboard,
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
    // { name: "About", path: "/" },
    // { name: "Services", path: "/" },
    { name: "Collections", path: "/search" },
    { name: "Departments", path: "/departments" },
    // { name: "Request Access", path: "/request-access" },
    { name: "Confidential Records", path: "/confidential" },
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
      <div className="bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className=" p-2 rounded">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4LK9o6xiOCIMn5FAVs9kOsNrSmhkDfbkr-Qcttby_OwBB4HpiZEexSpzLRTBsHvEf1-w&usqp=CAU"
                    alt="National Archive Logo"
                    className="object-cover h-12 w-12"
                  />
                </div>
                <div className="">
                  <div className="text-2xl font-bold">Liberia National Archive</div>
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
                    className="flex-1 px-4 py-2 text-gray-900 bg-white border-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              <button className="hover:text-blue-200 transition-colors p-2">
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <a
                href="https://geo-trust-chain.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-white hover:bg-blue-600 hover:bg-opacity-50 rounded transition-colors text-sm"
              >
                Geo Trust
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                {(isAdmin() || isSuperAdmin()) ?   (
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 text-white rounded transition-colors text-sm"
                  >
                    <Button
                      icon={<LayoutDashboard className="h-4 w-4" />}
                      className="bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : <Link
                  to="/profile"
                  className="px-3 py-2 text-white rounded transition-colors text-sm"
                >
                  <Button
                    icon={<User className="h-4 w-4" />}
                    className="bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                  >
                    Profile
                  </Button>
                </Link>}
              </div>
              <div className="hidden md:flex items-center">
                {/* display Login Button or logout if there is a user */}
                <div className="hidden md:flex items-center space-x-2">
                  {user ? (
                    <Button
                      onClick={handleLogout}
                      icon={<User className="h-4 w-4" />}
                      className="bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      icon={<User className="h-4 w-4" />}
                      className="bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                    >
                      Login
                    </Button>
                  )}
                </div>
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
              <div className="">
                {(isAdmin() || isSuperAdmin()) && (
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 text-white hover:bg-blue-600 hover:bg-opacity-50 rounded transition-colors text-sm"
                  >
                    <Button
                      icon={<LayoutDashboard className="h-4 w-4" />}
                      className="bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
              </div>
              {user ? (
                <div className="pt-2">
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    icon={<User className="h-4 w-4" />}
                    className="w-full bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div>
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    icon={<User className="h-4 w-4" />}
                    className="w-full bg-transparent hover:bg-blue-600 hover:bg-opacity-50 text-white border border-blue-300 border-opacity-50"
                  >
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
