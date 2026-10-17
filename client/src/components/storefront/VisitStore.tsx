import React from 'react';
import { MapPin, Navigation, ExternalLink, Phone, MessageCircle, Clock } from 'lucide-react';
import { BusinessSettings } from '../../types';

export default function VisitStore({ settings }: { settings?: BusinessSettings }) {
  const googleMapsUrl = 'https://maps.app.goo.gl/uajP8SxU2E24TMLJ8';
  const embedMapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.081180255286!2d3.3501048!3d6.5371096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8dc5b86bbabb%3A0x4f8bacf368d7cf66!2s1%20Amu%20St%2C%20Mushin%2C%20Lagos%20102215%2C%20Lagos!5e0!3m2!1sen!2sng!4v1729198000000!5m2!1sen!2sng';

  const rawWhatsApp = settings?.whatsapp || '08108725967';
  let cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');
  if (cleanWhatsApp.startsWith('0')) {
    cleanWhatsApp = '234' + cleanWhatsApp.substring(1);
  }

  const storeInfo = [
    {
      label: 'Location',
      value: settings?.address || 'Shop 8, Alhaja Abibatu Mogaji Modern Market, 2, Amu Street, Mushin, Lagos',
      icon: MapPin,
    },
    {
      label: 'Opening Hours',
      value: settings?.openingHours || 'Mon – Sat: 8:00 AM – 6:00 PM (Closed Sundays)',
      icon: Clock,
    },
    {
      label: 'Phone Inquiries',
      value:
        settings?.phone1 && settings?.phone2
          ? `${settings.phone1}, ${settings.phone2}${settings.phone3 ? `, ${settings.phone3}` : ''}`
          : '08108725967, 08025262598, 08028077200',
      icon: Phone,
    },
    {
      label: 'WhatsApp Dispatch',
      value: '+234 810 872 5967',
      icon: MessageCircle,
    },
  ];

  return (
    <section id="store" className="bg-[#0B1F3A] py-20 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Store Details & Fast Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-[11px] text-[#C9A227] tracking-[0.25em] uppercase font-semibold mb-2">
                Showroom & Headquarters
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight mb-4">
                Visit Our Physical Store in Mushin
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Experience our authentic luxury doors, architectural cabinet handles, soft-close hinges, and fittings in person. Inspect finishes, verify specifications, and arrange immediate pickup or nationwide park dispatch.
              </p>
            </div>

            <div className="space-y-4 bg-white/5 border border-white/10 p-5 rounded-2xl">
              {storeInfo.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent size={15} className="text-[#C9A227]" />
                    </div>
                    <div>
                      <span className="text-[#C9A227] text-[11px] font-semibold tracking-wider uppercase block">
                        {item.label}
                      </span>
                      <span className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed block mt-0.5">
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#b38e1f] text-[#0B1F3A] font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                <Navigation size={15} />
                Get Directions (Google Maps)
                <ExternalLink size={13} className="opacity-70" />
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=Hello%20M.O.B%20EKI%20VENTURES,%20I%20am%20coming%20to%20your%20Mushin%20showroom%20at%202%20Amu%20Street.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-md transition-all"
              >
                <MessageCircle size={15} />
                Chat with Showroom Desk
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Interactive Google Map */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-[#C9A227]/30 shadow-2xl bg-[#08172b]">
              {/* Header Bar on Map Container */}
              <div className="bg-[#0B1F3A]/90 backdrop-blur-md px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-xs font-semibold tracking-wide">
                    2, Amu Street, Mushin, Lagos
                  </span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#C9A227] hover:text-white flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Open Full Map</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {/* Live Interactive Map Iframe */}
              <div className="aspect-[16/11] sm:aspect-[16/10] w-full">
                <iframe
                  title="M.O.B EKI VENTURES Showroom Location - 2, Amu Street, Mushin, Lagos"
                  src={embedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter contrast-[1.02] brightness-[0.98]"
                />
              </div>

              {/* Bottom Quick Bar */}
              <div className="bg-[#0B1F3A] px-5 py-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-300 gap-2">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <MapPin size={13} className="text-[#C9A227]" />
                  <span>Alhaja Abibatu Mogaji Modern Market, Mushin</span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A227] font-semibold hover:underline"
                >
                  Navigate Now &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

