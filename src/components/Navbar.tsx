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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3" id="nav-logo">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25">
            <ShieldCheck className="h-5 w-5 text-white stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 font-display">
                BD Courier <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Track</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
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
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-600 text-xs hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-700 transition-all cursor-pointer shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Search Number...</span>
            <kbd className="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500">
              /
            </kbd>
          </button>

          {/* Quota Pill */}
          {remainingChecks !== null && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border border-blue-200 shadow-2xs"
              title="Daily free checks remaining for your IP"
              id="quota-badge"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-mono font-bold text-blue-950">{remainingChecks}</span>
              <span className="text-blue-700 hidden md:inline">/ {totalLimit} free checks</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
