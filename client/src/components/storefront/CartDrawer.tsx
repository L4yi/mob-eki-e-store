import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeFromCart, subtotal, totalItems } =
    useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#0B1F3A] text-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C9A227]" />
              <h3 className="font-serif font-bold text-base">Your Hardware Cart</h3>
              <span className="bg-[#C9A227] text-[#0B1F3A] text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-white/10 transition text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-base text-gray-800 mb-1">
                  Your cart is empty
                </h4>
                <p className="text-xs text-gray-500 mb-6 max-w-xs">
                  Browse our extensive collection of furniture handles, hinges, and fittings.
                </p>
                <button
                  onClick={closeDrawer}
                  className="px-6 py-2.5 rounded-lg bg-[#0B1F3A] text-white text-xs font-bold hover:bg-[#164A7A] transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl border border-gray-100 bg-[#F8F8F6] items-center"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-white border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-gray-900 truncate leading-snug">
                      {product.name}
                    </h5>
                    <p className="text-[10px] text-gray-500 mb-2">SKU: {product.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0B1F3A]">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-white space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-serif font-bold text-lg text-[#0B1F3A]">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Delivery fee calculated at checkout (Lagos ₦2,500 / South-West ₦4,000 / Nationwide ₦6,000 / Mushin Pickup ₦0).
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="py-2.5 px-4 text-center border border-[#0B1F3A] text-[#0B1F3A] text-xs font-bold rounded-lg hover:bg-gray-50 transition"
                >
                  View Full Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={closeDrawer}
                  className="py-2.5 px-4 text-center bg-[#0B1F3A] text-white text-xs font-bold rounded-lg hover:bg-[#164A7A] transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
