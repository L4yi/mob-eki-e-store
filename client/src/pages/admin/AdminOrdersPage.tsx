import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../lib/api';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  Eye,
  X,
  CheckCircle2,
  Truck,
  Clock,
  PackageCheck,
  Package,
  Layers,
  ArrowRight,
  Copy,
  Check,
  MessageCircle,
  Building2,
  Sparkles,
  RotateCw,
  AlertCircle,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  User,
  ShieldCheck,
} from 'lucide-react';

type TabKey = 'ALL' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

interface TransitionModalState {
  isOpen: boolean;
  order: Order | null;
  targetStatus: OrderStatus;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: 'emerald' | 'blue' | 'indigo' | 'purple' | 'red';
  notePlaceholder?: string;
  defaultNote?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Transition Dialog State
  const [transitionModal, setTransitionModal] = useState<TransitionModalState>({
    isOpen: false,
    order: null,
    targetStatus: 'CONFIRMED',
    title: '',
    description: '',
    confirmLabel: '',
    confirmVariant: 'emerald',
    notePlaceholder: '',
    defaultNote: '',
  });
  const [transitionNote, setTransitionNote] = useState('');
  const [transitionLoading, setTransitionLoading] = useState(false);

  const loadOrders = (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    api
      .getAdminOrders({ limit: 200 })
      .then((data) => {
        setOrders(data);
        if (selectedOrder) {
          const fresh = data.find((o) => o.id === selectedOrder.id);
          if (fresh) setSelectedOrder(fresh);
        }
      })
      .catch((err) => console.error('Failed to load admin orders:', err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Pipeline Counts
  const counts = useMemo(() => {
    const res: Record<TabKey, number> = {
      ALL: orders.length,
      PENDING_PAYMENT: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      DISPATCHED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orders.forEach((o) => {
      if (o.orderStatus === 'PENDING_PAYMENT') res.PENDING_PAYMENT++;
      else if (o.orderStatus === 'CONFIRMED') res.CONFIRMED++;
      else if (o.orderStatus === 'PROCESSING') res.PROCESSING++;
      else if (o.orderStatus === 'DISPATCHED' || o.orderStatus === 'OUT_FOR_DELIVERY') res.DISPATCHED++;
      else if (o.orderStatus === 'DELIVERED') res.DELIVERED++;
      else if (o.orderStatus === 'CANCELLED') res.CANCELLED++;
    });

    return res;
  }, [orders]);

  // Filtered List
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (activeTab === 'PENDING_PAYMENT') {
      list = list.filter((o) => o.orderStatus === 'PENDING_PAYMENT');
    } else if (activeTab === 'CONFIRMED') {
      list = list.filter((o) => o.orderStatus === 'CONFIRMED');
    } else if (activeTab === 'PROCESSING') {
      list = list.filter((o) => o.orderStatus === 'PROCESSING');
    } else if (activeTab === 'DISPATCHED') {
      list = list.filter((o) => o.orderStatus === 'DISPATCHED' || o.orderStatus === 'OUT_FOR_DELIVERY');
    } else if (activeTab === 'DELIVERED') {
      list = list.filter((o) => o.orderStatus === 'DELIVERED');
    } else if (activeTab === 'CANCELLED') {
      list = list.filter((o) => o.orderStatus === 'CANCELLED');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
          o.deliveryCity.toLowerCase().includes(q) ||
          o.deliveryState.toLowerCase().includes(q)
      );
    }

    return list;
  }, [orders, activeTab, searchQuery]);

  // Open Transition Modal with clear guidance
  const promptTransition = (order: Order, targetStatus: OrderStatus) => {
    setTransitionNote('');

    switch (targetStatus) {
      case 'CONFIRMED':
        setTransitionModal({
          isOpen: true,
          order,
          targetStatus: 'CONFIRMED',
          title: 'Confirm Customer Bank Transfer',
          description: `Verify that ₦${order.totalAmount.toLocaleString()} has been received in the official OPay account (8025262598 - Olaide Oladejo) for Order ${order.orderNumber}. This will commit the items to sales and email the customer that their order is accepted.`,
          confirmLabel: 'Confirm Payment & Accept Order',
          confirmVariant: 'emerald',
          notePlaceholder: 'Optional OPay reference or receipt note (e.g. Ref: 20261022-OPAY-419)',
          defaultNote: 'Direct OPay bank transfer verified and accepted.',
        });
        break;

      case 'PROCESSING':
        setTransitionModal({
          isOpen: true,
          order,
          targetStatus: 'PROCESSING',
          title: 'Start Warehouse Packaging',
          description: `Move Order ${order.orderNumber} to active preparation at our Mushin fulfillment facility (56, Palm Avenue / 2, Amu Street). The customer will receive an email letting them know their fittings are being packed.`,
          confirmLabel: 'Start Order Preparation',
          confirmVariant: 'blue',
          notePlaceholder: 'Optional packaging notes (e.g. Packed in carton 4, hinges verified)',
          defaultNote: 'Hardware items inspected and queued for packaging in Mushin.',
        });
        break;

      case 'DISPATCHED':
        setTransitionModal({
          isOpen: true,
          order,
          targetStatus: 'DISPATCHED',
          title: 'Dispatch Order with Courier / Driver',
          description: `Confirm that Order ${order.orderNumber} has been packaged and handed over for transit to ${order.deliveryCity}, ${order.deliveryState}. An email with live tracking details will be sent to the customer.`,
          confirmLabel: 'Dispatch Order Now',
          confirmVariant: 'indigo',
          notePlaceholder: 'Courier or driver details (e.g. Segun - Mushin Dispatch 0802XXXXXX)',
          defaultNote: `Dispatched for delivery to ${order.deliveryCity}, ${order.deliveryState}.`,
        });
        break;

      case 'DELIVERED':
        setTransitionModal({
          isOpen: true,
          order,
          targetStatus: 'DELIVERED',
          title: 'Mark Order as Delivered',
          description: `Confirm that customer ${order.customerName} has successfully received all architectural hardware items for Order ${order.orderNumber}. A completion and customer care email will be sent.`,
          confirmLabel: 'Confirm Delivery Complete',
          confirmVariant: 'emerald',
          notePlaceholder: 'Optional delivery sign-off note (e.g. Received by customer in person)',
          defaultNote: 'Order successfully delivered to destination.',
        });
        break;

      case 'CANCELLED':
        setTransitionModal({
          isOpen: true,
          order,
          targetStatus: 'CANCELLED',
          title: 'Cancel Order & Restock Inventory',
          description: `Are you sure you want to cancel Order ${order.orderNumber}? Any reserved hardware items will automatically be returned to available showroom stock.`,
          confirmLabel: 'Cancel Order & Restock',
          confirmVariant: 'red',
          notePlaceholder: 'Reason for cancellation (e.g. Customer requested, payment expired)',
          defaultNote: 'Order cancelled by staff audit.',
        });
        break;
    }
  };

  const handleExecuteTransition = async () => {
    if (!transitionModal.order) return;

    setTransitionLoading(true);
    try {
      const finalNote = transitionNote.trim() || transitionModal.defaultNote;
      const updated = await api.updateOrderStatus(
        transitionModal.order.id,
        transitionModal.targetStatus,
        finalNote
      );

      // Refresh list & current inspector
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      if (selectedOrder && selectedOrder.id === updated.id) {
        setSelectedOrder(updated);
      }

      setTransitionModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setTransitionLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={12} className="text-amber-600" />
            <span>Awaiting Payment</span>
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <ShieldCheck size={12} className="text-blue-600" />
            <span>Payment Verified</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Layers size={12} className="text-indigo-600" />
            <span>In Packaging</span>
          </span>
        );
      case 'DISPATCHED':
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Truck size={12} className="text-purple-600" />
            <span>Dispatched / In Transit</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <X size={12} className="text-gray-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const renderWorkflowAction = (order: Order, isCompact = true) => {
    switch (order.orderStatus) {
      case 'PENDING_PAYMENT':
        return (
          <button
            type="button"
            onClick={() => promptTransition(order, 'CONFIRMED')}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <CheckCircle2 size={13} className="shrink-0" />
            <span>Confirm Payment</span>
          </button>
        );

      case 'CONFIRMED':
        return (
          <button
            type="button"
            onClick={() => promptTransition(order, 'PROCESSING')}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Sparkles size={13} className="shrink-0" />
            <span>Start Processing</span>
          </button>
        );

      case 'PROCESSING':
        return (
          <button
            type="button"
            onClick={() => promptTransition(order, 'DISPATCHED')}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#0B1F3A] hover:bg-[#164A7A] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Truck size={13} className="shrink-0 text-[#C9A227]" />
            <span>Dispatch Order</span>
          </button>
        );

      case 'DISPATCHED':
      case 'OUT_FOR_DELIVERY':
        return (
          <button
            type="button"
            onClick={() => promptTransition(order, 'DELIVERED')}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <PackageCheck size={13} className="shrink-0" />
            <span>Mark Delivered</span>
          </button>
        );

      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md text-[11px] font-bold border border-emerald-200">
            <CheckCircle2 size={12} />
            <span>Order Fulfilled</span>
          </span>
        );

      case 'CANCELLED':
        return (
          <span className="text-gray-400 text-xs font-medium italic">
            Closed & Restocked
          </span>
        );

      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'MB';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-100/80 text-amber-900 font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
              Mushin Fulfillment HQ
            </span>
            <span className="text-xs text-gray-400">&bull;</span>
            <span className="text-xs text-gray-500 font-medium">Order Lifecycle Management</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Verify OPay customer payments, coordinate warehouse packaging, and dispatch architectural hardware orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition shadow-2xs cursor-pointer"
          >
            <RotateCw size={13} className={refreshing ? 'animate-spin text-[#0B1F3A]' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Quick Cards (easyui.site clean stats style) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setActiveTab('PENDING_PAYMENT')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === 'PENDING_PAYMENT'
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30'
              : 'bg-white border-gray-200/90 hover:border-amber-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Awaiting Payment</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-bold text-[#0B1F3A] font-serif">{counts.PENDING_PAYMENT}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">Needs bank verification</p>
        </div>

        <div
          onClick={() => setActiveTab('CONFIRMED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === 'CONFIRMED'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/30'
              : 'bg-white border-gray-200/90 hover:border-blue-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ready to Process</span>
            <Sparkles size={16} />
          </div>
          <div className="text-2xl font-bold text-[#0B1F3A] font-serif">{counts.CONFIRMED}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">Payment verified</p>
        </div>

        <div
          onClick={() => setActiveTab('PROCESSING')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === 'PROCESSING'
              ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/30'
              : 'bg-white border-gray-200/90 hover:border-indigo-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-indigo-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Packaging</span>
            <Layers size={16} />
          </div>
          <div className="text-2xl font-bold text-[#0B1F3A] font-serif">{counts.PROCESSING}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">At Mushin warehouse</p>
        </div>

        <div
          onClick={() => setActiveTab('DISPATCHED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === 'DISPATCHED'
              ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-400/30'
              : 'bg-white border-gray-200/90 hover:border-purple-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Transit</span>
            <Truck size={16} />
          </div>
          <div className="text-2xl font-bold text-[#0B1F3A] font-serif">{counts.DISPATCHED}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">With courier / driver</p>
        </div>

        <div
          onClick={() => setActiveTab('DELIVERED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            activeTab === 'DELIVERED'
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/30'
              : 'bg-white border-gray-200/90 hover:border-emerald-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fulfilled</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-2xl font-bold text-[#0B1F3A] font-serif">{counts.DELIVERED}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">Completed deliveries</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar Container */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Segmented Pill Tabs (easyui.site) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Orders', count: counts.ALL },
              { id: 'PENDING_PAYMENT', label: 'Awaiting Payment', count: counts.PENDING_PAYMENT, badgeClass: 'bg-amber-100 text-amber-900' },
              { id: 'CONFIRMED', label: 'Ready to Process', count: counts.CONFIRMED, badgeClass: 'bg-blue-100 text-blue-900' },
              { id: 'PROCESSING', label: 'In Packaging', count: counts.PROCESSING, badgeClass: 'bg-indigo-100 text-indigo-900' },
              { id: 'DISPATCHED', label: 'Dispatched', count: counts.DISPATCHED, badgeClass: 'bg-purple-100 text-purple-900' },
              { id: 'DELIVERED', label: 'Delivered', count: counts.DELIVERED, badgeClass: 'bg-emerald-100 text-emerald-900' },
              { id: 'CANCELLED', label: 'Cancelled', count: counts.CANCELLED, badgeClass: 'bg-gray-200 text-gray-800' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1F3A] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.badgeClass || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference, customer, phone..."
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
        </div>
      </div>

      {/* Modern Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#0B1F3A] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-gray-500 font-medium">Loading orders from fulfillment database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto border border-gray-100">
              <Package size={22} />
            </div>
            <h3 className="font-serif font-bold text-base text-gray-900">No orders found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? `No orders matching "${searchQuery}". Try clearing search.`
                : `There are currently no orders in the ${activeTab.replace(/_/g, ' ')} queue.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-gray-600 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Order Reference</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Amount & Status</th>
                  <th className="py-3.5 px-4">Next Guided Action</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((o) => {
                  const whatsappPhone = o.customerPhone
                    ? o.customerPhone.replace(/[^0-9]/g, '').startsWith('0')
                      ? '234' + o.customerPhone.replace(/[^0-9]/g, '').substring(1)
                      : o.customerPhone.replace(/[^0-9]/g, '')
                    : '';

                  const whatsappLink = whatsappPhone
                    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                        `Hello ${o.customerName}, this is M.O.B EKI VENTURES regarding your Order ${o.orderNumber} (₦${o.totalAmount.toLocaleString()}). Status: ${o.orderStatus.replace(/_/g, ' ')}.`
                      )}`
                    : null;

                  return (
                    <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Reference & Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-gray-900 text-xs">{o.orderNumber}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(o.orderNumber, o.id + '-num')}
                            title="Copy Order Ref"
                            className="text-gray-400 hover:text-gray-600 transition"
                          >
                            {copiedKey === o.id + '-num' ? (
                              <Check size={11} className="text-emerald-600" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {new Date(o.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#0B1F3A]/5 text-[#0B1F3A] font-bold text-[10px] flex items-center justify-center border border-gray-200 shrink-0">
                            {getInitials(o.customerName)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block leading-tight">{o.customerName}</span>
                            <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                              <span>{o.customerPhone}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(o.customerPhone, o.id + '-phone')}
                                title="Copy Phone Number"
                                className="text-gray-400 hover:text-gray-600 transition"
                              >
                                {copiedKey === o.id + '-phone' ? (
                                  <Check size={10} className="text-emerald-600" />
                                ) : (
                                  <Copy size={10} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded">
                            {o.deliveryZone}
                          </span>
                          <span className="font-semibold text-gray-800 text-xs">{o.deliveryCity}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block truncate max-w-xs mt-0.5">
                          {o.deliveryAddress}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">
                          {o.items.reduce((s, it) => s + it.quantity, 0)} units
                        </span>
                        <span className="text-[10px] text-gray-500 block truncate max-w-[140px]">
                          {o.items.map((it) => it.productName).join(', ')}
                        </span>
                      </td>

                      {/* Amount & Status */}
                      <td className="py-3.5 px-4">
                        <span className="font-serif font-bold text-gray-900 text-sm block">
                          ₦{o.totalAmount.toLocaleString()}
                        </span>
                        <div className="mt-1">{getStatusBadge(o.orderStatus)}</div>
                      </td>

                      {/* Next Guided Action */}
                      <td className="py-3.5 px-4">
                        {renderWorkflowAction(o)}
                      </td>

                      {/* Actions: WhatsApp & View */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {whatsappLink && (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noreferrer"
                              title="Message Customer on WhatsApp"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                            >
                              <MessageCircle size={15} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(o)}
                            title="Inspect Order Details"
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition cursor-pointer"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guided Transition Confirmation Modal */}
      {transitionModal.isOpen && transitionModal.order && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    transitionModal.confirmVariant === 'emerald'
                      ? 'bg-emerald-100 text-emerald-700'
                      : transitionModal.confirmVariant === 'blue'
                      ? 'bg-blue-100 text-blue-700'
                      : transitionModal.confirmVariant === 'indigo'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {transitionModal.confirmVariant === 'emerald' ? (
                    <CheckCircle2 size={16} />
                  ) : transitionModal.confirmVariant === 'blue' ? (
                    <Sparkles size={16} />
                  ) : transitionModal.confirmVariant === 'indigo' ? (
                    <Truck size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                </div>
                <h3 className="font-serif font-bold text-base text-[#0B1F3A]">
                  {transitionModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTransitionModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {transitionModal.description}
            </p>

            {/* Quick Order Snapshot */}
            <div className="bg-[#F8F8F6] p-3.5 rounded-xl border border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Reference:</span>
                <span className="font-mono font-bold text-gray-900">{transitionModal.order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer:</span>
                <span className="font-bold text-gray-900">{transitionModal.order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Payable:</span>
                <span className="font-serif font-bold text-[#0B1F3A]">
                  ₦{transitionModal.order.totalAmount.toLocaleString()}
                </span>
              </div>
              {transitionModal.targetStatus === 'CONFIRMED' && (
                <div className="pt-2 border-t border-gray-200 mt-2 text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-lg">
                  <strong>Official Receiving Bank:</strong> OPay (8025262598 - Olaide Oladejo)
                </div>
              )}
            </div>

            {/* Audit / Transition Note Input */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Audit / Courier Note (Stored in Database & Included in Email)
              </label>
              <input
                type="text"
                value={transitionNote}
                onChange={(e) => setTransitionNote(e.target.value)}
                placeholder={transitionModal.notePlaceholder || 'Optional audit reference'}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-[#0B1F3A] bg-white transition"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setTransitionModal((prev) => ({ ...prev, isOpen: false }))}
                disabled={transitionLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteTransition}
                disabled={transitionLoading}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  transitionModal.confirmVariant === 'emerald'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : transitionModal.confirmVariant === 'blue'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : transitionModal.confirmVariant === 'indigo'
                    ? 'bg-[#0B1F3A] hover:bg-[#164A7A]'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {transitionLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{transitionModal.confirmLabel}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in Order Details Inspector (easyui.site detailed inspector) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 border border-gray-200">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xl text-[#0B1F3A]">
                    {selectedOrder.orderNumber}
                  </span>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Primary Transition CTA inside Modal */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
                  Current Pipeline Phase
                </span>
                <span className="font-serif font-bold text-sm text-[#0B1F3A]">
                  {selectedOrder.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {renderWorkflowAction(selectedOrder, false)}
                {selectedOrder.orderStatus !== 'CANCELLED' && selectedOrder.orderStatus !== 'DELIVERED' && (
                  <button
                    type="button"
                    onClick={() => promptTransition(selectedOrder, 'CANCELLED')}
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Customer & Delivery Cards */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Customer Profile
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <User size={13} className="text-[#0B1F3A]" />
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone size={13} className="text-[#0B1F3A]" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 truncate">
                    <Mail size={13} className="text-[#0B1F3A]" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '').startsWith('0') ? '234' + selectedOrder.customerPhone.replace(/[^0-9]/g, '').substring(1) : selectedOrder.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedOrder.customerName}, this is M.O.B EKI VENTURES regarding your Order ${selectedOrder.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366] text-white rounded-md text-[11px] font-bold hover:bg-[#1EBE5D] transition"
                  >
                    <MessageCircle size={13} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                  Dispatch & Destination
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <MapPin size={13} className="text-[#C9A227]" />
                    <span>{selectedOrder.deliveryZone} Zone</span>
                  </div>
                  <p className="text-gray-700 font-medium">{selectedOrder.deliveryAddress}</p>
                  <p className="text-gray-500">
                    {selectedOrder.deliveryCity}, {selectedOrder.deliveryState}
                  </p>
                </div>
              </div>
            </div>

            {/* Ordered Hardware Items */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Ordered Architectural Hardware Items ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((it, idx) => (
                  <div key={it.id || idx} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{it.productName}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        SKU: {it.sku || 'N/A'} &bull; Qty: {it.quantity}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-gray-900">
                      ₦{((it.unitPriceKobo || (it as any).unitPrice * 100 || 0) * it.quantity / 100).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-[#F8F8F6] rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₦{((selectedOrder.subtotalKobo || 0) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee ({selectedOrder.deliveryZone}):</span>
                <span>₦{((selectedOrder.deliveryFeeKobo || 0) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#0B1F3A] border-t border-gray-200 pt-2">
                <span>Total Amount:</span>
                <span>₦{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-gray-500 pt-1">
                Payment Method: <strong>{selectedOrder.paymentMethod}</strong> &bull; Status: <strong>{selectedOrder.paymentStatus}</strong>
              </div>
            </div>

            {/* Supabase Audit Trail / Tracking Notes */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Supabase Timeline & Audit History
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                {selectedOrder.trackingNotes && selectedOrder.trackingNotes.length > 0 ? (
                  selectedOrder.trackingNotes.map((note, idx) => (
                    <div key={idx} className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#C9A227] mt-1.5 shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-[11px]">{note.status}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                            {new Date(note.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px] mt-0.5">{note.note}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs italic">No tracking records yet.</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <a
                href={`/orders/${selectedOrder.orderNumber}?token=${selectedOrder.trackingToken}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#0B1F3A] font-semibold hover:underline"
              >
                <span>Open Public Tracking Link</span>
                <ExternalLink size={12} />
              </a>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
