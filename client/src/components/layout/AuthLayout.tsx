import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6] text-[#171A1F]">
      {/* Clean minimal top bar */}
      <header className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <BrandLogo variant="dark" size="sm" />
        </Link>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#0B1F3A] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Clean minimal bottom copyright - NO Storefront footer */}
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
        © {new Date().getFullYear()} M.O.B EKI VENTURES. All rights reserved.
      </footer>
    </div>
  );
}
