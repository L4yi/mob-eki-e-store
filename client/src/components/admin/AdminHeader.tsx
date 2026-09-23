import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, LogOut, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-gray-700">Mushin Market HQ</span>
        </div>
        <span className="text-gray-300">|</span>
        <span className="text-xs text-gray-500 hidden sm:inline">
          Furniture Hardware Management System
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <Store className="w-3.5 h-3.5 text-[#C9A227]" />
          View Live Store
        </Link>

        <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900 leading-none">{user?.name || 'M.O.B Admin'}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
            title="Sign Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
