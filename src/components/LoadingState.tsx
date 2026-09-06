import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface LoadingStateProps {
  phone?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = () => {
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(2), 500);
    const t2 = setTimeout(() => setStep(3), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in duration-200">
      {/* Loading Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
        <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            Checking Customer...
          </h3>
          <p className="text-xs text-slate-500">
            Querying partner courier delivery records across Bangladesh
          </p>
        </div>
      </div>

      {/* Progress Status Steps */}
      <div className="py-5 space-y-3.5" aria-live="polite">
        {/* Step 1 */}
        <div className="flex items-center gap-3">
          {step >= 1 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 shrink-0" />
          )}
          <span className={`text-sm ${step >= 1 ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
            Validating phone number format
          </span>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-3">
          {step > 2 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : step === 2 ? (
            <div className="w-5 h-5 rounded-full border-2 border-sky-600 border-t-transparent animate-spin shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 shrink-0" />
          )}
          <span className={`text-sm ${step >= 2 ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
            Querying BD Courier network records
          </span>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-3">
          {step > 3 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : step === 3 ? (
            <div className="w-5 h-5 rounded-full border-2 border-sky-600 border-t-transparent animate-spin shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 shrink-0" />
          )}
          <span className={`text-sm ${step === 3 ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
            Analyzing delivery history & calculating risk indicators
          </span>
        </div>
      </div>

      {/* Shimmer Skeleton preview */}
      <div className="pt-5 border-t border-slate-100 space-y-4">
        <div className="h-28 w-full rounded-xl bg-slate-100 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-20 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
