import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  onReset: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to complete the check right now. Please try again in a moment.',
  onRetry,
  onReset,
}) => {
  const displayMessage = typeof message === 'string'
    ? message
    : (message && typeof message === 'object' && 'message' in (message as Record<string, unknown>))
      ? String((message as { message?: unknown }).message || 'Verification could not be completed.')
      : 'Unable to complete the check right now. Please try again in a moment.';

  return (
    <div
      id="api-error-state"
      className="max-w-2xl mx-auto rounded-2xl bg-white p-8 sm:p-10 border border-rose-200 shadow-xs text-center animate-in fade-in duration-200"
    >
      <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
        <AlertTriangle className="w-7 h-7 stroke-[2]" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
        Verification Service Notice
      </h3>

      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        {displayMessage}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-sm text-white shadow-xs hover:bg-slate-800 transition-all active:scale-[0.98] cursor-pointer"
          id="error-retry-btn"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-6 py-3 font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
        >
          Enter Different Number
        </button>
      </div>
    </div>
  );
};
