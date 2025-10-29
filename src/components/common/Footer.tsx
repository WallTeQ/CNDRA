import React from "react";
import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center space-y-4">
          {/* Logo and Brand */}
          <div className="flex justify-center items-center space-x-3">
            <h3 className="text-xl font-bold text-white">Liberia National Archive</h3>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <Link
              to="/search"
              className=" hover:text-white transition-colors"
            >
              Search Archives
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              to="/about"
              className=" hover:text-white transition-colors"
            >
              About Us
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              to="/contact"
              className=" hover:text-white transition-colors"
            >
              Contact
            </Link>
            <span className="">•</span>
            <Link
              to="/privacy"
              className=" hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm ">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>(202) 357-5000</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@archive.gov</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t  pt-6">
            <p className="text-sm">
              © {currentYear} National Archive. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
