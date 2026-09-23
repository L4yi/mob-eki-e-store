import React from 'react';
import { Users, Truck, Store, Smartphone } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Users size={22} className="text-[#C9A227]" />,
      title: 'Retail & Wholesale',
      text: 'Flexible ordering for individual and business customers.',
    },
    {
      icon: <Truck size={22} className="text-[#C9A227]" />,
      title: 'Nationwide Delivery',
      text: 'Order from anywhere in Nigeria.',
    },
    {
      icon: <Store size={22} className="text-[#C9A227]" />,
      title: 'Physical Store',
      text: 'Visit us and see our products in person.',
    },
    {
      icon: <Smartphone size={22} className="text-[#C9A227]" />,
      title: 'Easy Ordering',
      text: 'Shop online or order directly through WhatsApp.',
    },
  ];

  return (
    <section className="bg-[#F8F8F6] border-y border-[#E5E7EB] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium mb-2">
          Why Choose Us
        </p>
        <h2 className="font-serif text-2xl text-[#0B1F3A] text-center font-semibold mb-12">
          Why shop with us
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <div className="w-10 h-10 bg-white border border-[#E5E7EB] flex items-center justify-center">
                {item.icon}
              </div>
              <h4 className="font-semibold text-[#0B1F3A] text-sm">{item.title}</h4>
              <p className="text-xs text-[#6B7280] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
