import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppBannerProps {
  whatsappNumber?: string;
}

export default function WhatsAppBanner({
  whatsappNumber = '2348108725967',
}: WhatsAppBannerProps) {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section className="bg-white py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 bg-[#25D366]/10 flex items-center justify-center mx-auto mb-5">
          <MessageCircle size={24} className="text-[#25D366]" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#0B1F3A] font-semibold mb-3">
          Prefer to order directly?
        </h2>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-7">
          Chat with M.O.B EKI VENTURES on WhatsApp for product enquiries and orders.
        </p>
        <a
          href={`https://wa.me/${cleanPhone}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-sm px-8 py-3.5 hover:bg-[#20bb5a] transition-colors"
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
