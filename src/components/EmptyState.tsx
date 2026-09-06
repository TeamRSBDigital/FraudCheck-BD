import React from 'react';
import { SearchX, RotateCcw, AlertCircle, ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  maskedPhone: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  maskedPhone,
  onReset,
}) => {
  return (
    <div
      id="no-data-state"
      className="max-w-2xl mx-auto rounded-2xl bg-white p-8 sm:p-10 border border-slate-200/90 shadow-sm text-center animate-in fade-in duration-200"
    >
      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
        <SearchX className="w-7 h-7 stroke-[1.8]" />
      </div>

      <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 mb-3">
        {maskedPhone}
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
        No courier history found
      </h3>

      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        We couldn't find sufficient delivery history for this number across our integrated courier networks.
      </p>

      {/* Important Notice */}
      <div className="mt-6 p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-left flex items-start gap-3 max-w-lg mx-auto">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Important:</strong> A lack of records does not indicate fraudulent intent. It usually means this is a new phone number, the customer has not ordered through participating couriers, or past parcels were processed offline. Standard phone verification is advised.
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-sm text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
          id="empty-check-another-btn"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Check Another Number</span>
        </button>
      </div>
    </div>
  );
};
