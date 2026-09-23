import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  MessageCircle,
  Truck,
  Package,
} from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';

const stockBadges = {
  in_stock: { label: 'In Stock', color: 'text-emerald-700 bg-emerald-50' },
  low_stock: { label: 'Low Stock — order soon', color: 'text-amber-700 bg-amber-50' },
  out_of_stock: { label: 'Out of Stock', color: 'text-red-600 bg-red-50' },
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getProduct(id)
      .then((p) => {
        setProduct(p);
        setSelectedImgIdx(0);
        setQuantity(1);
        return api.getProducts({ category: p.categoryId || (p as any).categorySlug });
      })
      .then((rel) => {
        setRelatedProducts(rel.filter((item) => item.id !== id).slice(0, 4));
      })
      .catch((err) => console.error('Failed loading product', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#0B1F3A] font-semibold mb-2">
          Product Not Found
        </h2>
        <p className="text-[#6B7280] text-sm mb-6">
          The item you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/shop"
          className="text-sm text-[#164A7A] font-medium hover:text-[#0B1F3A] transition-colors"
        >
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const stockLevel =
    product.stockLevel ||
    (product.stockQuantity === 0
      ? 'out_of_stock'
      : product.stockQuantity <= (product.lowStockThreshold || 5)
      ? 'low_stock'
      : 'in_stock');

  const badge = stockBadges[stockLevel as keyof typeof stockBadges] || stockBadges.in_stock;
  const inStock = stockLevel !== 'out_of_stock';
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [(product as any).image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=700&fit=crop&auto=format'];

  const categoryName = product.category || product.categoryName || 'Hardware';
  const categorySlug = (product as any).categorySlug || product.categoryId || '';

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello M.O.B EKI VENTURES, I would like to enquire about: ${product.name} (₦${product.price.toLocaleString()})`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-8">
        <Link to="/" className="hover:text-[#0B1F3A] transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-[#0B1F3A] transition-colors">
          Shop
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#6B7280]">{product.name}</span>
      </div>

      {/* Main product showcase */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="bg-[#F8F8F6] border border-[#E5E7EB] aspect-square overflow-hidden mb-3">
            <img
              src={images[selectedImgIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-16 h-16 border overflow-hidden transition-colors ${
                    selectedImgIdx === idx
                      ? 'border-[#0B1F3A]'
                      : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <Link
              to={categorySlug ? `/shop?category=${categorySlug}` : '/shop'}
              className="text-[11px] text-[#C9A227] tracking-widest uppercase font-medium hover:text-[#0B1F3A] transition-colors"
            >
              {categoryName}
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold mt-1 mb-3">
              {product.name}
            </h1>
            <p className={`text-sm font-medium ${badge.color} mb-1 inline-block px-2.5 py-0.5 rounded-sm`}>
              {badge.label}
            </p>
          </div>

          <div className="text-2xl font-bold text-[#0B1F3A]">
            ₦{product.price.toLocaleString()}
          </div>

          <p className="text-[#6B7280] text-sm leading-relaxed">
            {product.description}
          </p>

          {inStock && (
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-[#E5E7EB]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#6B7280] hover:text-[#0B1F3A] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#6B7280] hover:text-[#0B1F3A] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold text-sm py-3 transition-colors ${
                  justAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0B1F3A] text-white hover:bg-[#164A7A]'
                }`}
              >
                <ShoppingCart size={15} />
                {justAdded ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          )}

          <a
            href={`https://wa.me/2348108725967?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] font-medium text-sm py-3 hover:bg-[#25D366]/5 transition-colors"
          >
            <MessageCircle size={15} /> Enquire on WhatsApp
          </a>

          <div className="border-t border-[#E5E7EB] pt-5 space-y-3">
            <div className="flex items-start gap-3">
              <Truck size={16} className="text-[#C9A227] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#0B1F3A]">Nationwide Delivery</p>
                <p className="text-xs text-[#6B7280]">Available across all states in Nigeria.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package size={16} className="text-[#C9A227] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#0B1F3A]">Retail & Wholesale</p>
                <p className="text-xs text-[#6B7280]">Contact us for bulk pricing and wholesale orders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specs && product.specs.length > 0 && (
        <div className="mb-16">
          <h2 className="font-serif text-xl text-[#0B1F3A] font-semibold mb-5">
            Specifications
          </h2>
          <div className="border border-[#E5E7EB] divide-y divide-[#E5E7EB] bg-white">
            {product.specs.map((spec, idx) => (
              <div key={idx} className="flex px-5 py-3">
                <span className="w-40 text-xs text-[#6B7280] font-medium">
                  {spec.label}
                </span>
                <span className="text-sm text-[#171A1F]">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-serif text-xl text-[#0B1F3A] font-semibold mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
