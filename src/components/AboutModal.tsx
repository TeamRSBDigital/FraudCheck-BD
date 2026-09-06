import React from 'react';
import { X, Shield, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              About FraudCheck BD
            </h3>
            <p className="text-xs text-slate-500">
              Courier delivery intelligence for Bangladeshi e-commerce
            </p>
          </div>
        </div>

        <div className="py-5 space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>FraudCheck BD</strong> is a public-service delivery risk verification platform built specifically for e-commerce entrepreneurs, F-Commerce shop owners, and digital brands in Bangladesh.
          </p>
          <p>
            Our mission is to help honest merchants reduce avoidable delivery cancellations and return delivery fees while maintaining fair, objective, and privacy-conscious customer assessment standards.
          </p>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Independent & Transparent</span>
            </div>
            <p>
              We do not alter courier statistics or maintain secret blacklists. All signals are objectively retrieved from certified courier network endpoints.
            </p>

            <div className="flex items-center gap-2 font-semibold text-slate-900 pt-2">
              <HeartHandshake className="w-4 h-4 text-sky-600" />
              <span>Dedicated to Merchant Sustainability</span>
            </div>
            <p>
              Every merchant receives 50 free checks every calendar day to support daily order dispatch decisions.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
