import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { Order } from '../../types';
import { Search, Package, CheckCircle2, Clock, Truck, Store, AlertCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookupOrder = async (searchStr: string) => {
    if (!searchStr.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await api.trackOrder(searchStr.trim());
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Order not found. Please verify your order or tracking number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      lookupOrder(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ query: query.trim() });
      lookupOrder(query);
    }
  };

  const steps = [
    { key: 'PENDING_PAYMENT', label: 'Order Placed', desc: 'Received in Mushin system' },
    { key: 'PAID', label: 'Payment Confirmed', desc: 'Funds verified & cleared' },
    { key: 'PROCESSING', label: 'Packed at Store', desc: '2, Amu Street showroom' },
    { key: 'DISPATCHED', label: 'Dispatched to Courier', desc: 'Handed to Nigerian courier' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'With destination rider' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Package completed' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 0;
      case 'PAID': return 1;
      case 'PROCESSING': return 2;
      case 'DISPATCHED': return 3;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'DELIVERED': return 5;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="py-12 bg-[#F8F8F6] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block mb-1">
            Real-Time Logistics
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B1F3A]">
            Track Your Hardware Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Enter your Order Number (e.g. <code>MOB-2026-XXXX</code>) or Tracking Number.
          </p>
        </div>

        {/* Search Input Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter Order Number (e.g. MOB-2026-0001)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0B1F3A]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs hover:bg-[#164A7A] transition flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Track Package'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-8">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  Order Number
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#0B1F3A]">
                  {order.orderNumber}
                </h3>
                <span className="text-xs text-gray-500">Tracking: {order.trackingNumber}</span>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  Current Status
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-block mt-1">
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Stepper Progression */}
            <div className="py-4">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} className="text-center space-y-2 relative">
                      <div
                        className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition ${
                          isDone
                            ? 'bg-[#0B1F3A] text-[#C9A227] shadow-sm'
                            : 'bg-gray-100 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-[#C9A227]/30' : ''}`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <h4 className="font-bold text-xs text-gray-900 leading-tight">
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-gray-400">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items & Delivery Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#0B1F3A]">Ordered Items</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-2.5 rounded-lg bg-[#F8F8F6]">
                      <div>
                        <span className="font-bold text-gray-900 block">{item.productName}</span>
                        <span className="text-[10px] text-gray-400">Qty: {item.quantity} × ₦{item.unitPrice.toLocaleString()}</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        ₦{item.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#0B1F3A]">Delivery Destination</h4>
                <div className="p-4 rounded-xl bg-[#F8F8F6] space-y-2">
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Phone:</strong> {order.customerPhone}</p>
                  <p><strong>Address:</strong> {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}</p>
                  <p><strong>Total Paid:</strong> ₦{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
