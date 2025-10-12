import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Archive,
  LayoutDashboard,
  // Upload,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ClipboardCheck,
  Building,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // { name: "Upload Document", href: "/dashboard/upload", icon: Upload },
  { name: "Records", href: "/dashboard/records", icon: FileText },
  { name: "Departments", href: "/dashboard/departments", icon: Users },
  { name: "Collections", href: "/dashboard/collections", icon: ClipboardCheck },
  {
    name: "Access Requests",
    href: "/dashboard/access-requests",
    icon: ClipboardCheck,
  },
  { name: "Publications", href: "/dashboard/governance", icon: Building },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole, hasAnyRole } = useAuth();
  console.log("current user:", user);

  const handleLogout = () => {
    logout().then(() => {
      navigate("/");
    });
  };

  // Get user's primary role for display
  const getUserRole = () => {
    if (!user?.roles || user.roles.length === 0) return "User";

    // Prioritize admin roles for display
    if (hasRole("super-admin")) return "Super Admin";
    if (hasRole("admin")) return "Admin";

    // Return the first role name
    return user.roles[0].name;
  };

  // Get user's display name
  const getUserDisplayName = () => {
    return user?.displayName || user?.email || "User";
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Filter navigation items based on user roles
  const getFilteredNavigation = () => {
    return navigation.filter((item) => {
      // Users management is only for admins and super-admins
      if (item.href === "/dashboard/users") {
        return hasAnyRole(["admin", "super-admin"]);
      }
      return true;
    });
  };

  const filteredNavigation = getFilteredNavigation();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transform transition ease-in-out duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* <Link to="/">
          <div className="flex-shrink-0 flex items-center px-4">
            <Archive className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-xl font-bold text-slate-900">
              Archive
            </span>
          </div>
          </Link> */}
           <Link to="/" className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className=" p-2 rounded">
                            <img
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4LK9o6xiOCIMn5FAVs9kOsNrSmhkDfbkr-Qcttby_OwBB4HpiZEexSpzLRTBsHvEf1-w&usqp=CAU"
                              alt="National Archive Logo"
                              className="object-cover h-10 w-10"
                            />
                          </div>
                          <div className="">
                            <div className="text-lg font-bold">National Archive</div>
                            <div className="text-xs opacity-90">Digital Library</div>
                          </div>
                        </div>
                      </Link>

          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? "bg-red-100 text-red-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 ${
                        isActive
                          ? "text-red-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex-shrink-0 w-14">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
             <Link to="/" className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3">
                            <div className=" p-2 rounded">
                              <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4LK9o6xiOCIMn5FAVs9kOsNrSmhkDfbkr-Qcttby_OwBB4HpiZEexSpzLRTBsHvEf1-w&usqp=CAU"
                                alt="National Archive Logo"
                                className="object-cover h-10 w-10"
                              />
                            </div>
                            <div className="">
                              <div className="text-lg font-bold">National Archive</div>
                              <div className="text-xs opacity-90">Digital Library</div>
                            </div>
                          </div>
                        </Link>
            <div className="flex-1 flex flex-col overflow-y-auto bg-white border-r border-gray-200">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-red-100 text-red-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${
                          isActive
                            ? "text-red-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User section */}
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {getUserInitials()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {getUserRole()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="ml-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 focus:placeholder-gray-400 sm:text-sm"
                    placeholder="Search documents..."
                    type="search"
                  />
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {getUserRole()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
