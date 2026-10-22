import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../lib/api';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Search,
  RotateCw,
  Building2,
  DollarSign,
  ShieldCheck,
  X,
  Copy,
  Check,
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadPayments = (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    api
      .getPaymentTransactions()
      .then((data) => setPayments(data))
      .catch((e) => console.error(e))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalTransactions = payments.length;
    const paidPayments = payments.filter((p) => p.paymentStatus === 'PAID' || p.status === 'PAID');
    const pendingPayments = payments.filter((p) => p.paymentStatus === 'PENDING' || p.status === 'PENDING');
    const totalRevenue = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingVolume = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      totalTransactions,
      paidCount: paidPayments.length,
      pendingCount: pendingPayments.length,
      totalRevenue,
      pendingVolume,
    };
  }, [payments]);

  // Filtered
  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) return payments;
    const q = searchQuery.toLowerCase().trim();
    return payments.filter(
      (p) =>
        (p.orderNumber && p.orderNumber.toLowerCase().includes(q)) ||
        (p.customerName && p.customerName.toLowerCase().includes(q)) ||
        (p.providerReference && p.providerReference.toLowerCase().includes(q)) ||
        (p.method && p.method.toLowerCase().includes(q))
    );
  }, [payments, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
              Treasury & Audit
            </span>
            <span className="text-xs text-gray-400">&bull;</span>
            <span className="text-xs text-gray-500 font-medium">Financial Reconciliation</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
            Payment Reconciliation & Audit Log
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit trail of verified direct bank transfers (OPay: 8025262598 - Olaide Oladejo) and online gateway transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadPayments(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RotateCw size={13} className={refreshing ? 'animate-spin text-[#0B1F3A]' : ''} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* KPI Cards (easyui.site) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Revenue</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl font-bold text-[#0B1F3A] font-serif">
            ₦{metrics.totalRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">{metrics.paidCount} verified bank payments</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Verification</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-bold text-[#0B1F3A] font-serif">
            ₦{metrics.pendingVolume.toLocaleString()}
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">{metrics.pendingCount} awaiting receipt check</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-[#0B1F3A] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Transactions</span>
            <CreditCard size={16} />
          </div>
          <div className="text-2xl font-bold text-[#0B1F3A] font-serif">
            {metrics.totalTransactions}
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">Recorded in Supabase database</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, customer, or payment method..."
            className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#0B1F3A] focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">
          {filteredPayments.length} records shown
        </span>
      </div>

      {/* Modern Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#0B1F3A] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500 font-medium">Loading transactions from Supabase ledger...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-100">
              <CreditCard size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">No payment transactions found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Payments are recorded automatically when orders are confirmed or placed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-gray-600 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Channel / Method</th>
                  <th className="py-3.5 px-4">Amount (₦)</th>
                  <th className="py-3.5 px-4">Verification Audit</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((pay) => {
                  const isPaid = pay.paymentStatus === 'PAID' || pay.status === 'PAID';
                  return (
                    <tr key={pay.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                        {new Date(pay.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-gray-900">{pay.orderNumber}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(pay.orderNumber, pay.id + '-ref')}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy Order Ref"
                          >
                            {copiedKey === pay.id + '-ref' ? (
                              <Check size={11} className="text-emerald-600" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                          ID: {pay.id.slice(0, 16)}...
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">{pay.customerName}</span>
                        {pay.customerPhone && (
                          <span className="text-[11px] text-gray-500">{pay.customerPhone}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-gray-800 block">
                          {pay.paymentMethod || pay.method || 'BANK_TRANSFER'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {pay.provider || 'OPay Direct'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-serif font-bold text-gray-900 text-sm">
                        ₦{(pay.amount || (pay.amountKobo ? pay.amountKobo / 100 : 0)).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-gray-600">
                        {pay.verifiedBy ? (
                          <div>
                            <span className="font-medium text-gray-900 block">{pay.verifiedBy}</span>
                            <span className="text-[10px] text-gray-400">
                              {pay.verificationMethod || 'MANUAL_BANK_AUDIT'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Pending Audit</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>PAID</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock size={12} className="text-amber-600" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
