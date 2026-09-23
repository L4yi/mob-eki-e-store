import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { Product, Category } from '../../types';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [showFilters, setShowFilters] = useState(true);

  const categorySlug = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (categorySlug) {
      list = list.filter(
        (p) =>
          (p as any).categorySlug === categorySlug ||
          p.categoryId === categorySlug ||
          p.category?.toLowerCase() === categorySlug.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'featured') {
      list.sort((a, b) => ((b as any).featured ? 1 : 0) - ((a as any).featured ? 1 : 0));
    }

    return list;
  }, [products, categorySlug, searchQuery, sortBy]);

  const activeCategoryObj = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Title */}
      <div className="mb-8">
        <p className="text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium mb-1">
          Products
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold">
          Shop Furniture Accessories
        </h1>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#0B1F3A] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#E5E7EB] bg-white text-sm px-3 py-2.5 outline-none focus:border-[#0B1F3A] transition-colors text-[#171A1F]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`flex items-center gap-2 border text-sm px-3 py-2.5 transition-colors ${
              showFilters
                ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#0B1F3A] hover:text-[#0B1F3A]'
            }`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Category Pills Drawer */}
      {showFilters && (
        <div className="mb-8 p-5 bg-white border border-[#E5E7EB]">
          <p className="text-xs font-semibold text-[#0B1F3A] tracking-widest uppercase mb-3">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategorySelect('')}
              className={`text-xs px-4 py-1.5 border transition-colors ${
                categorySlug
                  ? 'border-[#E5E7EB] text-[#6B7280] hover:border-[#0B1F3A] hover:text-[#0B1F3A]'
                  : 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`text-xs px-4 py-1.5 border transition-colors ${
                  categorySlug === cat.slug
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#0B1F3A] hover:text-[#0B1F3A]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filter Indicator */}
      {categorySlug && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-[#6B7280]">Showing:</span>
          <span className="inline-flex items-center gap-1.5 bg-[#0B1F3A]/5 text-[#0B1F3A] text-xs font-medium px-3 py-1">
            {activeCategoryObj?.name || categorySlug}
            <button onClick={() => handleCategorySelect('')} className="hover:text-[#C9A227]">
              <X size={12} />
            </button>
          </span>
        </div>
      )}

      {/* Product count */}
      <p className="text-xs text-[#6B7280] mb-5">
        {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
      </p>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <Search size={32} className="mx-auto text-[#D1D5DB] mb-4" />
          <h3 className="font-serif text-lg text-[#0B1F3A] font-medium mb-2">No products found</h3>
          <p className="text-[#6B7280] text-sm">Try adjusting your search or filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategorySelect('');
            }}
            className="mt-5 text-sm text-[#164A7A] font-medium hover:text-[#0B1F3A] transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
