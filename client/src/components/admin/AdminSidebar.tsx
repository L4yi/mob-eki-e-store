import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  CreditCard,
  Settings,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Inventory & Ledger', path: '/admin/inventory', icon: Boxes },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Payment Transactions', path: '/admin/payments', icon: CreditCard },
    { label: 'Store Settings & Team', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-[#0B1F3A] text-white flex flex-col justify-between border-r border-white/10 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#C9A227] flex items-center justify-center text-[#0B1F3A] font-serif font-bold text-xl shadow-md">
            M
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm text-white tracking-wide leading-tight">
              M.O.B EKI ADMIN
            </h2>
            <span className="text-[10px] text-[#C9A227] uppercase tracking-wider font-semibold block">
              MUSHIN MANAGEMENT
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Signed in as:
          </p>
          <p className="text-xs font-bold text-white truncate mt-0.5">{user?.name || 'M.O.B Admin'}</p>
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#C9A227] text-[#0B1F3A]">
            {user?.role || 'SUPERADMIN'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#164A7A] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Storefront link */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          to="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#C9A227]" />
            <span>Return to Storefront</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </Link>
        <p className="text-[10px] text-gray-400 text-center">
          M.O.B EKI VENTURES © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
