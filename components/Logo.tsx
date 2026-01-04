import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ 
  variant = 'default', 
  size = 'md',
  showText = true 
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-xl', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-2xl', gap: 'gap-2.5' },
    lg: { icon: 'w-14 h-14', text: 'text-4xl', gap: 'gap-3' }
  };

  const colorClasses = {
    default: {
      iconPrimary: '#3B82F6',
      iconSecondary: '#10B981',
      iconAccent: '#F59E0B',
      text: 'text-gray-900'
    },
    light: {
      iconPrimary: '#60A5FA',
      iconSecondary: '#34D399',
      iconAccent: '#FBBF24',
      text: 'text-white'
    }
  };

  const colors = colorClasses[variant];
  const sizes = sizeClasses[size];

  return (
    <Link href="/" className={`flex items-center ${sizes.gap} group`}>
      {/* Stylized Icon - Abstract "A" with ascending bars representing growth/altitude */}
      <div className={`${sizes.icon} relative`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background gradient circle */}
          <defs>
            <linearGradient id={`gradient-${variant}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.iconPrimary} />
              <stop offset="100%" stopColor={colors.iconSecondary} />
            </linearGradient>
            <linearGradient id={`gradient-accent-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.iconAccent} />
              <stop offset="100%" stopColor={colors.iconPrimary} />
            </linearGradient>
          </defs>
          
          {/* Main icon shape - Stylized "A" as ascending mountain/building */}
          <path
            d="M24 6L8 38H16L24 22L32 38H40L24 6Z"
            fill={`url(#gradient-${variant})`}
            className="transition-transform duration-300 group-hover:scale-105 origin-center"
          />
          
          {/* Cross bar of the "A" - representing foundation/stability */}
          <rect
            x="14"
            y="28"
            width="20"
            height="4"
            rx="2"
            fill={colors.iconAccent}
            className="transition-all duration-300 group-hover:opacity-90"
          />
          
          {/* Rising accent bar - representing growth */}
          <rect
            x="36"
            y="18"
            width="4"
            height="20"
            rx="2"
            fill={`url(#gradient-accent-${variant})`}
            className="transition-all duration-300 group-hover:translate-y-[-2px]"
          />
          
          {/* Secondary rising bar - representing additional growth */}
          <rect
            x="42"
            y="24"
            width="3"
            height="14"
            rx="1.5"
            fill={colors.iconSecondary}
            opacity="0.7"
            className="transition-all duration-300 group-hover:translate-y-[-1px]"
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold ${sizes.text} ${colors.text} tracking-tight transition-colors duration-300`}>
          Alti
        </span>
      )}
    </Link>
  );
}
