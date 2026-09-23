import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Order, Product, InventoryTransaction } from '../../types';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  PackageCheck,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAdminOrders(),
      api.getProducts(),
      api.getInventoryTransactions(),
    ])
      .then(([ords, prods, txs]) => {
        setOrders(ords);
        setProducts(prods);
        setTransactions(txs);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'PENDING_PAYMENT' || o.orderStatus === 'PROCESSING'
  ).length;
  const lowStockProducts = products.filter(
    (p) => p.stockQuantity <= p.lowStockThreshold
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
          EXECUTIVE SUMMARY
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#0B1F3A]">
          Business Activity Dashboard
        </h1>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Confirmed Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#0B1F3A] block">
              ₦{totalRevenue.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              From paid customer orders
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B1F3A] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#0B1F3A] block">
              {orders.length}
            </span>
            <span className="text-[11px] text-gray-500 font-semibold">
              Lifetime website orders
            </span>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Fulfillment</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#0B1F3A] block">
              {pendingOrders}
            </span>
            <span className="text-[11px] text-amber-600 font-semibold">
              Needs packing or dispatch
            </span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Radar</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-[#0B1F3A] block">
              {lowStockProducts.length}
            </span>
            <span className="text-[11px] text-red-600 font-semibold">
              Items at reorder threshold
            </span>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Orders & Stock Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-serif font-bold text-base text-[#0B1F3A]">
              Recent Customer Orders
            </h3>
            <Link to="/admin/orders" className="text-xs font-bold text-[#0B1F3A] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">No customer orders placed yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{o.orderNumber}</span>
                    <span className="text-gray-500 text-[11px]">
                      {o.customerName} • {o.deliveryZone}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-gray-900 block">
                      ₦{o.totalAmount.toLocaleString()}
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                      {o.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warehouse Activity Ledger */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-serif font-bold text-base text-[#0B1F3A]">
              Warehouse Stock Activity
            </h3>
            <Link to="/admin/inventory" className="text-xs font-bold text-[#0B1F3A] hover:underline flex items-center gap-1">
              Ledger <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="p-3 rounded-xl bg-[#F8F8F6] border border-gray-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 truncate max-w-[180px]">{tx.productName || tx.productId}</span>
                  <span
                    className={`font-bold ${
                      tx.quantityChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {tx.quantityChange >= 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">{tx.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
