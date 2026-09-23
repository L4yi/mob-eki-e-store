import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { ChevronRight } from 'lucide-react';

export default function FeaturedCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium mb-2">
            Browse
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold">
            Shop by Category
          </h2>
        </div>
        <Link
          to="/shop"
          className="text-sm font-medium text-[#164A7A] hover:text-[#0B1F3A] transition-colors flex items-center gap-1"
        >
          View all <ChevronRight size={15} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            className="group block relative overflow-hidden bg-[#F8F8F6] border border-[#E5E7EB]"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0B1F3A]/40 group-hover:bg-[#0B1F3A]/55 transition-colors" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-serif font-semibold text-white text-sm mb-0.5">
                {cat.name}
              </h3>
              <p className="text-[11px] text-white/70">
                {cat.count ? `${cat.count} products` : 'View products'}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A227] group-hover:w-full transition-all duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
