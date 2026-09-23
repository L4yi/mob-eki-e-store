import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, total, updateQty, removeFromCart } = useCart();
  const delivery = 2000;
  const grandTotal = total + (items.length > 0 ? delivery : 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <ShoppingCart size={40} className="mx-auto text-[#D1D5DB] mb-4" />
        <h2 className="font-serif text-2xl text-[#0B1F3A] font-semibold mb-2">
          Your cart is empty
        </h2>
        <p className="text-[#6B7280] text-sm mb-8">
          Add products to your cart to proceed with checkout.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white font-semibold text-sm px-6 py-3 hover:bg-[#164A7A] transition-colors"
        >
          Browse Products <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold mb-8">
        Shopping Cart ({itemCount})
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 divide-y divide-[#E5E7EB] border-t border-b border-[#E5E7EB]">
          {items.map(({ product, quantity }) => {
            const img =
              product.images?.[0] ||
              (product as any).image ||
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format';

            return (
              <div
                key={product.id}
                className="py-6 flex gap-4 sm:gap-6 items-center"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="w-20 h-20 bg-[#F8F8F6] border border-[#E5E7EB] shrink-0 overflow-hidden"
                >
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#6B7280] uppercase tracking-widest">
                    {product.category || product.categoryName || 'Hardware'}
                  </p>
                  <Link
                    to={`/product/${product.id}`}
                    className="font-serif text-sm font-semibold text-[#171A1F] hover:text-[#164A7A] transition-colors line-clamp-1 mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <p className="font-semibold text-[#0B1F3A] text-sm mt-1">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center border border-[#E5E7EB]">
                  <button
                    onClick={() => updateQty(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#0B1F3A] transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-xs font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQty(product.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#0B1F3A] transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <p className="font-semibold text-[#0B1F3A] text-sm">
                    ₦{(product.price * quantity).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-[#9CA3AF] hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white border border-[#E5E7EB] p-6">
            <h2 className="font-serif text-base text-[#0B1F3A] font-semibold mb-5">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm pb-5 border-b border-[#E5E7EB]">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Subtotal</span>
                <span className="font-medium text-[#171A1F]">
                  ₦{total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Estimated Delivery</span>
                <span className="font-medium text-[#171A1F]">
                  ₦{delivery.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between py-4 text-base font-semibold text-[#0B1F3A]">
              <span>Total</span>
              <span>₦{grandTotal.toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-[#0B1F3A] text-white text-center font-semibold text-sm py-3 hover:bg-[#164A7A] transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
