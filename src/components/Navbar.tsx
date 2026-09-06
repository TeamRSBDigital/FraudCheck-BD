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
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-sky-100/75 via-cyan-50/80 to-teal-100/75 backdrop-blur-2xl backdrop-saturate-150 border-b border-cyan-200/70 shadow-[0_4px_24px_rgba(6,182,212,0.12)] relative overflow-hidden transition-all">
      {/* Aqua Glass Light Reflection & Specular Highlights */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none opacity-90" />
      <div className="absolute -top-10 left-1/4 w-80 h-20 bg-cyan-400/25 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 right-1/3 w-64 h-16 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo & Title with Aqua Glass Style */}
        <div className="flex items-center gap-3" id="nav-logo">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 ring-1 ring-white/60">
            <ShieldCheck className="h-5 w-5 text-white stroke-[2.3] drop-shadow-xs" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 font-display">
                BD Courier{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600">
                  Track
                </span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-800 border border-cyan-300/80 backdrop-blur-md shadow-2xs uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-xs" />
                Live
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-600 leading-tight">
              Courier Delivery Intelligence for Bangladesh
            </p>
          </div>
        </div>

        {/* Right: Quick Search Input & Quota with Aqua Glass Pills */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onFocusSearch}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-cyan-200/90 bg-white/75 hover:bg-white/95 text-slate-700 text-xs hover:border-cyan-400 hover:text-cyan-800 transition-all cursor-pointer shadow-2xs backdrop-blur-md hover:shadow-xs hover:shadow-cyan-500/15"
          >
            <Search className="w-3.5 h-3.5 text-cyan-600" />
            <span className="font-medium">Search Number...</span>
            <kbd className="ml-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-50/80 border border-cyan-200 text-cyan-800 font-semibold shadow-2xs">
              /
            </kbd>
          </button>

          {/* Quota Pill with Water/Aqua Glass Theme */}
          {remainingChecks !== null && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-100/80 via-sky-50/90 to-teal-100/70 text-cyan-950 border border-cyan-300/80 shadow-2xs backdrop-blur-md"
              title="Daily free checks remaining for your IP"
              id="quota-badge"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 drop-shadow-2xs" />
              <span className="font-mono font-bold text-cyan-950">{remainingChecks}</span>
              <span className="text-cyan-800 hidden md:inline">/ {totalLimit} free checks</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
