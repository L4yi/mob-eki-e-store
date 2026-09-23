import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.filter((p) => (p as any).featured !== false).slice(0, 8);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 8);

  return (
    <section className="bg-white py-20 border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium mb-2">
              Popular
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-medium text-[#164A7A] hover:text-[#0B1F3A] transition-colors flex items-center gap-1"
          >
            View all <ChevronRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
