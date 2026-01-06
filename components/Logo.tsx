import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    sm: { icon: 32, text: 'text-xl', gap: 'gap-2' },
    md: { icon: 40, text: 'text-2xl', gap: 'gap-2.5' },
    lg: { icon: 56, text: 'text-4xl', gap: 'gap-3' }
  };

  const colorClasses = {
    default: {
      text: 'text-gray-900',
      accent: 'text-amber-500'
    },
    light: {
      text: 'text-white',
      accent: 'text-amber-400'
    }
  };

  const colors = colorClasses[variant];
  const sizes = sizeClasses[size];

  // Use appropriate logo based on variant
  const logoSrc = variant === 'light' 
    ? '/images/blackkeyx-logo-light.png' 
    : '/images/blackkeyx-logo.png';

  return (
    <Link href="/" className={`flex items-center ${sizes.gap} group`}>
      {/* Logo Image */}
      <div className="relative transition-transform duration-300 group-hover:scale-105">
        <Image
          src={logoSrc}
          alt="BlackKeyX Logo"
          width={sizes.icon}
          height={sizes.icon}
          className="object-contain"
          priority
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex items-baseline">
          <span className={`font-bold ${sizes.text} ${colors.text} tracking-tight transition-colors duration-300`}>
            Black
          </span>
          <span className={`font-bold ${sizes.text} ${colors.text} tracking-tight transition-colors duration-300`}>
            Key
          </span>
          <span className={`font-black ${sizes.text} ${colors.accent} tracking-tight transition-colors duration-300`}>
            X
          </span>
        </div>
      )}
    </Link>
  );
}
