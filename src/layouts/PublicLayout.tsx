import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isPublic={true} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
