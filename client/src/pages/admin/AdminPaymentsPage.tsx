import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPaymentTransactions()
      .then((data) => setPayments(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
          FINANCIAL AUDIT
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#0B1F3A]">
          Payment Reconciliation & Transactions
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#0B1F3A]">
            Paystack & Bank Transfer Audit Log
          </h3>
          <span className="text-xs text-gray-400">{payments.length} transactions recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Channel / Method</th>
                <th className="p-4">Amount (₦)</th>
                <th className="p-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-500 font-mono text-[11px]">
                    {new Date(pay.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-gray-900">{pay.orderNumber}</td>
                  <td className="p-4 text-gray-700">{pay.customerName}</td>
                  <td className="p-4 font-semibold text-gray-800">{pay.paymentMethod}</td>
                  <td className="p-4 font-serif font-bold text-gray-900">
                    ₦{pay.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {pay.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
