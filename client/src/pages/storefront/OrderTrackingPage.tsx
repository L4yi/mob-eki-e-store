import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Order } from '../../types';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  MessageCircle,
  Search,
  AlertCircle,
  XCircle,
  MapPin,
  Calendar,
} from 'lucide-react';

const trackingSteps = [
  { id: 'PENDING_PAYMENT', label: 'Order Placed', description: 'Received in system', icon: Package },
  { id: 'CONFIRMED', label: 'Order Confirmed', description: 'Verified by M.O.B staff', icon: CheckCircle2 },
  { id: 'PROCESSING', label: 'Processing & Packed', description: 'Packed at Mushin showroom', icon: Clock },
  { id: 'DISPATCHED', label: 'Dispatched to Courier', description: 'Handed to Nigerian courier', icon: Truck },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', description: 'With local dispatch agent', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', description: 'Handed to customer', icon: Home },
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState(id || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrder = async (queryId: string) => {
    if (!queryId || !queryId.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.getOrder(queryId.trim());
      setOrder(data);
    } catch (err: any) {
      console.error('Failed to fetch order:', err);
      setOrder(null);
      setErrorMessage(
        err.message || 'Order not found. Please check your order reference number (e.g. MOB-2026-0001).'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchInput(id);
      fetchOrder(id);
    }
  }, [id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/orders/${encodeURIComponent(searchInput.trim())}`);
      fetchOrder(searchInput.trim());
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'DISPATCHED':
        return 3;
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'DELIVERED':
        return 5;
      case 'CANCELLED':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.orderStatus) : 0;
  const isCancelled = order?.orderStatus === 'CANCELLED';

  const whatsappMsg = order
    ? encodeURIComponent(
        `Hello M.O.B EKI VENTURES, I am inquiring about Order ${order.orderNumber} (Status: ${order.orderStatus}). Please provide an update!`
      )
    : encodeURIComponent('Hello M.O.B EKI VENTURES, I would like to track my order.');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <p className="text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium mb-1">
          Real-Time Fulfillment
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold">
          Track Your Hardware Order
        </h1>
        <p className="text-[#6B7280] text-xs sm:text-sm mt-1">
          Enter your Order Number (e.g. <code>MOB-2026-XXXX</code>) to check live status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-[#E5E7EB] p-4 sm:p-6 mb-8 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. MOB-2026-0001"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-[#E5E7EB] text-sm outline-none focus:border-[#0B1F3A] transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0B1F3A] text-white px-5 py-2.5 font-semibold text-xs sm:text-sm hover:bg-[#164A7A] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Track Order'
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 mb-8 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-semibold">Lookup Failed</p>
            <p className="text-xs mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="space-y-8">
          {/* Order Header Card */}
          <div className="bg-white border border-[#E5E7EB] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Order Number
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">
                  {order.orderNumber}
                </h2>
                <div className="flex items-center gap-3 text-xs text-[#6B7280] mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>·</span>
                  <span>{order.items.length} item(s)</span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-sm text-xs font-bold inline-block mt-1 ${
                    isCancelled
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : order.orderStatus === 'DELIVERED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {order.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Stepper Progression */}
            {!isCancelled ? (
              <div className="pt-8 pb-4">
                {/* Desktop Horizontal Tracker */}
                <div className="hidden md:block">
                  <div className="relative flex justify-between">
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E5E7EB]" />
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-[#C9A227] transition-all duration-500"
                      style={{
                        width: `${(Math.max(0, currentStepIndex) / (trackingSteps.length - 1)) * 100}%`,
                      }}
                    />
                    {trackingSteps.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.id} className="relative flex flex-col items-center w-24">
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                              isCompleted
                                ? 'bg-[#C9A227] border-[#C9A227] text-white'
                                : isCurrent
                                ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white shadow-sm ring-4 ring-[#C9A227]/20'
                                : 'bg-white border-[#E5E7EB] text-[#D1D5DB]'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                          </div>
                          <p
                            className={`text-[11px] font-semibold text-center mt-2 leading-tight ${
                              isCurrent
                                ? 'text-[#0B1F3A]'
                                : isCompleted
                                ? 'text-[#C9A227]'
                                : 'text-[#9CA3AF]'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Vertical Tracker */}
                <div className="md:hidden">
                  <div className="relative pl-7 space-y-5">
                    <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-[#E5E7EB]" />
                    {trackingSteps.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const Icon = step.icon;

                      return (
                        <div key={step.id} className="relative flex gap-3">
                          <div
                            className={`absolute -left-7 w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 bg-white ${
                              isCompleted
                                ? 'border-[#C9A227] bg-[#C9A227] text-white'
                                : isCurrent
                                ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                                : 'border-[#E5E7EB] text-[#D1D5DB]'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={13} /> : <Icon size={13} />}
                          </div>
                          <div>
                            <p
                              className={`text-xs font-semibold ${
                                isCurrent
                                  ? 'text-[#0B1F3A]'
                                  : isCompleted
                                  ? 'text-[#C9A227]'
                                  : 'text-[#9CA3AF]'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[11px] text-gray-400">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <XCircle size={16} className="text-red-600 shrink-0" />
                This order was cancelled. Any reserved items have been restored to available inventory.
              </div>
            )}
          </div>

          {/* Details & Destination Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Items Card */}
            <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#0B1F3A]">Ordered Items</h3>
              <div className="divide-y divide-[#E5E7EB]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-[#171A1F]">{item.productName}</p>
                      <p className="text-[#6B7280]">
                        Qty: {item.quantity} × ₦{(item.unitPrice || (item as any).unitPriceKobo / 100 || 0).toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-[#0B1F3A]">
                      ₦{(((item.unitPrice || (item as any).unitPriceKobo / 100 || 0)) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E5E7EB] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Subtotal</span>
                  <span>₦{(order.subtotalAmount || (order as any).subtotalKobo / 100 || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#6B7280]">
                  <span>Delivery Fee</span>
                  <span>₦{(order.deliveryFee || (order as any).deliveryFeeKobo / 100 || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-[#0B1F3A] text-sm pt-2 border-t border-[#E5E7EB]">
                  <span>Total</span>
                  <span>₦{(order.totalAmount || (order as any).totalKobo / 100 || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Destination Card */}
            <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
              <h3 className="font-serif font-bold text-sm text-[#0B1F3A]">Delivery Destination</h3>
              <div className="space-y-2.5 text-xs text-[#171A1F]">
                <div>
                  <span className="text-[#6B7280] block">Recipient</span>
                  <span className="font-semibold">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block">Phone Contact</span>
                  <span className="font-mono">{order.customerPhone}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block">Delivery Address</span>
                  <span>{order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block">Delivery Type</span>
                  <span className="font-semibold">
                    {order.deliveryZone === 'PICKUP' ? 'Store Pickup (2, Amu Street, Mushin)' : `${order.deliveryZone} Delivery`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking History Notes */}
          {order.trackingNotes && order.trackingNotes.length > 0 && (
            <div className="bg-white border border-[#E5E7EB] p-6">
              <h3 className="font-serif font-bold text-sm text-[#0B1F3A] mb-4">
                Tracking Updates & Notes
              </h3>
              <div className="space-y-3">
                {order.trackingNotes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF8F5] border border-[#E5E7EB] text-xs">
                    <div className="flex justify-between text-[11px] text-[#6B7280] mb-1">
                      <span className="font-bold text-[#0B1F3A]">{note.status}</span>
                      <span>{new Date(note.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-[#171A1F]">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Support CTA */}
          <div className="bg-[#FAF8F5] border border-[#E5E7EB] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs">
              <MessageCircle size={18} className="text-[#25D366] shrink-0" />
              <span>Need immediate assistance with this order? Chat with our Mushin dispatch team.</span>
            </div>
            <a
              href={`https://wa.me/2348108725967?text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] text-white text-xs font-semibold px-4 py-2 hover:bg-[#1EBE5D] transition-colors whitespace-nowrap"
            >
              WhatsApp Dispatch →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
