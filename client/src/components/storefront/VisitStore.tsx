import React from 'react';
import { Store } from 'lucide-react';
import { BusinessSettings } from '../../types';

export default function VisitStore({ settings }: { settings?: BusinessSettings }) {
  const storeInfo = [
    {
      label: 'Location',
      value: settings?.address || '2, Amu Street, Mushin Market, Lagos',
    },
    {
      label: 'Opening Hours',
      value: settings?.openingHours || 'Mon – Sat: 8:00 AM – 5:00 PM',
    },
    {
      label: 'Phone',
      value:
        settings?.phone1 && settings?.phone2
          ? `${settings.phone1}, ${settings.phone2}${settings.phone3 ? `, ${settings.phone3}` : ''}`
          : '08108725967, 08025262598, 08028077200',
    },
    {
      label: 'WhatsApp',
      value: settings?.whatsapp || '08108725967',
    },
  ];

  return (
    <section id="store" className="bg-[#0B1F3A] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[11px] text-[#C9A227] tracking-[0.2em] uppercase font-medium mb-2">
              Find Us
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-semibold mb-6">
              Visit Our Store
            </h2>
            <div className="space-y-4">
              {storeInfo.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <span className="text-[#C9A227] text-xs font-semibold tracking-widest uppercase w-28 shrink-0 pt-0.5">
                    {item.label}
                  </span>
                  <span className="text-white/70 text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#164A7A]/30 border border-white/10 aspect-video flex items-center justify-center">
            <div className="text-center text-white/40">
              <Store size={32} className="mx-auto mb-2" />
              <p className="text-xs">Map / Directions</p>
              <p className="text-[10px] mt-1">2, Amu Street, Mushin Market, Lagos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
