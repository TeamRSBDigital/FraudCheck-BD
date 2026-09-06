import React from 'react';
import { Shield } from 'lucide-react';

interface NavbarProps {
  remainingChecks: number | null;
  totalLimit: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  remainingChecks,
  totalLimit,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5" id="nav-logo">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Shield className="h-5 w-5 text-sky-400 stroke-[2.2]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-950 font-display">
            FraudCheck <span className="text-sky-600">BD</span>
          </span>
        </div>

        {/* Quota Pill */}
        {remainingChecks !== null && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            title="Daily free checks remaining for your IP"
            id="quota-badge"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono font-semibold text-slate-900">{remainingChecks}</span>
            <span className="text-slate-500">/ {totalLimit} free today</span>
          </div>
        )}
      </div>
    </header>
  );
};

