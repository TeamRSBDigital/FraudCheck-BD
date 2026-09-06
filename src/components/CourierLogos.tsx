import React from 'react';
import { Package } from 'lucide-react';

const carrybeeLogo = '/images/carrybee-logo.webp';
const courierfastLogo = '/images/courierfast-logo.png';
const paperflyLogo = '/images/paperfly-logo.png';
const pathaoLogo = '/images/pathao-logo.png';
const redxLogo = '/images/redx-logo.png';
const steadfastLogo = '/images/steadfast-logo.png';

interface LogoProps {
  className?: string;
  alt?: string;
}

/**
 * Pathao Logo from images folder
 */
export const PathaoLogo: React.FC<LogoProps> = ({ className = 'h-6 w-auto', alt = 'Pathao' }) => (
  <img
    src={pathaoLogo}
    alt={alt}
    className={`object-contain max-h-full ${className}`}
    loading="lazy"
    referrerPolicy="no-referrer"
  />
);

/**
 * SteadFast Courier Logo from images folder
 */
export const SteadfastLogo: React.FC<LogoProps> = ({ className = 'h-6 w-auto', alt = 'SteadFast Courier' }) => (
  <img
    src={steadfastLogo}
    alt={alt}
    className={`object-contain max-h-full ${className}`}
    loading="lazy"
    referrerPolicy="no-referrer"
  />
);

/**
 * Courier Fast Logo from images folder
 */
export const CourierFastLogo: React.FC<LogoProps> = ({ className = 'h-6 w-auto', alt = 'Courier Fast' }) => (
  <img
    src={courierfastLogo}
    alt={alt}
    className={`object-contain max-h-full ${className}`}
    loading="lazy"
    referrerPolicy="no-referrer"
  />
);

/**
 * RedX Logo from images folder
 */
export const RedXLogo: React.FC<LogoProps> = ({ className = 'h-6 w-auto', alt = 'RedX' }) => (
  <img
    src={redxLogo}
    alt={alt}
    className={`object-contain max-h-full ${className}`}
    loading="lazy"
    referrerPolicy="no-referrer"
  />
);

/**
 * Paperfly Logo from images folder
 */
export const PaperflyLogo: React.FC<LogoProps> = ({ className = 'h-6 w-auto', alt = 'Paperfly' }) => (
  <img
    src={paperflyLogo}
    alt={alt}
    className={`object-contain max-h-full ${className}`}
    loading="lazy"
    referrerPolicy="no-referrer"
  />
);

/**
 * CarryBee Logo from images folder
 */
export const CarryBeeLogo: React.FC<LogoProps> = ({ className = 'h-6 w-auto', alt = 'CarryBee' }) => (
  <img
    src={carrybeeLogo}
    alt={alt}
    className={`object-contain max-h-full ${className}`}
    loading="lazy"
    referrerPolicy="no-referrer"
  />
);

/**
 * Courier Logo Resolver using raster images from the images directory
 */
export const CourierLogo: React.FC<{ id: string; name?: string; className?: string }> = ({
  id,
  name,
  className = 'h-5 w-auto',
}) => {
  const normalized = id.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (normalized.includes('pathao')) {
    return <PathaoLogo className={className} alt={name || 'Pathao'} />;
  }
  if (normalized.includes('steadfast')) {
    return <SteadfastLogo className={className} alt={name || 'SteadFast'} />;
  }
  if (normalized.includes('courierfast') || normalized.includes('courrierfast')) {
    return <CourierFastLogo className={className} alt={name || 'Courier Fast'} />;
  }
  if (normalized.includes('redx')) {
    return <RedXLogo className={className} alt={name || 'RedX'} />;
  }
  if (normalized.includes('paperfly')) {
    return <PaperflyLogo className={className} alt={name || 'Paperfly'} />;
  }
  if (normalized.includes('carrybee')) {
    return <CarryBeeLogo className={className} alt={name || 'CarryBee'} />;
  }

  // Fallback clean modern B2B badge
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs">
      <Package className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
      <span className="truncate max-w-[85px] tracking-tight">{name || id}</span>
    </div>
  );
};
