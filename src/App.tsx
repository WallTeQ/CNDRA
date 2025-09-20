import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { SearchPage } from './pages/public/SearchPage';
import { DocumentDetails } from './pages/public/DocumentDetails';
import { NewsEventsPage } from './pages/public/NewsEventsPage';
import { NewsArticlePage } from './pages/public/NewsArticlePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

// Dashboard Pages
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { UploadDocument } from './pages/dashboard/UploadDocument';

// Other Pages
import { NotFound } from './pages/NotFound';

// Route Protection Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/document/:id" element={<DocumentDetails />} />
          <Route path="/news-events" element={<NewsEventsPage />} />
          <Route path="/news/:id" element={<NewsArticlePage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="upload" element={<UploadDocument />} />
            <Route path="documents" element={<div className="p-8"><h1 className="text-2xl font-bold">All Documents</h1><p>Document library coming soon...</p></div>} />
            <Route path="review" element={<div className="p-8"><h1 className="text-2xl font-bold">Review Requests</h1><p>Review system coming soon...</p></div>} />
            <Route path="users" element={<div className="p-8"><h1 className="text-2xl font-bold">User Management</h1><p>User management coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1><p>Settings page coming soon...</p></div>} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;