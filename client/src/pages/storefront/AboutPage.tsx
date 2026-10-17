import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { BusinessSettings, TeamMember } from '../../types';
import { Store, ShieldCheck, Truck, Users, MapPin, Phone, Mail, Clock, MessageSquare, Navigation, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    api.getSettings().then((data) => {
      setSettings(data.settings);
      setTeam(data.team);
    }).catch((e) => console.error(e));
  }, []);

  return (
    <div className="bg-[#F8F8F6] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
            About M.O.B EKI VENTURES
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1F3A] leading-tight">
            Nigeria's Premier Hub for Quality Furniture Accessories & Architectural Fittings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Established at 2, Amu Street in the vibrant commercial market of Mushin, Lagos, M.O.B EKI VENTURES delivers precision hardware, wholesale joinery fittings, and retail accessories to furniture makers, contractors, and builders nationwide.
          </p>
        </div>

        {/* Story & Background */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider">
              Our Journey & Heritage
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
              From Mushin Market to Every Nigerian State
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              M.O.B EKI VENTURES was founded with a clear mission: to eliminate poor-quality, easily corroded furniture hardware in the Nigerian market by providing direct access to authentic, heavy-duty architectural fittings.
            </p>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              As direct importers, we source directly from certified manufacturers across the globe. From high-grade 304 stainless steel and electroplated brushed brass cabinet handles to 3D hydraulic soft-close hinges and industrial ball-bearing slides, our catalog meets international interior standards.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-xl bg-[#F8F8F6] border border-gray-100">
                <span className="font-serif font-bold text-2xl text-[#0B1F3A] block">10,000+</span>
                <span className="text-[11px] text-gray-500 font-medium">Hardware Units Supplied</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8F8F6] border border-gray-100">
                <span className="font-serif font-bold text-2xl text-[#0B1F3A] block">36 States</span>
                <span className="text-[11px] text-gray-500 font-medium">Nationwide Logistics</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xl bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80"
                alt="Showroom Fittings"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Leadership & Key Team Members */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block mb-1">
              Executive Leadership
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
              Meet Our Founders & Management
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Dedicated leaders driving quality assurance, nationwide fulfillment, and client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Founders */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:border-[#C9A227] hover:shadow-md transition">
              <img
                src="/team/founders-mulikat-mutiu-oladejo.jpg"
                alt="Mulikat & Mutiu Oladejo - Founders & CEOs"
                className="w-32 h-36 sm:w-36 sm:h-40 rounded-2xl object-cover object-top border-2 border-[#C9A227]/40 shadow-sm shrink-0"
              />
              <div className="text-center sm:text-left space-y-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 tracking-wide">
                  FOUNDERS & CEOS
                </span>
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  Mulikat & Mutiu Oladejo
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Visionaries behind M.O.B EKI VENTURES who established our direct manufacturer supply chain and premier physical presence in Mushin Market.
                </p>
              </div>
            </div>

            {/* General Manager */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:border-[#0B1F3A] hover:shadow-md transition">
              <img
                src="/team/general-manager-oladejo-muhaz.jpg"
                alt="Oladejo Muhaz Akanbi - General Manager"
                className="w-32 h-36 sm:w-36 sm:h-40 rounded-2xl object-cover object-top border-2 border-[#0B1F3A]/40 shadow-sm shrink-0"
              />
              <div className="text-center sm:text-left space-y-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#0B1F3A] tracking-wide">
                  GENERAL MANAGER
                </span>
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  Oladejo Muhaz Akanbi
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Oversees physical store operations, commercial joinery bulk shipments, nationwide logistics, and digital client relations.
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:muhazoladejo48@gmail.com"
                    className="text-[11px] font-semibold text-[#0B1F3A] hover:text-[#C9A227] hover:underline transition"
                  >
                    muhazoladejo48@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Showroom & Interactive Google Map */}
        <div className="bg-[#0B1F3A] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
                Physical Headquarters & Showroom
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Visit Us at 2, Amu Street, Mushin Market
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Whether you need a single replacement cabinet handle or 5,000 sets of soft-close hinges for a high-rise construction project, our team is ready to assist you on-site.
              </p>
              <div className="space-y-3 pt-2 text-xs text-gray-200">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                  <span>Shop 8, Alhaja Abibatu Mogaji Modern Market, 2, Amu Street, Mushin, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>Mon - Sat: 8:00 AM - 6:00 PM (Closed Sundays)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>08108725967 &nbsp;•&nbsp; 08025262598 &nbsp;•&nbsp; 08028077200</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span>muhazoladejo48@gmail.com</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <a
                  href="https://maps.app.goo.gl/uajP8SxU2E24TMLJ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#C9A227] hover:bg-[#b38e1f] text-[#0B1F3A] font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions (Google Maps)
                  <ExternalLink size={12} className="opacity-70" />
                </a>
                <a
                  href="https://wa.me/2348108725967?text=Hello%20Oladejo%20Muhaz%2C%20I%20am%20inquiring%20about%20hardware%20from%20your%20About%20page."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Embedded Live Map */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#C9A227]/30 shadow-2xl bg-[#08172b]">
              <div className="bg-[#0B1F3A] px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-medium">Mushin Showroom Location</span>
                </div>
                <a
                  href="https://maps.app.goo.gl/uajP8SxU2E24TMLJ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A227] hover:underline flex items-center gap-1"
                >
                  <span>Open in App</span>
                  <ExternalLink size={11} />
                </a>
              </div>
              <div className="aspect-[16/10] w-full">
                <iframe
                  title="M.O.B EKI VENTURES Mushin Headquarters"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.081180255286!2d3.3501048!3d6.5371096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8dc5b86bbabb%3A0x4f8bacf368d7cf66!2s1%20Amu%20St%2C%20Mushin%2C%20Lagos%20102215%2C%20Lagos!5e0!3m2!1sen!2sng!4v1729198000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
