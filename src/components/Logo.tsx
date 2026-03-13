import React from 'react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Logo Component
 * 
 * Displays the OutfitCreator logo with the brand name.
 * Uses the custom color palette: background (#C4EEF2), primary (#3E848C), 
 * secondary (#025159), and accent (#A67458).
 */
export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center ${gapClasses[size]} ${className}`}>
      <div className={`flex-shrink-0 ${sizeClasses[size]}`}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="OutfitCreator Logo"
        >
          {/* Background circle */}
          <circle cx="60" cy="60" r="58" fill="#C4EEF2" />
          
          {/* Main teal circle */}
          <circle cx="60" cy="45" r="30" fill="#3E848C" />
          
          {/* Inner white circle */}
          <circle cx="60" cy="45" r="20" fill="#C4EEF2" />
          
          {/* Top accent circle */}
          <circle cx="60" cy="25" r="6" fill="#3E848C" />
          
          {/* Top accent rectangle */}
          <rect x="57" y="25" width="6" height="10" fill="#3E848C" />
          
          {/* Bottom decorative path */}
          <path
            d="M 90 85 Q 90 100 60 100 Q 30 100 30 85 Q 30 70 60 70 Q 75 70 82 75 L 75 83 Q 70 78 60 78 Q 38 78 38 85 Q 38 92 60 92 Q 82 92 82 85 L 90 85"
            fill="#025159"
          />
          
          {/* Accent rectangles */}
          <rect x="52" y="40" width="4" height="8" rx="1" fill="#A67458" />
          <rect x="64" y="40" width="4" height="8" rx="1" fill="#025159" />
          
          {/* Accent circles */}
          <circle cx="85" cy="35" r="3" fill="#A67458" />
          <circle cx="92" cy="45" r="2" fill="#A67458" opacity="0.7" />
          <circle cx="35" cy="35" r="3" fill="#A67458" />
          <circle cx="28" cy="45" r="2" fill="#A67458" opacity="0.7" />
        </svg>
      </div>
      
      <div className="flex flex-col">
        <span className={`${textSizes[size]} font-bold tracking-tight text-secondary`}>
          OutfitCreator
        </span>
        <span className="text-xs tracking-wide text-primary">
          Tu armario digital
        </span>
      </div>
    </div>
  );
}

export default Logo;
