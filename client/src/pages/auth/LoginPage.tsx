import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      const role = (loggedUser?.role || '').toUpperCase();
      const isAdminRole = ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'ORDER_MANAGER', 'INVENTORY_MANAGER'].includes(role);
      if (isAdminRole) {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-lg space-y-6">
      <div className="text-center space-y-1">
        <h2 className="font-serif font-bold text-2xl text-[#0B1F3A]">Welcome Back</h2>
        <p className="text-xs text-gray-500">Sign in to your M.O.B EKI account</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0B1F3A]"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-gray-700">Password</label>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0B1F3A]"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs hover:bg-[#164A7A] transition flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 text-[#C9A227]" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 text-xs text-gray-500">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-[#0B1F3A] hover:underline">
          Create Customer Account
        </Link>
      </div>
    </div>
  );
}
