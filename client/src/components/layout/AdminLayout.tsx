import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminHeader from '../admin/AdminHeader';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1F3A] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium text-sm text-gray-300">Loading M.O.B Admin Portal...</p>
        </div>
      </div>
    );
  }

  // If not logged in or not admin, redirect to admin login
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#F8F8F6] text-[#171A1F]">
      {/* Standalone full-height fixed left sidebar - NO Storefront navbar above it */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
