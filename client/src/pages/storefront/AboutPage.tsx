import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { BusinessSettings, TeamMember } from '../../types';
import { Store, ShieldCheck, Truck, Users, MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

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
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs hover:border-[#0B1F3A] transition">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80"
                alt="Mulikat & Mutiu Oladejo"
                className="w-28 h-28 rounded-2xl object-cover border border-gray-200 shrink-0"
              />
              <div className="text-center sm:text-left space-y-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  FOUNDERS & CEOS
                </span>
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  Mulikat & Mutiu Oladejo
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Visionaries behind M.O.B EKI VENTURES who established our strong manufacturer supply chain and physical presence in Mushin Market.
                </p>
              </div>
            </div>

            {/* General Manager */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs hover:border-[#0B1F3A] transition">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&q=80"
                alt="Oladejo Muhaz Olayiwola"
                className="w-28 h-28 rounded-2xl object-cover border border-gray-200 shrink-0"
              />
              <div className="text-center sm:text-left space-y-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#0B1F3A]">
                  GENERAL MANAGER
                </span>
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  Oladejo Muhaz Olayiwola
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Oversees physical store operations, commercial joinery bulk shipments, nationwide orders, and digital customer relations.
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:muhazoladejo48@gmail.com"
                    className="text-[11px] font-semibold text-[#0B1F3A] hover:underline"
                  >
                    muhazoladejo48@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Showroom & Contact Card */}
        <div className="bg-[#0B1F3A] text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
                Physical Headquarters
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Visit Us at 2, Amu Street, Mushin Market
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Whether you need a single replacement cabinet handle or 5,000 sets of soft-close hinges for a high-rise construction project, our team is ready to assist you on-site.
              </p>
              <div className="space-y-2.5 pt-2 text-xs text-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  <span>2, Amu Street, Mushin Market, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C9A227]" />
                  <span>Mon - Sat: 8:00 AM - 5:00 PM (Closed Sundays)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C9A227]" />
                  <span>08108725967 &nbsp;•&nbsp; 08025262598 &nbsp;•&nbsp; 08028077200</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C9A227]" />
                  <span>muhazoladejo48@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 text-center sm:text-left">
              <h3 className="font-serif font-bold text-lg text-[#C9A227]">
                Connect with Store Manager
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Need urgent technical assistance with hinge cup dimensions or handle hole centers? Chat directly on WhatsApp.
              </p>
              <a
                href="https://wa.me/2348108725967?text=Hello%20Oladejo%20Muhaz%2C%20I%20am%20inquiring%20about%20hardware%20from%20your%20About%20page."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                Chat with Oladejo Muhaz on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
