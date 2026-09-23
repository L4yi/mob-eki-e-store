import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Product, InventoryTransaction } from '../../types';
import { Plus, Boxes, ArrowUpRight, ArrowDownLeft, RefreshCw, X } from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantityChange, setQuantityChange] = useState('20');
  const [type, setType] = useState('RESTOCK');
  const [reason, setReason] = useState('New Shipment Container Arrival at Mushin');

  const loadData = () => {
    setLoading(true);
    Promise.all([api.getProducts(), api.getInventoryTransactions()])
      .then(([prods, txs]) => {
        setProducts(prods);
        setTransactions(txs);
        if (prods.length > 0 && !selectedProductId) {
          setSelectedProductId(prods[0].id);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    try {
      const change = type === 'SALE' ? -Math.abs(Number(quantityChange)) : Math.abs(Number(quantityChange));
      await api.adjustStock(selectedProductId, change, type, reason);
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to adjust stock');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
            WAREHOUSE AUDIT TRAIL
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0B1F3A]">
            Inventory Restock & Ledger
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#0B1F3A] text-white font-bold text-xs hover:bg-[#164A7A] transition flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C9A227]" />
          Record Restock / Adjustment
        </button>
      </div>

      {/* Stock Overview Table */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#0B1F3A]">
          Live Mushin Showroom Stock Balances
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#F8F8F6] border border-gray-100 flex items-center justify-between"
            >
              <div className="truncate max-w-[180px]">
                <h4 className="font-bold text-xs text-gray-900 truncate">{p.name}</h4>
                <p className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</p>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`font-serif font-bold text-lg block ${
                    p.stockQuantity <= p.lowStockThreshold ? 'text-red-600' : 'text-[#0B1F3A]'
                  }`}
                >
                  {p.stockQuantity}
                </span>
                <span className="text-[9px] text-gray-400">units in stock</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions History Ledger */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-[#0B1F3A]">
            Complete Inventory Movement History
          </h3>
          <span className="text-xs text-gray-400">{transactions.length} transactions recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Item</th>
                <th className="p-4">Type</th>
                <th className="p-4">Quantity Change</th>
                <th className="p-4">Balance After</th>
                <th className="p-4">Reason / Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/70">
                  <td className="p-4 text-gray-500 font-mono text-[11px]">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-gray-900">{tx.productName || tx.productId}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'RESTOCK'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.type === 'SALE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        tx.quantityChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {tx.quantityChange >= 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      )}
                      {tx.quantityChange >= 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gray-800">{tx.newStock} units</td>
                  <td className="p-4 text-gray-600 max-w-xs truncate">{tx.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg text-[#0B1F3A]">
                Record Warehouse Movement
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Hardware Item</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - Current: {p.stockQuantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Movement Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="RESTOCK">RESTOCK (+)</option>
                    <option value="ADJUSTMENT">AUDIT ADJUSTMENT (+/-)</option>
                    <option value="SALE">MANUAL SALE (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    required
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Reason / Invoice Reference</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0B1F3A] text-white rounded-xl font-bold hover:bg-[#164A7A]"
                >
                  Confirm Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
