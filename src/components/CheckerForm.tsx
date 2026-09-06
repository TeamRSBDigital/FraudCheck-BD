import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Zap, PackageCheck, AlertCircle, Sparkles } from 'lucide-react';
import { isValidBdPhone, normalizeBdPhone } from '../../lib/phone';

interface CheckerFormProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const CheckerForm: React.FC<CheckerFormProps> = ({
  onSubmit,
  isLoading,
  disabled,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  // Validate on change if touched
  useEffect(() => {
    if (!isTouched || !phoneNumber) {
      setErrorMessage(null);
      return;
    }
    const normalized = normalizeBdPhone(phoneNumber);
    if (normalized.length >= 11 && !isValidBdPhone(normalized)) {
      setErrorMessage('Enter a valid Bangladeshi mobile number (013 - 019).');
    } else {
      setErrorMessage(null);
    }
  }, [phoneNumber, isTouched]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsTouched(true);

    const normalized = normalizeBdPhone(phoneNumber);

    if (!normalized) {
      setErrorMessage('Please enter a Bangladeshi mobile number.');
      return;
    }

    if (!isValidBdPhone(normalized)) {
      setErrorMessage('Enter a valid 11-digit Bangladeshi mobile number.');
      return;
    }

    setErrorMessage(null);
    onSubmit(normalized);
  };

  const handleQuickSelect = (samplePhone: string) => {
    setPhoneNumber(samplePhone);
    setIsTouched(true);
    setErrorMessage(null);
    onSubmit(samplePhone);
  };

  return (
    <div
      id="checker-card"
      className="relative rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200/90 max-w-2xl mx-auto transition-all"
    >
      {/* Header */}
      <div className="text-center sm:text-left mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Bangladesh Courier Network Check
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 font-display">
          Check a Customer
        </h2>
        <p className="mt-1.5 text-sm sm:text-base text-slate-600">
          Enter a customer's mobile number to view available delivery history and courier risk indicators.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="phone-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Customer Mobile Number
          </label>
          <div className="relative flex items-center">
            {/* Country flag & prefix badge */}
            <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none select-none text-slate-500 border-r border-slate-200 pr-2.5">
              <span className="text-base" role="img" aria-label="Bangladesh Flag">🇧🇩</span>
              <span className="text-sm font-semibold text-slate-700 font-mono">+880</span>
            </div>

            <input
              id="phone-input"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              disabled={isLoading || disabled}
              placeholder="017XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (!isTouched) setIsTouched(true);
              }}
              className={`w-full h-14 pl-28 pr-4 text-lg font-mono font-medium rounded-xl border bg-white transition-all outline-none placeholder:text-slate-400 placeholder:font-sans ${
                errorMessage
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : 'border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-50'
              } disabled:bg-slate-50 disabled:text-slate-400`}
            />
          </div>

          {/* Inline Validation Error */}
          {errorMessage && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600 animate-in fade-in duration-150" id="phone-error-msg">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="check-customer-btn"
          disabled={isLoading || disabled}
          className="w-full h-13 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 font-semibold text-base text-white shadow-sm hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Checking Records...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Check Customer</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Interactive Samples */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-medium">Quick Test Profiles:</span>
          <span className="text-[11px] text-slate-400">Click to preview scenarios</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickSelect('01711122233')}
            className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors font-medium cursor-pointer"
          >
            Safe (93% Delv.)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('01812345655')}
            className="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors font-medium cursor-pointer"
          >
            Moderate Risk
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('01912345689')}
            className="text-xs px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors font-medium cursor-pointer"
          >
            High Risk (Returns)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect('01700000000')}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors font-medium cursor-pointer"
          >
            No Record
          </button>
        </div>
      </div>

      {/* Trust & Guarantee Row */}
      <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50/70">
          <Zap className="w-4 h-4 text-sky-600 mb-1" />
          <span className="text-xs font-semibold text-slate-800">Fast</span>
          <span className="text-[11px] text-slate-500">Sub-second query</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50/70">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
          <span className="text-xs font-semibold text-slate-800">Secure</span>
          <span className="text-[11px] text-slate-500">Encrypted server call</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50/70">
          <PackageCheck className="w-4 h-4 text-indigo-600 mb-1" />
          <span className="text-xs font-semibold text-slate-800">Courier History</span>
          <span className="text-[11px] text-slate-500">Multi-provider data</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50/70">
          <span className="text-xs font-bold text-slate-900 font-mono mb-0.5">50 Free</span>
          <span className="text-xs font-semibold text-slate-800">Per Day</span>
          <span className="text-[11px] text-slate-500">No account required</span>
        </div>
      </div>
    </div>
  );
};
