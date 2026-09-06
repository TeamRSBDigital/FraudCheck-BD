import React from 'react';
import { ShieldCheck, Search, Zap } from 'lucide-react';

interface NavbarProps {
  remainingChecks: number | null;
  totalLimit: number;
  onFocusSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  remainingChecks,
  totalLimit,
  onFocusSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3" id="nav-logo">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5 text-emerald-400 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950 font-display">
                FraudCheck <span className="text-emerald-600">BD</span>
              </span>
              <span className="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">
              Courier Delivery Intelligence for Bangladesh
            </p>
          </div>
        </div>

        {/* Right: Quick Search Input & Quota */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onFocusSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs hover:border-slate-300 hover:bg-white transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search Number...</span>
            <kbd className="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500">
              /
            </kbd>
          </button>

          {/* Quota Pill */}
          {remainingChecks !== null && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
              title="Daily free checks remaining for your IP"
              id="quota-badge"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-mono font-bold text-slate-950">{remainingChecks}</span>
              <span className="text-slate-500 hidden md:inline">/ {totalLimit} free checks</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
