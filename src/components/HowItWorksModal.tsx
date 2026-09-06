import React from 'react';
import { X, ShieldCheck, Truck, BarChart3, Lock, CheckCircle } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              How FraudCheck BD Works
            </h3>
            <p className="text-xs text-slate-500">
              Courier delivery risk verification for Bangladeshi online merchants
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="py-5 space-y-6 text-sm text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-bold">1</span>
              The COD Challenge in Bangladesh E-Commerce
            </h4>
            <p>
              In Bangladesh, over 80% of online retail orders are shipped with <strong>Cash on Delivery (COD)</strong>. When a customer repeatedly refuses parcels or cancels mid-transit, the online seller incurs round-trip courier shipping charges (typically 130 to 260 BDT per parcel) plus packaging losses.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-bold">2</span>
              Aggregated Courier Delivery History
            </h4>
            <p>
              When you enter a customer's phone number, our secure server queries the authorized BD Courier API. The API cross-references available delivery records from major logistics networks operating in Bangladesh:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-medium text-xs text-slate-800">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">✓ SteadFast Courier</div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">✓ Pathao Courier</div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">✓ RedX Logistics</div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">✓ Paperfly</div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">✓ CourierFast</div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">✓ CarryBee</div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs font-bold">3</span>
              Transparent Delivery Risk Score
            </h4>
            <p>
              Our deterministic scoring engine analyzes total parcels, delivered parcels, returns, and cancellations to produce a <strong>Delivery Risk Score (0 - 100)</strong>. We clearly categorize results into <strong>LOW RISK</strong>, <strong>MEDIUM RISK</strong>, and <strong>HIGH RISK</strong>.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <strong className="text-slate-900 block mb-0.5">Strict Privacy Standards</strong>
              We never publicly reveal unmasked customer phone numbers, sell customer records, or brand individual consumers as confirmed fraudsters. All checks are sanitized and conducted securely server-side.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
