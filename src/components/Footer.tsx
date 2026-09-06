import React from 'react';
import { Shield, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'privacy' | 'terms' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white mt-16 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Mission */}
        <div className="text-center md:text-left space-y-1.5">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 font-display">
              BD Courier <span className="text-blue-600">Track</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Check courier order history & success rates across Bangladesh.
          </p>
        </div>

        {/* Links, API Credit & Quota Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs font-medium text-slate-600">
          {/* API Credit */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-900">
            <span className="text-slate-500">API Credit:</span>
            <a
              href="https://courier.com.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 hover:underline"
            >
              courier.com.bd
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>50 free checks every day</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <button
              onClick={() => onOpenLegal('contact')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <p>© {new Date().getFullYear()} Developed by <span className="font-semibold text-slate-700">RAYHAN BISWAS</span>. All rights reserved.</p>
        <p>
          Powered by BD Courier API (
          <a
            href="https://courier.com.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-600 hover:text-blue-600 underline decoration-slate-300"
          >
            courier.com.bd
          </a>
          ). Results reflect recorded courier shipments.
        </p>
      </div>
    </footer>
  );
};
