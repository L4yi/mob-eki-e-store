import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Order, OrderStatus } from '../../types';
import { Search, ShoppingBag, Eye, X, CheckCircle2, Truck, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = () => {
    setLoading(true);
    api.getAdminOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      loadOrders();
    } catch (e: any) {
      alert(e.message || 'Failed to update order status');
    }
  };

  const filtered = orders.filter((o) =>
    filterStatus === 'ALL' ? true : o.orderStatus === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
            FULFILLMENT CENTER
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B1F3A]">
            Customer Orders Management
          </h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        {['ALL', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
              filterStatus === st
                ? 'bg-[#0B1F3A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer & Phone</th>
                <th className="p-4">Zone & Destination</th>
                <th className="p-4">Items Count</th>
                <th className="p-4">Total (₦)</th>
                <th className="p-4">Status Transition</th>
                <th className="p-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <span className="font-bold text-gray-900 block font-mono">{o.orderNumber}</span>
                    <span className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-gray-900 block">{o.customerName}</span>
                    <span className="text-[11px] text-gray-500">{o.customerPhone}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-gray-800 block">{o.deliveryZone}</span>
                    <span className="text-[10px] text-gray-500 truncate max-w-xs block">{o.deliveryCity}</span>
                  </td>
                  <td className="p-4 text-gray-700 font-bold">{o.items.length} items</td>
                  <td className="p-4 font-serif font-bold text-gray-900">
                    ₦{o.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                      aria-label="Update order status"
                      className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-bold text-[#0B1F3A] focus:ring-2 focus:ring-[#0B1F3A]"
                    >
                      <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
                      <option value="PAID">PAID</option>
                      <option value="PROCESSING">PROCESSING IN MUSHIN</option>
                      <option value="DISPATCHED">DISPATCHED TO COURIER</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-2 text-gray-600 hover:text-[#0B1F3A] hover:bg-gray-100 rounded-lg transition"
                      title="Inspect Order"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Order Reference</span>
                <h3 className="font-serif font-bold text-xl text-[#0B1F3A]">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Destination */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#F8F8F6] p-4 rounded-2xl">
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block">Customer</span>
                <p className="font-bold text-gray-900 mt-0.5">{selectedOrder.customerName}</p>
                <p className="text-gray-600">{selectedOrder.customerPhone}</p>
                <p className="text-gray-600 truncate">{selectedOrder.customerEmail}</p>
              </div>
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block">Delivery Location</span>
                <p className="font-bold text-gray-900 mt-0.5">{selectedOrder.deliveryZone}</p>
                <p className="text-gray-600">{selectedOrder.deliveryAddress}</p>
                <p className="text-gray-600">{selectedOrder.deliveryCity}, {selectedOrder.deliveryState}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-gray-900">
                Ordered Hardware Items
              </h4>
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-2">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{it.productName}</span>
                      <span className="text-[10px] text-gray-400">SKU: {it.sku} &bull; Qty: {it.quantity}</span>
                    </div>
                    <span className="font-serif font-bold text-gray-900">
                      ₦{it.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
              <span className="text-gray-500">
                Payment: <strong>{selectedOrder.paymentMethod}</strong> ({selectedOrder.paymentStatus})
              </span>
              <span className="font-serif font-bold text-base text-[#0B1F3A]">
                Total: ₦{selectedOrder.totalAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-[#0B1F3A] text-white font-bold text-xs rounded-xl hover:bg-[#164A7A]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
