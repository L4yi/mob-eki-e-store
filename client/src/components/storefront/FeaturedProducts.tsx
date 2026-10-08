import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ChevronRight, Package, MessageCircle } from 'lucide-react';
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

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 px-6 text-center bg-[#FAF8F5] border border-dashed border-[#E5E7EB] max-w-2xl mx-auto">
            <Package size={36} className="mx-auto text-[#C9A227] mb-3" />
            <h3 className="font-serif text-lg text-[#0B1F3A] font-semibold mb-2">
              Hardware Catalog Being Stocked
            </h3>
            <p className="text-[#6B7280] text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
              We are currently updating our online inventory with new shipments of handles, hinges, locks, and accessories.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="https://wa.me/2348108725967?text=Hello%20M.O.B%20EKI%20VENTURES,%20I%20am%20enquiring%20about%20hardware%20availability%20in%20your%20Mushin%20showroom."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-semibold px-5 py-2.5 hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle size={14} /> Enquire on WhatsApp
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-1 bg-[#0B1F3A] text-white text-xs font-semibold px-5 py-2.5 hover:bg-[#164A7A] transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
