import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6] text-[#171A1F]">
      {/* Clean minimal top bar */}
      <header className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-[#C9A227] font-serif font-bold text-xl shadow-sm">
            M
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wide text-[#0B1F3A] block leading-tight">
              M.O.B EKI VENTURES
            </span>
            <span className="text-[9px] uppercase tracking-wider text-gray-500 block font-semibold">
              FURNITURE ACCESSORIES & FITTINGS
            </span>
          </div>
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
