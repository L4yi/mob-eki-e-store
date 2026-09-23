import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Camera } from 'lucide-react';
import { BusinessSettings } from '../../types';

export default function Footer({ settings }: { settings?: BusinessSettings }) {
  const whatsapp = settings?.whatsapp || '08108725967';
  const phone = settings?.phone1 || '08108725967';
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#0B1F3A] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="font-serif font-semibold text-base tracking-wide uppercase mb-1">
            M.O.B EKI VENTURES
          </div>
          <div className="text-[11px] text-[#C9A227] tracking-widest uppercase mb-4">
            Furniture Accessories
          </div>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            Quality furniture accessories and fittings for retail and wholesale customers across Nigeria.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C9A227] mb-4">
            Shop
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Shop All', to: '/shop' },
              { label: 'Categories', to: '/shop' },
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/#store' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C9A227] mb-4">
            Customer Support
          </h4>
          <ul className="space-y-2.5">
            {['Delivery', 'Returns', 'FAQs', 'Track Order'].map((item) => (
              <li key={item}>
                <Link
                  to={item === 'Track Order' ? '/orders/ORD-2024-001' : '/'}
                  className="text-sm text-[#9CA3AF] hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#C9A227] mb-4">
            Contact
          </h4>
          <ul className="space-y-3">
            <li>
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
              >
                <Phone size={14} /> Phone
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
              >
                <Camera size={14} /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6B7280] text-xs">
            © {new Date().getFullYear()} M.O.B EKI VENTURES. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/" className="text-[#6B7280] hover:text-white text-xs transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/" className="text-[#6B7280] hover:text-white text-xs transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
