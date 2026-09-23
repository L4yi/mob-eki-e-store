import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Order } from '../../types';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  MessageCircle,
} from 'lucide-react';

const trackingSteps = [
  { id: 'placed', label: 'Order Placed', description: 'Your order has been received', icon: Package },
  { id: 'confirmed', label: 'Payment Confirmed', description: 'Payment has been verified', icon: CheckCircle2 },
  { id: 'processing', label: 'Processing', description: 'Your order is being prepared', icon: Clock },
  { id: 'dispatched', label: 'Dispatched', description: 'On its way to the courier', icon: Package },
  { id: 'out_for_delivery', label: 'Out for Delivery', description: 'With delivery agent', icon: Truck },
  { id: 'delivered', label: 'Delivered', description: 'Order delivered successfully', icon: Home },
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const orderId = id || 'ORD-2024-001';

  useEffect(() => {
    if (id && id !== 'ORD-2024-001') {
      setLoading(true);
      api.getOrder(id)
        .then((res) => setOrder(res))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const currentStepIndex = order
    ? order.orderStatus === 'DELIVERED'
      ? 5
      : order.orderStatus === 'DISPATCHED'
      ? 3
      : order.orderStatus === 'CONFIRMED'
      ? 1
      : 2
    : 2;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium mb-1">
        Order Status
      </p>
      <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold mb-2">
        Track Your Order
      </h1>
      <p className="text-[#6B7280] text-sm mb-10">
        Order ID: {orderId} · Placed {order ? new Date(order.createdAt).toLocaleDateString() : '12 Sep 2024'}
      </p>

      {/* Desktop Horizontal Tracker */}
      <div className="hidden sm:block mb-12">
        <div className="relative flex justify-between">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E5E7EB]" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-[#C9A227] transition-all"
            style={{ width: `${(currentStepIndex / (trackingSteps.length - 1)) * 100}%` }}
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
                      ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white'
                      : 'bg-white border-[#E5E7EB] text-[#D1D5DB]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </div>
                <p
                  className={`text-[11px] font-semibold text-center mt-2 leading-tight ${
                    isCurrent ? 'text-[#0B1F3A]' : isCompleted ? 'text-[#C9A227]' : 'text-[#9CA3AF]'
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
      <div className="sm:hidden mb-12">
        <div className="relative pl-8">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E5E7EB]" />
          {trackingSteps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative flex gap-4 mb-6 last:mb-0">
                <div
                  className={`absolute -left-4 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 bg-white ${
                    isCompleted
                      ? 'border-[#C9A227]'
                      : isCurrent
                      ? 'border-[#0B1F3A]'
                      : 'border-[#E5E7EB]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-[#C9A227]" />
                  ) : (
                    <Icon size={14} className={isCurrent ? 'text-[#0B1F3A]' : 'text-[#D1D5DB]'} />
                  )}
                </div>
                <div className="pt-0.5">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent ? 'text-[#0B1F3A]' : isCompleted ? 'text-[#C9A227]' : 'text-[#9CA3AF]'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white border border-[#E5E7EB] p-6">
        <h2 className="font-serif text-base text-[#0B1F3A] font-semibold mb-5">
          Order Details
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Status', value: trackingSteps[currentStepIndex].label },
            { label: 'Estimated Delivery', value: 'Within 3–5 business days' },
            { label: 'Delivery Method', value: order?.deliveryZone === 'PICKUP' ? 'Store Pickup' : 'Standard Delivery' },
          ].map((item) => (
            <div key={item.label} className="flex gap-4 text-sm">
              <span className="w-36 text-[#6B7280] shrink-0">{item.label}</span>
              <span className="text-[#171A1F] font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Help Banner */}
      <div className="mt-5 flex items-center gap-3">
        <MessageCircle size={15} className="text-[#C9A227] shrink-0" />
        <p className="text-sm text-[#6B7280]">For delivery updates, contact us on WhatsApp.</p>
        <a
          href="https://wa.me/2348108725967"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-[#164A7A] hover:text-[#0B1F3A] transition-colors ml-auto whitespace-nowrap"
        >
          Chat on WhatsApp →
        </a>
      </div>
    </div>
  );
}
