import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light'; // 'dark' = navy text for white bg; 'light' = white text for dark bg
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  layout?: 'horizontal' | 'stacked';
  iconOnly?: boolean;
  className?: string;
}

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  layout = 'horizontal',
  iconOnly = false,
  className = '',
}: BrandLogoProps) {
  const isLight = variant === 'light';
  const isStacked = layout === 'stacked';

  const dimensions = {
    sm: {
      icon: 'h-6 sm:h-7',
      title: 'text-sm font-bold',
      subText: 'text-[8.5px]',
      gap: isStacked ? 'gap-2' : 'gap-2.5',
    },
    md: {
      icon: 'h-8 sm:h-9',
      title: 'text-base sm:text-lg font-bold',
      subText: 'text-[9.5px]',
      gap: isStacked ? 'gap-2.5' : 'gap-3',
    },
    lg: {
      icon: 'h-11 sm:h-13',
      title: 'text-xl sm:text-2xl font-bold',
      subText: 'text-[11px]',
      gap: isStacked ? 'gap-3.5' : 'gap-4',
    },
  }[size];

  return (
    <div
      className={`inline-flex ${
        isStacked ? 'flex-col items-center text-center' : 'items-center'
      } ${dimensions.gap} select-none group ${className}`}
    >
      {/* Official Golden Infinity Ribbon Emblem */}
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
        <img
          src="/brand-icon.png"
          alt="M.O.B EKI Emblem"
          className={`${dimensions.icon} w-auto object-contain drop-shadow-[0_2px_6px_rgba(201,162,39,0.22)]`}
          loading="eager"
        />
      </div>

      {!iconOnly && (
        <div className={`flex flex-col leading-none ${isStacked ? 'items-center' : ''}`}>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-serif tracking-wider uppercase ${dimensions.title} ${
                isLight ? 'text-white' : 'text-[#0B1F3A]'
              }`}
            >
              M.O.B EKI
            </span>
            <span
              className="font-serif font-semibold tracking-widest uppercase text-xs text-[#C9A227]"
            >
              VENTURES
            </span>
          </div>

          {showTagline && (
            <div
              className={`flex items-center gap-1.5 mt-1 ${
                isStacked ? 'justify-center' : ''
              }`}
            >
              <span className="h-[1px] w-3 bg-[#C9A227]" />
              <span
                className={`${dimensions.subText} font-semibold tracking-[0.18em] uppercase ${
                  isLight ? 'text-gray-300' : 'text-[#6B7280]'
                }`}
              >
                Doors &amp; Hardware Fittings
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
