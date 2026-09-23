import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';

interface HeroProps {
  whatsappNumber?: string;
}

export default function Hero({ whatsappNumber = '2348108725967' }: HeroProps) {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section className="relative min-h-[580px] lg:min-h-[680px] flex items-center overflow-hidden bg-[#0B1F3A]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=900&fit=crop&auto=format)',
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0B1F3A]/70" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 max-w-2xl">
        <p className="text-[#C9A227] text-xs tracking-[0.2em] uppercase font-medium mb-5">
          M.O.B EKI VENTURES
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-6">
          Furniture accessories
          <br className="hidden sm:block" /> for every space.
        </h1>
        <p className="text-white/75 text-base sm:text-lg max-w-lg mb-10 leading-relaxed">
          Quality furniture accessories and fittings available for retail and wholesale orders — delivered nationwide across Nigeria.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0B1F3A] font-semibold text-sm px-6 py-3 hover:bg-[#b8911e] transition-colors"
          >
            Shop Products <ArrowRight size={15} />
          </Link>
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-white/40 text-white font-medium text-sm px-6 py-3 hover:bg-white/10 transition-colors"
          >
            <MessageCircle size={15} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
