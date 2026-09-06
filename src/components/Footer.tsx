import React from 'react';
import { Shield, Lock, Heart } from 'lucide-react';

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
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Shield className="h-4 w-4 text-sky-400" />
            </div>
            <span className="font-bold text-slate-900 font-display">
              FraudCheck <span className="text-sky-600">BD</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Customer delivery risk insights from available courier history.
          </p>
        </div>

        {/* Links & Quota Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-xs font-medium text-slate-600">
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
        <p>© {new Date().getFullYear()} FraudCheck BD. Built for the Bangladeshi online commerce ecosystem.</p>
        <p>Not a definitive determination of fraud. Results reflect recorded courier deliveries only.</p>
      </div>
    </footer>
  );
};
