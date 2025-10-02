import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAuth } from "./hooks/useAuth";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { ProtectedRoute } from "./components/common/protectedRoute";

// Public Pages
import { LandingPage } from "./pages/public/home/LandingPage";
import { SearchPage } from "./pages/public/search/SearchPage";
import { RecordDetailsPage } from "./pages/public/record-details/RecordDetails";
import { NewsEventsPage } from "./pages/public/NewsEventsPage";
import { NewsArticlePage } from "./pages/public/NewsArticlePage";
import PublicDepartmentsPage from "./pages/public/department/Departments";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";

// Dashboard Pages
import { DashboardHome } from "./pages/dashboard/overview/DashboardHome";
import UploadDocumentPage from "./pages/dashboard/UploadDocument";
import RecordsPage from "./pages/dashboard/record/Records";
import Users from "./pages/dashboard/Users";
import Settings from "./pages/dashboard/Settings";
import Reviews from "./pages/dashboard/Reviews";
import CollectionsPage from "./pages/dashboard/collection/Collections";
import DepartmentsPage from "./pages/dashboard/department/Department";

// Other Pages
import { NotFound } from "./pages/NotFound";

// App Content Component (needs to be inside Provider)
const AppContent: React.FC = () => {
  const { initializeAuth, isInitialized } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading only during initial app initialization (not during login)
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes with PublicLayout */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="departments" element={<PublicDepartmentsPage />} />
          <Route path="records/:id" element={<RecordDetailsPage />} />
          <Route path="news-events" element={<NewsEventsPage />} />
          <Route path="news/:id" element={<NewsArticlePage />} />
        </Route>

        {/* Auth Routes (standalone - no layout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Dashboard Routes - Admin and Super-Admin Only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="upload" element={<UploadDocumentPage />} />
          <Route path="documents" element={<RecordsPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="review" element={<Reviews />} />
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRoles={["admin", "super-admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
