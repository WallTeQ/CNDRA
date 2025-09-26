import React from "react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAuth } from "./hooks/useAuth";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/common/protectedRoute";

// Public Pages
import { LandingPage } from "./pages/public/LandingPage";
import { SearchPage } from "./pages/public/SearchPage";
import { RecordDetailsPage } from "./pages/public/DocumentDetails";
import { NewsEventsPage } from "./pages/public/NewsEventsPage";
import { NewsArticlePage } from "./pages/public/NewsArticlePage";
import PublicDepartmentsPage from "./pages/public/Departments";

// Auth Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";

// Dashboard Pages
import { DashboardHome } from "./pages/dashboard/DashboardHome";
import UploadDocumentPage from "./pages/dashboard/UploadDocument";
import Documents from "./pages/dashboard/Documents";
import Users from "./pages/dashboard/Users";
import Settings from "./pages/dashboard/Settings";
import Reviews from "./pages/dashboard/Reviews";
import CollectionsPage from "./pages/dashboard/Collections";
import DepartmentsPage from "./pages/dashboard/Department";
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
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/departments" element={<PublicDepartmentsPage />} />
        <Route path="/records/:id" element={<RecordDetailsPage />} />
        <Route path="/news-events" element={<NewsEventsPage />} />
        <Route path="/news/:id" element={<NewsArticlePage />} />

        {/* Auth Routes */}
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
          <Route path="documents" element={<Documents />} />
          <Route path="records" element={<Documents />} />
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
