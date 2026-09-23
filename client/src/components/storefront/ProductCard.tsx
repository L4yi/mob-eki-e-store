import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const stockBadges = {
  in_stock: { label: 'In Stock', color: 'text-emerald-700 bg-emerald-50' },
  low_stock: { label: 'Low Stock', color: 'text-amber-700 bg-amber-50' },
  out_of_stock: { label: 'Out of Stock', color: 'text-red-600 bg-red-50' },
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const stockLevel =
    product.stockLevel ||
    (product.stockQuantity === 0
      ? 'out_of_stock'
      : product.stockQuantity <= (product.lowStockThreshold || 5)
      ? 'low_stock'
      : 'in_stock');
      
  const badge = stockBadges[stockLevel as keyof typeof stockBadges] || stockBadges.in_stock;
  const inStock = stockLevel !== 'out_of_stock';
  const imgUrl = product.images?.[0] || (product as any).image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format';

  return (
    <div className="group bg-white border border-[#E5E7EB] flex flex-col">
      <Link to={`/product/${product.id}`} className="block overflow-hidden bg-[#F8F8F6] aspect-square">
        <img
          src={imgUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] text-[#6B7280] tracking-widest uppercase mb-1">
              {product.category || product.categoryName || 'Hardware'}
            </p>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-serif text-sm font-semibold text-[#171A1F] leading-snug hover:text-[#164A7A] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </div>
          <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-sm ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <p className="text-xs text-[#6B7280] line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
          <span className="font-semibold text-[#0B1F3A] text-sm">
            ₦{product.price.toLocaleString()}
          </span>
          <button
            onClick={() => inStock && addToCart(product)}
            disabled={!inStock}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 transition-colors ${
              inStock
                ? 'bg-[#0B1F3A] text-white hover:bg-[#164A7A]'
                : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={13} />
            {inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
