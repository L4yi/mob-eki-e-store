import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, User as UserIcon, ShoppingCart, Menu, X, Shield, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop', label: 'Categories' },
    { to: '/about', label: 'About' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchModal(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col leading-none shrink-0">
          <span className="font-serif text-base font-semibold text-[#0B1F3A] tracking-wide uppercase">
            M.O.B EKI VENTURES
          </span>
          <span className="text-[10px] text-[#6B7280] tracking-widest uppercase mt-0.5">
            Furniture Accessories
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[#0B1F3A] border-b-2 border-[#C9A227] pb-0.5'
                    : 'text-[#6B7280] hover:text-[#0B1F3A]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a
            href="/#store"
            onClick={(e) => {
              if (window.location.pathname !== '/') {
                navigate('/#store');
              } else {
                const el = document.getElementById('store');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm font-medium text-[#6B7280] hover:text-[#0B1F3A] transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Right Icon Actions */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            aria-label="Search"
            className="hidden md:flex text-[#6B7280] hover:text-[#0B1F3A] transition-colors p-1"
          >
            <Search size={18} />
          </button>

          {/* Account Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="Account"
                className="hidden md:flex items-center gap-1.5 text-[#6B7280] hover:text-[#0B1F3A] transition-colors p-1"
              >
                <div className="w-6 h-6 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>
            ) : (
              <Link
                to="/login"
                aria-label="Account"
                className="hidden md:flex text-[#6B7280] hover:text-[#0B1F3A] transition-colors p-1"
              >
                <UserIcon size={18} />
              </Link>
            )}

            {/* User Dropdown */}
            {user && userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E5E7EB] shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-[#0B1F3A] truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                </div>

                {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                  <Link
                    to="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0B1F3A] hover:bg-gray-50 transition"
                  >
                    <Shield size={14} className="text-[#C9A227]" />
                    Admin Portal
                  </Link>
                )}

                <Link
                  to="/account"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                >
                  <UserIcon size={14} />
                  My Orders & Profile
                </Link>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon with Gold Badge */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative text-[#6B7280] hover:text-[#0B1F3A] transition-colors p-1"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C9A227] text-[#0B1F3A] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-[#0B1F3A] p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E7EB] px-4 pb-4">
          <nav className="flex flex-col gap-3 pt-4">
            {navLinks.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className="text-sm font-medium text-[#171A1F] hover:text-[#C9A227] py-1 border-b border-[#F3F4F6]"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href="/#store"
              className="text-sm font-medium text-[#171A1F] hover:text-[#C9A227] py-1 border-b border-[#F3F4F6]"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowSearchModal(true);
                }}
                className="flex items-center gap-2 text-sm text-[#6B7280]"
              >
                <Search size={16} /> Search
              </button>
              {user ? (
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-sm text-[#6B7280]"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserIcon size={16} /> {user.name}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm text-[#6B7280]"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserIcon size={16} /> Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24 px-4">
          <div className="bg-white w-full max-w-lg p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-semibold text-[#0B1F3A]">
                Search Catalogue
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Search handles, knobs, hinges, locks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B1F3A]"
              />
              <button
                type="submit"
                className="bg-[#0B1F3A] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#164A7A]"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
