import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Search, MessageSquare, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'MOB-2026-XXXX';
  const method = searchParams.get('method') || 'PAYSTACK';

  return (
    <div className="py-16 bg-[#F8F8F6] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
            Order Confirmation
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B1F3A]">
            Thank You for Your Hardware Order!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Your order has been recorded in our Mushin Market management system. Our team is preparing your hardware items for dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs text-left space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Order Reference</span>
              <span className="font-serif font-bold text-xl text-[#0B1F3A]">{orderNumber}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Processing in Mushin
            </span>
          </div>

          {method === 'BANK_TRANSFER' && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
              <h4 className="font-bold">GTBank Transfer Instructions:</h4>
              <p>Please transfer your order total to our corporate account:</p>
              <div className="p-3 bg-white rounded-lg border border-blue-100 font-mono text-xs">
                <p><strong>Bank:</strong> Guaranty Trust Bank (GTBank)</p>
                <p><strong>Account Name:</strong> M.O.B EKI VENTURES</p>
                <p><strong>Account Number:</strong> 0123456789</p>
                <p><strong>Reference:</strong> {orderNumber}</p>
              </div>
              <p className="text-[11px] text-blue-700">
                Send your payment proof on WhatsApp to <strong>08108725967</strong> for instant clearance.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Link
              to={`/track?query=${orderNumber}`}
              className="py-3 px-4 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs hover:bg-[#164A7A] transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-[#C9A227]" />
              Track Real-Time Status
            </Link>

            <a
              href={`https://wa.me/2348108725967?text=${encodeURIComponent(
                `Hello Oladejo Muhaz, I just placed order ${orderNumber} on the M.O.B EKI VENTURES website.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-emerald-600 transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Notify Store on WhatsApp
            </a>
          </div>
        </div>

        <div className="pt-4">
          <Link to="/shop" className="text-xs font-bold text-[#0B1F3A] hover:underline inline-flex items-center gap-1">
            Browse More Hardware Catalog Items <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
