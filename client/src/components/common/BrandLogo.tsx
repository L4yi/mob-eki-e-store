import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light'; // 'dark' = dark navy text for white backgrounds; 'light' = white text for dark navy backgrounds
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
}: BrandLogoProps) {
  const isLight = variant === 'light';

  const dimensions = {
    sm: { box: 'w-9 h-9', title: 'text-sm', sub: 'text-[8.5px]' },
    md: { box: 'w-11 h-11', title: 'text-base sm:text-lg', sub: 'text-[9.5px]' },
    lg: { box: 'w-14 h-14', title: 'text-xl sm:text-2xl', sub: 'text-[10.5px]' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Bespoke Architectural Crest & Monogram SVG */}
      <div className={`${dimensions.box} relative shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="mobGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3E5AB" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#C9A227" />
              <stop offset="100%" stopColor="#997A15" />
            </linearGradient>
            <linearGradient id="mobNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#122B4D" />
              <stop offset="100%" stopColor="#071527" />
            </linearGradient>
          </defs>

          {/* Outer Octagonal Luxury Shield */}
          <path
            d="M60 4 L104 22 L114 60 L104 98 L60 116 L16 98 L6 60 L16 22 Z"
            fill="url(#mobNavyGrad)"
            stroke="url(#mobGoldGrad)"
            strokeWidth="3.5"
          />

          {/* Inner Architectural Frame Border */}
          <path
            d="M60 11 L97 26 L106 60 L97 94 L60 109 L23 94 L14 60 L23 26 Z"
            fill="none"
            stroke="url(#mobGoldGrad)"
            strokeWidth="1"
            strokeOpacity="0.55"
          />

          {/* Top Architectural Portal Arch */}
          <path
            d="M36 42 C36 27, 84 27, 84 42"
            stroke="url(#mobGoldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Crown Diamond Accent */}
          <polygon points="60,16 64,22 60,28 56,22" fill="url(#mobGoldGrad)" />

          {/* Interlocking Architectural 'M' Monogram Pillars (Representing Doors & Hardware) */}
          <path
            d="M31 84 V42 H39 L60 67 L81 42 H89 V84 H80 V56 L60 79 L40 56 V84 H31 Z"
            fill="url(#mobGoldGrad)"
          />

          {/* Door Handle / Mortise Lock Accent Bar at Base */}
          <rect x="42" y="90" width="36" height="3.5" rx="1.75" fill="url(#mobGoldGrad)" />
          <circle cx="60" cy="91.75" r="3" fill="#0B1F3A" stroke="url(#mobGoldGrad)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-serif font-bold tracking-wider uppercase ${dimensions.title} ${
              isLight ? 'text-white' : 'text-[#0B1F3A]'
            }`}
          >
            M.O.B EKI
          </span>
          <span className={`font-serif font-semibold tracking-widest uppercase text-xs text-[#C9A227]`}>
            VENTURES
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-[1px] w-3 bg-[#C9A227]" />
            <span
              className={`${dimensions.sub} font-semibold tracking-[0.18em] uppercase ${
                isLight ? 'text-gray-300' : 'text-[#6B7280]'
              }`}
            >
              Doors &amp; Hardware Fittings
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
