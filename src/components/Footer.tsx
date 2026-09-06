import React from 'react';
import { ShieldCheck, ExternalLink, Lock, Award } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'privacy' | 'terms' | 'license' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white mt-16 text-slate-600 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Top Row: Brand on left, Pills & Nav Links on right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Brand Info */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-slate-900 font-display tracking-tight">
                  BD Courier <span className="text-blue-600">Track</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Check courier order history & success rates across Bangladesh.
              </p>
            </div>
          </div>

          {/* Right Section: Pills & Links nicely wrapped */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:justify-end">
            {/* API Credit Pill */}
            <a
              href="https://courier.com.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold border border-sky-200/90 transition-all shadow-2xs hover:shadow-xs"
              title="Official BD Courier API"
            >
              <span>API Credit:</span>
              <span className="font-bold underline decoration-sky-300">courier.com.bd</span>
              <ExternalLink className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            </a>

            {/* Quota Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50/80 text-blue-900 text-xs font-semibold border border-blue-200/80 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>50 free checks every day</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-600 pl-1">
              <button
                type="button"
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => onOpenLegal('terms')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Terms
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => onOpenLegal('license')}
                className="hover:text-blue-600 font-bold text-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                id="footer-license-btn"
              >
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>License</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => onOpenLegal('contact')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Developer credit & API attribution */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
          <p className="font-normal">
            &copy; {new Date().getFullYear()} Developed by{' '}
            <span className="font-bold text-slate-900 font-mono tracking-tight bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              RAYHAN BISWAS
            </span>
            . All rights reserved.
          </p>

          <p className="text-[11px] text-slate-400">
            Powered by BD Courier API (
            <a
              href="https://courier.com.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:underline font-medium"
            >
              courier.com.bd
            </a>
            ). Results reflect recorded courier shipments.
          </p>
        </div>
      </div>
    </footer>
  );
};
