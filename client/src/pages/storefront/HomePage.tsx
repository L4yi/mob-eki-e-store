import React, { useEffect, useState } from 'react';
import Hero from '../../components/storefront/Hero';
import FeaturedCategories from '../../components/storefront/FeaturedCategories';
import FeaturedProducts from '../../components/storefront/FeaturedProducts';
import RetailWholesaleSection from '../../components/storefront/RetailWholesaleSection';
import WhyChooseUs from '../../components/storefront/WhyChooseUs';
import WhatsAppBanner from '../../components/storefront/WhatsAppBanner';
import VisitStore from '../../components/storefront/VisitStore';
import NewsletterSection from '../../components/storefront/NewsletterSection';
import { api } from '../../lib/api';
import { Product, Category, BusinessSettings } from '../../types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProducts(),
      api.getCategories(),
      api.getSettings(),
    ])
      .then(([prods, cats, settData]) => {
        setProducts(prods);
        setCategories(cats);
        setSettings(settData.settings);
      })
      .catch((err) => console.error('Failed loading homepage data', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0B1F3A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={products.filter((p) => p.featured || p.active)} />
      <RetailWholesaleSection />
      <WhyChooseUs />
      <WhatsAppBanner />
      <VisitStore settings={settings || undefined} />
      <NewsletterSection />
    </div>
  );
}
