import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Order } from '../../types';
import { User, Package, MapPin, Heart, Shield, LogOut } from 'lucide-react';

const navTabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
];

const statusStyles: Record<string, string> = {
  Delivered: 'text-emerald-700 bg-emerald-50',
  DELIVERED: 'text-emerald-700 bg-emerald-50',
  Processing: 'text-blue-700 bg-blue-50',
  PROCESSING: 'text-blue-700 bg-blue-50',
  Dispatched: 'text-amber-700 bg-amber-50',
  DISPATCHED: 'text-amber-700 bg-amber-50',
  CONFIRMED: 'text-blue-700 bg-blue-50',
  PENDING: 'text-amber-700 bg-amber-50',
  Cancelled: 'text-red-600 bg-red-50',
  CANCELLED: 'text-red-600 bg-red-50',
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [profileName, setProfileName] = useState(user?.name || 'Customer');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      setLoadingOrders(true);
      api.getUserOrders()
        .then((data) => setOrders(data))
        .catch((e) => console.error(e))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab, user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold">
          My Account
        </h1>
        <div className="flex items-center gap-3">
          {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0B1F3A] text-[#C9A227] text-xs font-semibold hover:bg-[#164A7A] transition-colors"
            >
              <Shield size={14} /> Admin Portal
            </Link>
          )}
          {user && (
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Navigation */}
        <aside className="w-full md:w-52 shrink-0">
          <nav className="flex md:flex-col gap-1">
            {navTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                  activeTab === id
                    ? 'bg-[#0B1F3A] text-white'
                    : 'text-[#6B7280] hover:text-[#0B1F3A] hover:bg-[#F8F8F6]'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Tab Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#E5E7EB] p-6 max-w-lg">
              <h2 className="font-serif text-lg text-[#0B1F3A] font-semibold mb-6">
                Profile Details
              </h2>
              {savedSuccess && (
                <p className="mb-4 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 border border-emerald-200">
                  Profile updated successfully!
                </p>
              )}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full border border-[#E5E7EB] px-3 py-2.5 text-sm bg-white outline-none focus:border-[#0B1F3A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full border border-[#E5E7EB] px-3 py-2.5 text-sm bg-white outline-none focus:border-[#0B1F3A] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0B1F3A] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+234 ..."
                    className="w-full border border-[#E5E7EB] px-3 py-2.5 text-sm bg-white outline-none focus:border-[#0B1F3A] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#0B1F3A] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#164A7A] transition-colors mt-2"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white border border-[#E5E7EB] p-6">
              <h2 className="font-serif text-lg text-[#0B1F3A] font-semibold mb-6">
                Order History
              </h2>
              {loadingOrders ? (
                <div className="py-12 text-center text-sm text-gray-500">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-[#6B7280] text-sm">
                  <Package size={28} className="mx-auto text-[#D1D5DB] mb-3" />
                  <p className="mb-4">You have not placed any orders yet.</p>
                  <Link
                    to="/shop"
                    className="text-sm font-medium text-[#164A7A] hover:text-[#0B1F3A]"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E7EB]">
                  {orders.map((order) => {
                    const statusClass =
                      statusStyles[order.orderStatus] || 'text-gray-700 bg-gray-50';
                    return (
                      <div
                        key={order.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-sm text-[#0B1F3A]">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-sm ${statusClass}`}
                            >
                              {order.orderStatus.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B7280] mt-1">
                            {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="font-semibold text-[#0B1F3A] text-sm">
                            ₦{order.totalAmount.toLocaleString()}
                          </span>
                          <Link
                            to={`/orders/${order.orderNumber}`}
                            className="text-xs font-medium text-[#164A7A] hover:text-[#0B1F3A] transition-colors"
                          >
                            Track Order →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="bg-white border border-[#E5E7EB] p-6 max-w-lg">
              <h2 className="font-serif text-lg text-[#0B1F3A] font-semibold mb-5">
                Saved Addresses
              </h2>
              <div className="border border-[#E5E7EB] p-4 mb-4">
                <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-wider mb-1">
                  Default Delivery Address
                </p>
                <p className="text-sm font-medium text-[#171A1F]">{profileName}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  2, Amu Street, Mushin Market, Lagos State
                </p>
                <p className="text-xs text-[#6B7280]">{profilePhone || '08108725967'}</p>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 className="font-serif text-lg text-[#0B1F3A] font-semibold mb-5">
                Wishlist
              </h2>
              <div className="py-16 text-center border border-dashed border-[#E5E7EB] bg-white">
                <Heart size={28} className="mx-auto text-[#D1D5DB] mb-3" />
                <p className="text-sm text-[#6B7280] mb-4">Your wishlist is empty</p>
                <Link
                  to="/shop"
                  className="text-sm font-medium text-[#164A7A] hover:text-[#0B1F3A] transition-colors"
                >
                  Browse products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
