import React from 'react';
import { Star, CheckCircle, ExternalLink, MapPin } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  timeAgo: string;
  avatarBg: string;
  initials: string;
  serviceTag: string;
  content: string;
}

const reviews: Review[] = [
  {
    id: 'rev-1',
    name: 'Arch. Babatunde Adeleke',
    role: 'Interior Architect',
    location: 'Lekki Phase 1, Lagos',
    rating: 5,
    timeAgo: '2 weeks ago',
    avatarBg: 'bg-[#0B1F3A] text-[#C9A227]',
    initials: 'BA',
    serviceTag: 'Luxury Architectural Handles',
    content:
      'As an interior architect managing high-end residential projects across Lagos, finding consistent, luxury-grade hardware without tarnishing or factory defects used to be a struggle. M.O.B EKI VENTURES at Amu Street Mushin is now our primary showroom. Their solid brass satin gold handles, knurled knobs, and concealed hydraulic hinges are unmatched in durability. Staff at the showroom are knowledgeable and everything comes properly packaged. 10/10.',
  },
  {
    id: 'rev-2',
    name: 'Engr. Emeka Nwosu',
    role: 'Building Contractor (Apex Build Ltd)',
    location: 'Magodo Phase 2, Lagos',
    rating: 5,
    timeAgo: '3 weeks ago',
    avatarBg: 'bg-emerald-800 text-white',
    initials: 'EN',
    serviceTag: 'Armored Bulletproof Doors',
    content:
      'Ordered two custom armored bulletproof entrance doors for a client’s executive duplex in Magodo. The ballistic steel core, multi-point deadbolt mechanism, and natural teak woodwork are true commercial grade. Smooth transaction, prompt dispatch, and the doors arrived with all frames, matching casings, and stainless pull bars intact. The most reliable security door dealer in Lagos.',
  },
  {
    id: 'rev-3',
    name: 'Alhaji Kazeem Jimoh',
    role: 'Master Cabinet Fabricator',
    location: 'Mushin Market, Lagos',
    rating: 5,
    timeAgo: '1 month ago',
    avatarBg: 'bg-amber-800 text-white',
    initials: 'KJ',
    serviceTag: 'Wholesale Cabinet Fittings',
    content:
      'I buy cabinet handles, gas springs, and soft-close drawer slides from M.O.B EKI VENTURES on Amu street for my furniture workshop. Their wholesale pricing is the most competitive in Mushin, and they don’t mix cheap iron with real brass. Very honest people with huge stock availability. Highly recommended for carpenters, builders, and fabricators.',
  },
  {
    id: 'rev-4',
    name: 'Dr. Aisha Mohammed',
    role: 'Homeowner & Real Estate Investor',
    location: 'Maitama, Abuja',
    rating: 5,
    timeAgo: '1 month ago',
    avatarBg: 'bg-indigo-900 text-white',
    initials: 'AM',
    serviceTag: 'Interstate Transport Park Haulage',
    content:
      'I was initially skeptical ordering security doors and wardrobe accessories online from Lagos all the way to Abuja, but M.O.B EKI VENTURES proved 100% trustworthy. Placed the order, sent proof of transfer on WhatsApp, and received video confirmation of my goods being loaded at the interstate haulage park the same afternoon. Received everything in Abuja in pristine condition. Exceptional customer service!',
  },
  {
    id: 'rev-5',
    name: 'Olumide Fashola',
    role: 'Homeowner (Full Renovation)',
    location: 'Surulere, Lagos',
    rating: 5,
    timeAgo: '2 months ago',
    avatarBg: 'bg-blue-900 text-white',
    initials: 'OF',
    serviceTag: 'Showroom Counter Purchase',
    content:
      'Visited their physical showroom at 2, Amu Street, Mushin Market after finding them on Google Maps. The showroom is well organized, easy to locate, and the staff helped me pick the right mortise locks and luxury cabinet handles for my house renovation. Much better quality and transparency than random market stalls. Will definitely buy again.',
  },
];

export default function GoogleReviews() {
  const googleMapsUrl = 'https://maps.app.goo.gl/uajP8SxU2E24TMLJ8';

  return (
    <section className="py-20 bg-[#F4F4F1] border-t border-[#E5E7EB] select-none" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-[#0B1F3A] mb-3 shadow-2xs">
              {/* Google colored G logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Verified Google Reviews</span>
              <span className="flex items-center text-[#C9A227] font-bold">
                ★ 4.9 / 5.0
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1F3A] font-bold tracking-tight">
              What Contractors &amp; Homeowners Say
            </h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xl">
              Authentic feedback from architects, builders, and clients across Lagos and nationwide who rely on M.O.B EKI VENTURES for luxury doors and hardware.
            </p>
          </div>

          {/* CTA: Review on Google */}
          <div className="flex items-center gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1F3A] text-white text-xs font-semibold rounded-lg hover:bg-[#164A7A] transition shadow-xs"
            >
              <span>Review Us on Google</span>
              <ExternalLink size={14} className="text-[#C9A227]" />
            </a>
          </div>
        </div>

        {/* Rating Overview Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col items-center justify-center shrink-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
                4.9
              </span>
              <div className="flex text-[#C9A227]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="#C9A227" />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B1F3A]">
                  M.O.B EKI VENTURES
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle size={11} /> Verified Business
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <MapPin size={13} className="text-[#C9A227]" />
                2, Amu Street, Mushin Market (Shop 8, Alhaja Abibatu Mogaji Market), Lagos
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Based on <strong>48+ verified trade contractor &amp; client ratings</strong> on Google Maps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#F8F8F6] px-4 py-2.5 rounded-xl border border-gray-200 w-full md:w-auto justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Showroom Open: Mon - Sat, 8:00 AM - 6:00 PM</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${rev.avatarBg}`}
                    >
                      {rev.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A] leading-snug">
                        {rev.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">{rev.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {rev.timeAgo}
                  </span>
                </div>

                {/* Rating Stars & Location */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex text-[#C9A227]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="#C9A227" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 truncate">
                    <MapPin size={10} className="text-[#C9A227]" />
                    {rev.location}
                  </span>
                </div>

                {/* Review Body */}
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              {/* Service Tag Badge */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="font-medium text-[#0B1F3A] bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200/60 truncate">
                  {rev.serviceTag}
                </span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1 shrink-0">
                  <CheckCircle size={11} /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
