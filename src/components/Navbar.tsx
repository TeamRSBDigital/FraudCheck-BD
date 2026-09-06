import React, { useState } from 'react';
import { Shield, CheckCircle2, Menu, X, Clock, HelpCircle, Info } from 'lucide-react';

interface NavbarProps {
  remainingChecks: number | null;
  totalLimit: number;
  onOpenHowItWorks: () => void;
  onOpenAbout: () => void;
  onScrollToChecker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  remainingChecks,
  totalLimit,
  onOpenHowItWorks,
  onOpenAbout,
  onScrollToChecker,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onScrollToChecker();
          }}
          className="flex items-center gap-2.5 group focus:outline-none"
          id="nav-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Shield className="h-5 w-5 text-sky-400 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-950 font-display flex items-center gap-1.5">
              FraudCheck <span className="text-sky-600">BD</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider -mt-1">
              Courier Risk Intelligence
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          <button
            onClick={onScrollToChecker}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            id="nav-check-customer-btn"
          >
            Check Customer
          </button>
          <button
            onClick={onOpenHowItWorks}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
            id="nav-how-it-works-btn"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            How It Works
          </button>
          <button
            onClick={onOpenAbout}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
            id="nav-about-btn"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            About
          </button>
        </nav>

        {/* Quota Pill & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {remainingChecks !== null && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
              title="Daily free checks remaining for your IP"
              id="quota-badge"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-semibold text-slate-900">{remainingChecks}</span>
              <span className="text-slate-500">/ {totalLimit} free today</span>
            </div>
          )}

          <button
            onClick={onScrollToChecker}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
            id="nav-cta-btn"
          >
            Check Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          {remainingChecks !== null && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
              <span className="font-mono font-bold">{remainingChecks}</span>
              <span className="text-slate-500">left</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollToChecker();
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Check Customer
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenHowItWorks();
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            How It Works
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
          >
            <Info className="w-4 h-4 text-slate-400" />
            About
          </button>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToChecker();
              }}
              className="w-full text-center py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm shadow-sm"
            >
              Check Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
